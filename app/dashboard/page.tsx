"use client";

import { Header } from "@/components/dashboard/header";
import { Users, MessageSquare, CheckCircle, Clock, Plus, Send, Zap } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { getDashboardStats } from "@/app/actions/dashboard";
import { useEffect, useState } from "react";
import { RecentCampaigns } from "@/components/dashboard/recent-campaigns";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import Link from "next/link";

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await getDashboardStats();
        if (result.success) {
          setStats(result.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <>

      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          {authLoading ? (
            <>
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-5 w-64 bg-gray-200 rounded animate-pulse"></div>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-2">
                مرحباً، {user?.name || "مستخدم"} 👋
              </h1>
              <p className="text-gray-500">نظرة عامة على نشاط الرد الآلي والعملاء.</p>
            </>
          )}
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/campaigns/new" className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-primary/90 transition-transform active:scale-95 shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4" /> حملة جديدة
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Total Contacts */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-green-100 flex items-center gap-4 hover:shadow-lg hover:shadow-green-900/5 transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-100 text-[#105D3B] flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">إجمالي العملاء</p>
            {loading ? (
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <h3 className="text-2xl font-bold text-gray-900">{stats?.counts?.contacts || 0}</h3>
            )}
          </div>
        </div>

        {/* Sent Messages */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-gray-100 flex items-center gap-4 hover:shadow-lg hover:shadow-green-900/5 transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <MessageSquare className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">الرسائل المرسلة</p>
            {loading ? (
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <h3 className="text-2xl font-bold text-gray-900">{stats?.counts?.sentMessages || 0}</h3>
            )}
          </div>
        </div>

        {/* Active Campaigns */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-gray-100 flex items-center gap-4 hover:shadow-lg hover:shadow-green-900/5 transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Zap className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">حملات نشطة</p>
            {loading ? (
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <h3 className="text-2xl font-bold text-gray-900">{stats?.counts?.activeCampaigns || 0}</h3>
            )}
          </div>
        </div>

        {/* Completed Campaigns */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-gray-100 flex items-center gap-4 hover:shadow-lg hover:shadow-green-900/5 transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 text-gray-500 flex items-center justify-center group-hover:scale-110 transition-transform">
            <CheckCircle className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">حملات مكتملة</p>
            {loading ? (
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <h3 className="text-2xl font-bold text-gray-900">{stats?.counts?.completedCampaigns || 0}</h3>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 min-h-[400px]">
          {loading ? (
            <div className="h-full bg-gray-100 rounded-3xl animate-pulse"></div>
          ) : (
            <RecentCampaigns campaigns={stats?.recentCampaigns || []} />
          )}
        </div>

        <div className="lg:col-span-1">
          {loading ? (
            <div className="h-full bg-gray-100 rounded-3xl animate-pulse"></div>
          ) : (
            <RecentActivity activities={stats?.recentMessages || []} />
          )}
        </div>
      </div>
    </>
  );
}
