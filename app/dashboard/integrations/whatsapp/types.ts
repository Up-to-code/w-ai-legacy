/**
 * WhatsApp Integration Types
 */

export interface WhatsAppFormData {
  accessToken: string;
  phoneNumberId: string;
  businessAccountId: string;
  verifyToken: string;
  aiAutoResponse?: WhatsAppAIConfig;
}

export interface WhatsAppAIConfig {
  enabled: boolean;
  responseDelay: number; // seconds (0-30)
  businessHoursOnly: boolean;
  businessHours?: {
    start: string; // "09:00"
    end: string;   // "18:00"
    timezone: string; // "Africa/Cairo", "America/New_York", etc.
    days: number[]; // [1,2,3,4,5] for Mon-Fri (0=Sunday, 6=Saturday)
  };
  fallbackMessage?: string; // Message to send when AI is disabled
}

export interface WhatsAppCredentials extends WhatsAppFormData {
  aiAutoResponse?: WhatsAppAIConfig;
}

export type WhatsAppStatus = "loading" | "connected" | "disconnected";

export interface WhatsAppLoadingStates {
  isLoading: boolean;      // Initial data fetch
  isSaving: boolean;       // Saving credentials
  isVerifying: boolean;    // Webhook verification
  isDisconnecting: boolean; // Disconnecting
  isSendingTest: boolean;  // Sending test message
  isRefreshingToken: boolean; // Refreshing verify token
}
