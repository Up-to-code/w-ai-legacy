/**
 * Salla Integration Types
 */

export interface SallaStoreInfo {
  id: number;
  name: string;
  domain: string;
  email: string;
  logo?: string;
  merchant?: {
    id: number;
    name: string;
  };
}

export interface SallaFormData {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string; // ISO string
  scope?: string;
  storeInfo?: SallaStoreInfo;
  aiAutoResponse?: any; // Using any to avoid circular deps, or import WhatsAppAIConfig equivalent
}

export interface SallaCredentials extends SallaFormData {
  // For backward compatibility
}

export type SallaStatus = "loading" | "connected" | "disconnected";

export interface SallaLoadingStates {
  isLoading: boolean;        // Initial data fetch
  isConnecting: boolean;     // OAuth connection in progress
  isDisconnecting: boolean;  // Disconnecting
  isRefreshingToken: boolean; // Refreshing access token
}
