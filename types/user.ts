/**
 * User-related TypeScript types and interfaces
 */

export interface User {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  phone?: string | null;
  jobTitle?: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
  token: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  image?: string;
  phone?: string;
  jobTitle?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
}
