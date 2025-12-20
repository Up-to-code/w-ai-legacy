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
      <div className="min-h-screen bg-gray-50/50 relative dir-rtl">
        {/* Background Gradients */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-50/50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gray-100/50 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>
        </div>
        <Sidebar />
        <main className="lg:mr-64 p-8 transition-all duration-300">
          <Header />
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
