/**
 * Bot settings and knowledge source TypeScript types and interfaces
 */

export type BotTone = "formal" | "friendly" | "enthusiastic";
export type KnowledgeSourceType = "file" | "text" | "url";

export interface BotSetting {
  id: string;
  userId: string;
  name?: string;
  tone?: BotTone;
  systemPrompt?: string;
  isActive?: boolean;
  aiApiKey?: string;
  aiModel?: string;
  aiProvider?: string;
  metadata?: string;
  lastTunedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface BotPromptHistory {
  id: string;
  botSettingId: string;
  userId: string;
  prompt: string;
  tone?: string;
  name?: string;
  changeSummary?: string;
  createdAt: Date;
}

export interface UpdateBotSettingData {
  name?: string;
  tone?: BotTone;
  systemPrompt?: string;
  isActive?: boolean;
  aiApiKey?: string;
  aiModel?: string;
  aiProvider?: string;
  metadata?: string;
}

export interface KnowledgeSource {
  id: string;
  userId: string;
  type: KnowledgeSourceType;
  name: string;
  content?: string | null; // For text type
  fileUrl?: string | null; // For file type
  metadata?: string | null; // JSON string
  sizeBytes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateKnowledgeSourceData {
  type: KnowledgeSourceType;
  name: string;
  content?: string;
  fileUrl?: string;
  metadata?: string;
  sizeBytes?: string;
}

export interface UpdateKnowledgeSourceData {
  name?: string;
  type?: KnowledgeSourceType;
  content?: string;
  metadata?: string;
}

export interface KnowledgeSourceListParams {
  page?: number;
  limit?: number;
  type?: KnowledgeSourceType;
  search?: string;
  sortBy?: "name" | "createdAt" | "sizeBytes";
  sortOrder?: "asc" | "desc";
}

export interface BotTestRequest {
  message: string;
  history?: { role: 'user' | 'ai'; text: string }[];
}

export interface BotTestResponse {
  response: string;
  took: number; // milliseconds
}
