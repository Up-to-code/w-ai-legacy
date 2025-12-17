/**
 * WhatsApp Integration Types
 */

export interface WhatsAppFormData {
  accessToken: string;
  phoneNumberId: string;
  businessAccountId: string;
  verifyToken: string;
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
