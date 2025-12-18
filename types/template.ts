/**
 * Template-related TypeScript types and interfaces
 */

export type TemplateCategory = "welcome" | "general" | "marketing" | "support";

export interface Template {
  id: string;
  userId: string;
  name: string;
  content: string;
  category?: string;
  language?: string;
  usageCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTemplateData {
  name: string;
  content: string;
  category?: string;
  language?: string;
}

export interface UpdateTemplateData {
  name?: string;
  content?: string;
  category?: string;
  language?: string;
}

export interface TemplateListParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sortBy?: "name" | "createdAt" | "usageCount";
  sortOrder?: "asc" | "desc";
}
