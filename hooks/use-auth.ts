"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import type { User, Session } from "@/types/user";
import { updateUserProfile } from "@/app/actions/profile";

/**
 * Custom authentication hook that wraps Better Auth's useSession
 * Provides a convenient interface for managing user authentication across the app
 */
export function useAuth() {
  const router = useRouter();
  const session = authClient.useSession();

  const logout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
          },
        },
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const updateProfile = async (data: { name: string; phone?: string; jobTitle?: string }) => {
    try {
      const result = await updateUserProfile(data);
      
      if (result.success) {
        // Refetch session to get updated user data (for name, email, image)
        await session.refetch();
        return { 
          success: true, 
          message: result.message,
          user: result.user // Include user data for phone and jobTitle
        };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || "حدث خطأ أثناء تحديث الملف الشخصي" 
      };
    }
  };

  return {
    // User data
    user: session.data?.user as User | undefined,
    
    // Session data
    session: session.data?.session as Session | undefined,
    
    // Auth state
    isAuthenticated: !!session.data?.user,
    isLoading: session.isPending,
    error: session.error,
    
    // Actions
    logout,
    updateProfile,
    refetch: session.refetch,
  };
}
