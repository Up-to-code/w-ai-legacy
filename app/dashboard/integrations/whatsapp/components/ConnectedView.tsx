'use client';

import {
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/lib/hooks/use-toast";
import { sendTestMessage } from "@/app/actions/send-test-message";
import AISettings from "./AISettings";
import ConfigurationCard from "./ConfigurationCard";
import TestMessageCard from "./TestMessageCard";
import { WhatsAppAIConfig } from "../types";

interface ConnectedViewProps {
  formData: {
    accessToken: string;
    phoneNumberId: string;
    businessAccountId: string;
    verifyToken: string;
    aiAutoResponse?: WhatsAppAIConfig;
  };
  setFormData: (data: ConnectedViewProps["formData"]) => void;
  handleSave: () => Promise<boolean>;
  loading: boolean;
  setShowDisconnectModal: (show: boolean) => void;
  handleCopy: (text: string) => void;
  refreshVerifyToken: () => Promise<void>;
  webhookUrl: string;
  onAIConfigChange: (config: WhatsAppAIConfig) => void;
}

export function ConnectedView({
  formData,
  setFormData,
  handleSave,
  loading,
  setShowDisconnectModal,
  handleCopy,
  refreshVerifyToken,
  webhookUrl,
  onAIConfigChange,
}: ConnectedViewProps) {
  const toast = useToast();
  const [testBookingLoading, setTestBookingLoading] = useState(false);

  const handleSendTestMessage = async (phone: string) => {
    setTestBookingLoading(true);
    try {
      const res = await sendTestMessage(phone);
      if (res.success) {
        toast.success("تم إرسال الرسالة بنجاح");
      } else {
        toast.error(res.error || "فشل الإرسال");
      }
    } catch {
      toast.error("حدث خطأ أثناء الإرسال");
    } finally {
      setTestBookingLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 p-4 sm:p-6">

      {/* ANALYTICS DASHBOARD - Removed per user request */}
      {/* <StatsOverview /> */}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Configuration & Test */}
        <div className="xl:col-span-7 space-y-6">
          <ConfigurationCard
            formData={formData}
            setFormData={setFormData}
            webhookUrl={webhookUrl}
            handleCopy={handleCopy}
            refreshVerifyToken={refreshVerifyToken}
            handleSave={handleSave}
            loading={loading}
            onDisconnect={() => setShowDisconnectModal(true)}
          />

          <TestMessageCard
            onSendTest={handleSendTestMessage}
            loading={testBookingLoading}
          />
        </div>

        {/* Right Column: AI Settings (Sticky on Desktop) */}
        <div className="xl:col-span-5 sticky top-6">
          {formData.aiAutoResponse && (
            <AISettings
              config={formData.aiAutoResponse}
              onChange={onAIConfigChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}