/**
 * Integration-related TypeScript types and interfaces
 */

export type IntegrationStatus = "connected" | "disconnected" | "error";

export type IntegrationServiceId = 
  | "whatsapp" 
  | "salla"
  | "zapier" 
  | "slack" 
  | "mailchimp" 
  | "google_sheets" 
  | "sms";

export interface Integration {
  id: string;
  userId: string;
  serviceId: IntegrationServiceId;
  serviceName: string;
  status: IntegrationStatus;
  credentials?: string | null; // Encrypted JSON string
  metadata?: string | null; // JSON string for additional settings
  connectedAt?: Date | null;
  updatedAt: Date;
}

export interface ConnectIntegrationData {
  serviceId: IntegrationServiceId;
  serviceName: string;
  credentials: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface UpdateIntegrationData {
  status?: IntegrationStatus;
  credentials?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface IntegrationTestResult {
  success: boolean;
  message: string;
  details?: any;
}
