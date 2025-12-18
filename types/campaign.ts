/**
 * Campaign-related TypeScript types and interfaces
 */

export type CampaignStatus = "draft" | "scheduled" | "active" | "completed" | "failed" | "paused" | "sending";
export type AudienceType = "all" | "tags" | "count" | "recent" | "active";
export type MessageType = "text" | "image" | "template";

export interface Campaign {
  id: string;
  userId: string;
  name: string;
  status: CampaignStatus;
  
  // Audience
  audienceType?: AudienceType;
  includedTags?: string[];
  contactLimit?: number | null;      // For "count" type - send to first N contacts
  recentDays?: number | null;        // For "recent" type - contacts from last X days
  targetAudienceCount?: number;
  
  // Content
  messageType?: MessageType;
  messageContent?: string;
  templateId?: string;

  // Stats
  deliveredCount?: number;
  readCount?: number;
  
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
  contactLimit?: number;
  recentDays?: number;
  targetAudienceCount?: number;
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
  contactLimit?: number;
  recentDays?: number;
  targetAudienceCount?: number;
  messageType?: MessageType;
  messageContent?: string;
  templateId?: string;
  deliveredCount?: number;
  readCount?: number;
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
