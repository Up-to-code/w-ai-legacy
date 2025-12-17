/**
 * Contact-related TypeScript types and interfaces
 */

export interface Contact {
  id: string;
  userId: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  tags?: string[] | null; // Array of tag IDs
  orderCount?: string;
  lastActivityAt?: Date | null;
  notes?: string | null;
  metadata?: string | null; // JSON string
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateContactData {
  name: string;
  phone?: string;
  email?: string;
  tags?: string[];
  notes?: string;
}

export interface UpdateContactData {
  name?: string;
  phone?: string;
  email?: string;
  tags?: string[];
  orderCount?: string;
  lastActivityAt?: Date;
  notes?: string;
}

export interface ContactListParams {
  page?: number;
  limit?: number;
  search?: string;
  tags?: string[];
  sortBy?: "name" | "createdAt" | "lastActivityAt" | "orderCount";
  sortOrder?: "asc" | "desc";
}
