"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    // Note: Since Sidebar handles its own collapse state for width, 
    // the main content padding needs to respond to it. 
    // For simplicity in this iteration, we'll assume a fixed padding logic 
    // or use a context if perfect sync is needed. 
    // For now, let's use a "peer" approach or just standard layout with room for the larger sidebar.
    // A better approach is to lift state, but let's stick to a safe margin for now or make it responsive.
    
    // Actually, to make it "perfect", we usually need the state lifed up. 
    // BUT, for the agentic task, I will set a safe margin-right corresponding to the expanded sidebar 
    // and if the user wants it dynamic, I can refactor.
    // Let's assume expanded by default (w-64) -> mr-64.

  return (
    <div className="min-h-screen bg-background dir-rtl">
      <Sidebar />
      {/* 
        lg:mr-64 corresponds to the expanded sidebar width.
        If we want dynamic width adjustment, we would need a Context.
        For now, let's stick to lg:mr-64 to match the initial state.
       */}
      <main className="lg:mr-64 p-8 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
