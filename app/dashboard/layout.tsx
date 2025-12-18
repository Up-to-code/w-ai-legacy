"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Header } from "@/components/dashboard/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background dir-rtl">
        <Sidebar />
        <main className="lg:mr-64 p-8 transition-all duration-300">
          <Header/>
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
