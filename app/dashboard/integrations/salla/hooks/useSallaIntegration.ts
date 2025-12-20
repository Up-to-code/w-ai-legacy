"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/hooks/use-toast";
import {
  getIntegration,
  disconnectIntegration,
} from "@/app/actions/integrations";
import {
  generateSallaAuthUrl,
  saveSallaCredentials,
  refreshSallaToken,
  getSallaStoreInfo,
} from "@/app/actions/salla-oauth";
import type {
  SallaFormData,
  SallaStatus,
  SallaLoadingStates,
} from "../types";

const initialFormData: SallaFormData = {
  accessToken: "",
  refreshToken: "",
  expiresAt: "",
  storeInfo: undefined,
};

const initialLoadingStates: SallaLoadingStates = {
  isLoading: true,
  isConnecting: false,
  isDisconnecting: false,
  isRefreshingToken: false,
};

export function useSallaIntegration() {
  const toast = useToast();
  const router = useRouter();

  // Core State
  const [formData, setFormDataState] = useState<SallaFormData>(initialFormData);
  const [status, setStatus] = useState<SallaStatus>("loading");
  const [step, setStep] = useState(1);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);

  // Loading States
  const [loadingStates, setLoadingStates] = useState<SallaLoadingStates>(
    initialLoadingStates
  );

  // Helper to update specific loading state
  const setLoading = useCallback(
    (key: keyof SallaLoadingStates, value: boolean) => {
      setLoadingStates((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // Load initial data from DB
  useEffect(() => {
    async function loadIntegration() {
      console.log("[useSallaIntegration] Loading integration from DB...");
      try {
        const result = await getIntegration("salla");

        console.log(
          "[useSallaIntegration] getIntegration result:",
          JSON.stringify(result, null, 2)
        );

        if (result.success && result.data) {
          const credentials =
            typeof result.data.credentials === "string"
              ? JSON.parse(result.data.credentials)
              : result.data.credentials;

          console.log("[useSallaIntegration] Parsed credentials:", credentials);

          // Check if we have valid credentials
          const hasValidCredentials = credentials?.accessToken;

          if (hasValidCredentials) {
            console.log(
              "[useSallaIntegration] Valid credentials found, showing ConnectedView"
            );
            setStatus("connected");

            setFormDataState({
              accessToken: credentials.accessToken || "",
              refreshToken: credentials.refreshToken || "",
              expiresAt: credentials.expiresAt || "",
              storeInfo: credentials.storeInfo,
            });
          } else {
            console.log(
              "[useSallaIntegration] No valid credentials, showing wizard"
            );
            setStatus("disconnected");
            setFormDataState(initialFormData);
          }
        } else {
          console.log(
            "[useSallaIntegration] No integration data found, showing wizard"
          );
          setStatus("disconnected");
        }
      } catch (error) {
        console.error("[useSallaIntegration] Failed to load integration:", error);
        setStatus("disconnected");
      } finally {
        setLoading("isLoading", false);
      }
    }

    loadIntegration();
  }, [setLoading]);

  // Update form data (partial updates supported)
  const setFormData = useCallback((data: Partial<SallaFormData>) => {
    setFormDataState((prev) => ({ ...prev, ...data }));
  }, []);

  // Start OAuth flow
  const startOAuth = useCallback(async (): Promise<boolean> => {
    setLoading("isConnecting", true);
    try {
      // Generate random state for CSRF protection
      const state = Math.random().toString(36).substring(2, 15);

      const result = await generateSallaAuthUrl(state);

      if (result.success && result.data) {
        // Redirect to Salla for authorization
        window.location.href = result.data.authUrl;
        return true;
      } else {
        toast.error(result.error || "فشل إنشاء رابط التفويض");
        return false;
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء بدء التفويض");
      return false;
    } finally {
      setLoading("isConnecting", false);
    }
  }, [toast, setLoading]);

  // Disconnect
  const disconnect = useCallback(async (): Promise<boolean> => {
    setLoading("isDisconnecting", true);
    try {
      const result = await disconnectIntegration("salla");
      if (result.success) {
        setStatus("disconnected");
        setStep(1);
        setFormDataState(initialFormData);
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

  // Refresh access token
  const refreshToken = useCallback(async (): Promise<boolean> => {
    if (!formData.refreshToken) {
      toast.error("بيانات التحديث غير متوفرة");
      return false;
    }

    setLoading("isRefreshingToken", true);
    try {
      // We rely on env vars in the server action now
      const result = await refreshSallaToken(
        formData.refreshToken
      );

      if (result.success && result.data) {
        const expiresAt = new Date(
          Date.now() + result.data.expiresIn * 1000
        ).toISOString();

        const updatedFormData = {
          ...formData,
          accessToken: result.data.accessToken,
          refreshToken: result.data.refreshToken,
          expiresAt,
        };

        setFormDataState(updatedFormData);

        await saveSallaCredentials(updatedFormData);

        toast.success("تم تحديث الرمز بنجاح");
        return true;
      } else {
        toast.error(result.error || "فشل تحديث الرمز");
        return false;
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث الرمز");
      return false;
    } finally {
      setLoading("isRefreshingToken", false);
    }
  }, [formData, toast, setLoading]);

  // Fetch store info
  const fetchStoreInfo = useCallback(async (): Promise<boolean> => {
    if (!formData.accessToken) {
      return false;
    }

    try {
      const result = await getSallaStoreInfo(formData.accessToken);

      if (result.success && result.data) {
        setFormData({ storeInfo: result.data });
        return true;
      }

      return false;
    } catch (error) {
      console.error("Failed to fetch store info:", error);
      return false;
    }
  }, [formData.accessToken, setFormData]);

  return {
    // State
    formData,
    status,
    step,
    showDisconnectModal,

    // Loading States
    ...loadingStates,

    // Setters
    setFormData,
    setStep,
    setShowDisconnectModal,
    setStatus,

    // Actions
    startOAuth,
    disconnect,
    refreshToken,
    fetchStoreInfo,
  };
}
