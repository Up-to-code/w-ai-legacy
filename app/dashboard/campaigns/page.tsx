"use client";

import { Header } from "@/components/dashboard/header";
import { Plus, Search, Megaphone, Filter, Calendar, CheckCircle2, AlertCircle, Clock, Send, BarChart2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { getCampaigns, deleteCampaign, sendCampaign } from "@/app/actions/campaigns";
import { useToast } from "@/lib/hooks/use-toast";
import { useConfirmDialog, ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { Campaign, CampaignStatus } from "@/types/campaign";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

const STATUS_FILTERS = [
  { value: "", label: "الجميع" },
  { value: "draft", label: "مسودة" },
  { value: "scheduled", label: "مجدولة" },
  { value: "active", label: "نشطة" },
  { value: "completed", label: "مكتملة" },
  { value: "failed", label: "فشلت" },
];

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | "">("");
  
  const toast = useToast();
  const { confirm, dialogProps } = useConfirmDialog();

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getCampaigns({
        search: searchQuery,
        status: statusFilter || undefined,
        limit: 50,
      });

      if (result.success && result.data) {
        setCampaigns(result.data);
      } else {
        toast.error(result.error || "حدث خطأ أثناء جلب الحملات");
      }
    } catch (error: any) {
      toast.error("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, toast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCampaigns();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchCampaigns]);

  const handleDelete = (campaign: Campaign) => {
    confirm(
      "حذف الحملة",
      `هل أنت متأكد من حذف الحملة "${campaign.name}"؟`,
      async () => {
        const result = await deleteCampaign(campaign.id);
        if (result.success) {
          toast.success("تم حذف الحملة بنجاح");
          fetchCampaigns();
        } else {
          toast.error(result.error || "حدث خطأ أثناء الحذف");
        }
      }
    );
  };

  const handleSend = (campaign: Campaign) => {
    confirm(
      "إرسال الحملة",
      `هل أنت متأكد من إرسال الحملة "${campaign.name}" الآن؟`,
      async () => {
        const result = await sendCampaign(campaign.id);
        if (result.success) {
          toast.success("تم بدء إرسال الحملة");
          fetchCampaigns();
        } else {
          toast.error(result.error || "حدث خطأ أثناء الإرسال");
        }
      }
    );
  };

  const getStatusBadge = (status: CampaignStatus) => {
    const styles = {
      draft: "bg-gray-100 text-gray-600",
      scheduled: "bg-blue-100 text-blue-600",
      active: "bg-green-100 text-green-600",
      completed: "bg-green-100 text-green-600",
      failed: "bg-red-100 text-red-600",
      paused: "bg-yellow-100 text-yellow-600",
      sending: "bg-purple-100 text-purple-600 animate-pulse",
    };
    
    const labels = {
      draft: "مسودة",
      scheduled: "مجدولة",
      active: "نشطة",
      completed: "مكتملة",
      failed: "فشلت",
      paused: "متوقفة",
      sending: "جاري الإرسال",
    };

    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.draft}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <>
       <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">الحملات التسويقية</h1>
          <p className="text-gray-500">إدارة وإرسال حملات الواتساب لعملائك.</p>
        </div>
        <Link
          href="/dashboard/campaigns/new"
          className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all"
        >
          <Plus className="w-4 h-4" /> حملة جديدة
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث عن حملة..."
            className="w-full pl-4 pr-10 py-2.5 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
          />
          <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as CampaignStatus)}
          className="px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all min-w-[150px]"
        >
          {STATUS_FILTERS.map((filter) => (
            <option key={filter.value} value={filter.value}>
              {filter.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 animate-pulse h-32"></div>
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Megaphone className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            {searchQuery || statusFilter ? "لا توجد نتائج" : "لا توجد حملات"}
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            ابدأ بإنشاء أول حملة تسويقية لك للوصول إلى عملائك
          </p>
          {!searchQuery && !statusFilter && (
            <Link
              href="/dashboard/campaigns/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-5 h-5" /> إنشاء حملة جديدة
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-primary/30 transition-all group"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg">{campaign.name}</h3>
                    {getStatusBadge(campaign.status)}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>
                        {campaign.scheduledAt 
                          ? format(new Date(campaign.scheduledAt), "PPP p", { locale: ar }) 
                          : format(new Date(campaign.createdAt), "PPP", { locale: ar })}
                      </span>
                    </div>
                    {campaign.audienceType === "tags" && (
                      <div className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-50 rounded text-xs">
                        <Filter className="w-3 h-3" />
                        <span>وسوم محددة</span>
                      </div>
                    )}
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-2 w-full max-w-md">
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <div className="text-xs text-gray-500 mb-1">الجمهور</div>
                      <div className="font-bold text-gray-800">{campaign.targetAudienceCount || 0}</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-2 text-center">
                      <div className="text-xs text-green-600 mb-1">تم التسليم</div>
                      <div className="font-bold text-green-700">{campaign.deliveredCount || 0}</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-2 text-center">
                      <div className="text-xs text-blue-600 mb-1">تمت القراءة</div>
                      <div className="font-bold text-blue-700">{campaign.readCount || 0}</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex md:flex-col justify-end gap-2 border-t md:border-t-0 md:border-r border-gray-100 pt-4 md:pt-0 md:pr-4">
                   {campaign.status === "draft" && (
                      <button 
                        onClick={() => handleSend(campaign)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors"
                      >
                        <Send className="w-4 h-4" /> إرسال
                      </button>
                   )}
                   
                   <Link
                      href={`/dashboard/campaigns/${campaign.id}`} // We might need this page later, for now edit works
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors"
                   >
                     <BarChart2 className="w-4 h-4" /> التفاصيل
                   </Link>

                   {campaign.status !== "active" && campaign.status !== "sending" && (
                      <button 
                        onClick={() => handleDelete(campaign)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors"
                      >
                        حذف
                      </button>
                   )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog {...dialogProps} />
    </>
  );
}
