"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface PublicGuardProps {
  children: React.ReactNode;
}

/**
 * Route guard for public auth pages (login, register)
 * Redirects to /dashboard if user is already authenticated
 */
export function PublicGuard({ children }: PublicGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return null; // Don't show anything while checking auth
  }

  if (isAuthenticated) {
    return null; // Will redirect
  }

  return <>{children}</>;
}
