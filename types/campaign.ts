/**
 * Campaign-related TypeScript types and interfaces
 */

export type CampaignStatus = "draft" | "scheduled" | "active" | "completed" | "failed" | "paused" | "sending";
export type AudienceType = "all" | "tags" | "count" | "recent";
export type MessageType = "text" | "image" | "template";

export interface Campaign {
  id: string;
  userId: string;
  name: string;
  status: CampaignStatus;
  
  // Audience
  audienceType?: AudienceType;
  includedTags?: string[];
  contactLimit?: string | null;      // For "count" type - send to first N contacts
  recentDays?: string | null;        // For "recent" type - contacts from last X days
  targetAudienceCount?: string;
  
  // Content
  messageType?: MessageType;
  messageContent?: string;
  templateId?: string;

  // Stats
  deliveredCount?: string;
  readCount?: string;
  
  // Timing
  scheduledAt?: Date | null;
  sentAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  
  // Computed stats from join
  stats?: CampaignStats;
}

export interface CreateCampaignData {
  name: string;
  status?: CampaignStatus;
  audienceType?: AudienceType;
  includedTags?: string[];
  contactLimit?: string | number;  // Can accept number from UI, converted to string for DB
  recentDays?: string | number;    // Can accept number from UI, converted to string for DB
  targetAudienceCount?: string;
  messageType?: MessageType;
  messageContent?: string;
  templateId?: string;
  scheduledAt?: Date;
  sendNow?: boolean;  // Flag to send immediately after creation
}

export interface UpdateCampaignData {
  name?: string;
  status?: CampaignStatus;
  audienceType?: AudienceType;
  includedTags?: string[];
  contactLimit?: string | number;
  recentDays?: string | number;
  targetAudienceCount?: string;
  messageType?: MessageType;
  messageContent?: string;
  templateId?: string;
  deliveredCount?: string;
  readCount?: string;
  scheduledAt?: Date;
  sentAt?: Date;
}

export interface CampaignListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: CampaignStatus;
  sortBy?: "name" | "createdAt" | "scheduledAt" | "sentAt";
  sortOrder?: "asc" | "desc";
}

export interface CampaignStats {
  deliveryRate: number; // percentage
  readRate: number; // percentage
  totalSent: number;
  totalDelivered: number;
  totalRead: number;
  totalFailed: number;
  delivered?: number;
  read?: number;
  total?: number;
}
