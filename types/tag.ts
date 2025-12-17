/**
 * Tag-related TypeScript types and interfaces
 */

export type TagColor = "blue" | "green" | "red" | "yellow" | "purple" | "pink" | "orange" | "gray";

export interface Tag {
  id: string;
  userId: string;
  name: string;
  color?: string;
  contactCount?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTagData {
  name: string;
  color?: TagColor;
}

export interface UpdateTagData {
  name?: string;
  color?: TagColor;
}
