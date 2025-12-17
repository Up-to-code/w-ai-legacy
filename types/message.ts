/**
 * Message-related TypeScript types and interfaces
 */

export type MessageDirection = "inbound" | "outbound";
export type MessageStatus = "sent" | "delivered" | "read" | "failed";

export interface Message {
  id: string;
  campaignId?: string | null;
  contactId: string;
  userId: string;
  direction: MessageDirection;
  content: string;
  status: MessageStatus;
  metadata?: string | null; // JSON string
  sentAt?: Date | null;
  readAt?: Date | null;
  createdAt: Date;
}

export interface CreateMessageData {
  contactId: string;
  campaignId?: string;
  direction: MessageDirection;
  content: string;
  status?: MessageStatus;
}

export interface MessageListParams {
  page?: number;
  limit?: number;
  contactId?: string;
  campaignId?: string;
  direction?: MessageDirection;
  status?: MessageStatus;
  startDate?: Date;
  endDate?: Date;
  sortBy?: "createdAt" | "sentAt" | "readAt";
  sortOrder?: "asc" | "desc";
}

export interface Conversation {
  contactId: string;
  contactName: string;
  messages: Message[];
  lastMessageAt: Date;
  unreadCount: number;
}
