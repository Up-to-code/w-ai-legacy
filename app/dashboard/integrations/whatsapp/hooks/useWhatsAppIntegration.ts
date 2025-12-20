"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/hooks/use-toast";
import { 
  connectIntegration, 
  getIntegration, 
  disconnectIntegration, 
  updateIntegrationSettings 
} from "@/app/actions/integrations";
import { verifyWebhookSubscription } from "@/app/actions/verify-webhook-subscription";
import { sendTestMessage } from "@/app/actions/send-test-message";
import type { WhatsAppFormData, WhatsAppStatus, WhatsAppLoadingStates, WhatsAppAIConfig } from "../types";

const BASE_WEBHOOK_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhook/whatsapp`;

const generateToken = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

const defaultAIConfig: WhatsAppAIConfig = {
  enabled: true,
  responseDelay: 2,
  businessHoursOnly: false,
  businessHours: {
    start: "09:00",
    end: "18:00",
    timezone: "Africa/Cairo",
    days: [1, 2, 3, 4, 5] // Mon-Fri
  },
  fallbackMessage: "شكراً لتواصلك! سنرد عليك في أقرب وقت."
};

const initialFormData: WhatsAppFormData = {
  accessToken: "",
  phoneNumberId: "",
  businessAccountId: "",
  verifyToken: "",
  aiAutoResponse: defaultAIConfig
};

const initialLoadingStates: WhatsAppLoadingStates = {
  isLoading: true,
  isSaving: false,
  isVerifying: false,
  isDisconnecting: false,
  isSendingTest: false,
  isRefreshingToken: false
};

export function useWhatsAppIntegration() {
  const toast = useToast();
  const router = useRouter();

  // Core State
  const [formData, setFormDataState] = useState<WhatsAppFormData>(initialFormData);
  const [status, setStatus] = useState<WhatsAppStatus>("loading");
  const [step, setStep] = useState(1);
  const [editMode, setEditMode] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Loading States
  const [loadingStates, setLoadingStates] = useState<WhatsAppLoadingStates>(initialLoadingStates);

  // Helper to update specific loading state
  const setLoading = useCallback((key: keyof WhatsAppLoadingStates, value: boolean) => {
    setLoadingStates(prev => ({ ...prev, [key]: value }));
  }, []);

  // Load initial data from DB
  useEffect(() => {
    async function loadIntegration() {
      console.log("[useWhatsAppIntegration] Loading integration from DB...");
      try {
        const result = await getIntegration("whatsapp");
        
        console.log("[useWhatsAppIntegration] getIntegration result:", JSON.stringify(result, null, 2));
        
        if (result.success && result.data) {
          const credentials = typeof result.data.credentials === 'string' 
            ? JSON.parse(result.data.credentials) 
            : result.data.credentials;
          
          console.log("[useWhatsAppIntegration] Parsed credentials:", credentials);
          
          // Check if we have valid credentials (accessToken and phoneNumberId are minimum required)
          const hasValidCredentials = credentials?.accessToken && credentials?.phoneNumberId;
          
          if (hasValidCredentials) {
            // If credentials exist, treat as connected (show ConnectedView)
            console.log("[useWhatsAppIntegration] Valid credentials found, showing ConnectedView");
            setStatus("connected");
            
            setFormDataState({
              accessToken: credentials.accessToken || "",
              phoneNumberId: credentials.phoneNumberId || "",
              businessAccountId: credentials.businessAccountId || "",
              verifyToken: credentials.verifyToken || generateToken(),
              aiAutoResponse: credentials.aiAutoResponse || defaultAIConfig
            });
            setUserId(result.data.userId);
          } else {
            console.log("[useWhatsAppIntegration] No valid credentials, showing wizard");
            setStatus("disconnected");
            setFormDataState(prev => ({ ...prev, verifyToken: generateToken() }));
            setUserId(result.data.userId);
          }
        } else {
          console.log("[useWhatsAppIntegration] No integration data found, showing wizard");
          setStatus("disconnected");
          setFormDataState(prev => ({ ...prev, verifyToken: generateToken() }));
        }
      } catch (error) {
        console.error("[useWhatsAppIntegration] Failed to load integration:", error);
        setStatus("disconnected");
      } finally {
        setLoading("isLoading", false);
      }
    }
    
    loadIntegration();
  }, [setLoading]);

  // Update form data (partial updates supported)
  const setFormData = useCallback((data: Partial<WhatsAppFormData>) => {
    setFormDataState(prev => ({ ...prev, ...data }));
  }, []);

  // Copy to clipboard
  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("تم النسخ بنجاح");
  }, [toast]);

  // Refresh verify token
  const refreshToken = useCallback(async () => {
    setLoading("isRefreshingToken", true);
    const newToken = generateToken();
    const updatedData = { ...formData, verifyToken: newToken };
    setFormDataState(updatedData);
  
    if (status === 'connected') {
      try {
        await updateIntegrationSettings("whatsapp", { credentials: updatedData });
        toast.success("تم تحديث رمز التحقق");
      } catch (error) {
        console.error("Failed to save token:", error);
        toast.error("فشل حفظ الرمز الجديد");
      }
    }
    setLoading("isRefreshingToken", false);
  }, [formData, status, toast, setLoading]);

  // Save credentials (Step 1 -> Step 2)
  const saveCredentials = useCallback(async (): Promise<boolean> => {
    setLoading("isSaving", true);
    try {
      const result = await connectIntegration("whatsapp", {
        accessToken: formData.accessToken,
        phoneNumberId: formData.phoneNumberId,
        businessAccountId: formData.businessAccountId,
        verifyToken: formData.verifyToken
      });

      if (result.success) {
        toast.success("تم حفظ البيانات بنجاح");
        setStep(2);
        return true;
      } else {
        toast.error(result.error || "فشل حفظ البيانات");
        return false;
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الاتصال");
      return false;
    } finally {
      setLoading("isSaving", false);
    }
  }, [formData, toast, setLoading]);

  // Verify webhook (Step 2 -> Step 3)
  const verifyWebhook = useCallback(async (): Promise<boolean> => {
    setLoading("isVerifying", true);
    try {
      const result = await verifyWebhookSubscription(
        "whatsapp",
        formData.accessToken
      );

      if (result.success && result.verified) {
        await updateIntegrationSettings("whatsapp", { 
          credentials: formData, 
          status: 'connected' 
        });
        setStep(3);
        toast.success("تم التحقق من الويب هوك بنجاح!");
        return true;
      } else {
        toast.error(result.error || "فشل التحقق. تأكد من إعدادات Meta.");
        return false;
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء التحقق");
      return false;
    } finally {
      setLoading("isVerifying", false);
    }
  }, [formData, toast, setLoading]);

  // Save settings (Connected Mode)
  const saveSettings = useCallback(async (): Promise<boolean> => {
    setLoading("isSaving", true);
    try {
      const result = await updateIntegrationSettings("whatsapp", { credentials: formData });
      if (result.success) {
        toast.success("تم حفظ التعديلات بنجاح");
        setEditMode(false);
        return true;
      } else {
        toast.error(result.error || "فشل حفظ التعديلات");
        return false;
      }
    } catch (error) {
      toast.error("فشل حفظ التعديلات");
      return false;
    } finally {
      setLoading("isSaving", false);
    }
  }, [formData, toast, setLoading]);

  // Disconnect
  const disconnect = useCallback(async (): Promise<boolean> => {
    setLoading("isDisconnecting", true);
    try {
      const result = await disconnectIntegration("whatsapp");
      if (result.success) {
        setStatus("disconnected");
        setStep(1);
        setFormDataState({
          ...initialFormData,
          verifyToken: generateToken()
        });
        setShowDisconnectModal(false);
        toast.success("تم إلغاء الربط بنجاح");
        router.refresh();
        return true;
      } else {
        toast.error(result.error || "فشل إلغاء الربط");
        return false;
      }
    } catch (error) {
      toast.error("فشل إلغاء الربط");
      return false;
    } finally {
      setLoading("isDisconnecting", false);
    }
  }, [toast, router, setLoading]);

  // Send test message
  const sendTest = useCallback(async (phone: string): Promise<boolean> => {
    if (!phone) return false;
    
    setLoading("isSendingTest", true);
    try {
      const result = await sendTestMessage(phone);
      if (result.success) {
        toast.success("تم إرسال الرسالة بنجاح");
        return true;
      } else {
        toast.error(result.error || "فشل إرسال الرسالة");
        return false;
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الإرسال");
      return false;
    } finally {
      setLoading("isSendingTest", false);
    }
  }, [toast, setLoading]);

  // Mark wizard as complete
  const completeWizard = useCallback(() => {
    setStatus("connected");
    setStep(0);
  }, []);

  // Update AI configuration
  const updateAIConfig = useCallback((config: WhatsAppAIConfig) => {
    setFormDataState(prev => ({ ...prev, aiAutoResponse: config }));
  }, []);

  return {
    // State
    formData,
    status,
    step,
    editMode,
    showDisconnectModal,
    webhookUrl: userId ? `${BASE_WEBHOOK_URL}/${userId}` : BASE_WEBHOOK_URL,

    // Loading States
    ...loadingStates,

    // Setters
    setFormData,
    setStep,
    setEditMode,
    setShowDisconnectModal,
    setStatus,

    // Actions
    saveCredentials,
    verifyWebhook,
    saveSettings,
    disconnect,
    refreshToken,
    sendTest,
    completeWizard,
    copyToClipboard,
    updateAIConfig
  };
}
