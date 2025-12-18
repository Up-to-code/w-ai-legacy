"use client";

import { Megaphone, Clock, Filter, Send, BarChart2, Edit2, Copy, Trash2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/lib/hooks/use-toast";
import { useConfirmDialog, ConfirmDialog } from "@/components/ui/confirm-dialog";
import { deleteCampaign, sendCampaign, createCampaign } from "@/app/actions/campaigns";
import type { Campaign, CampaignStatus } from "@/types/campaign";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface CampaignListViewProps {
    campaigns: Campaign[];
    searchQuery?: string;
    statusFilter?: string;
}

export function CampaignListView({ campaigns, searchQuery, statusFilter }: CampaignListViewProps) {
    const toast = useToast();
    const router = useRouter();
    const { confirm, dialogProps } = useConfirmDialog();

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
            <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", styles[status] || styles.draft)}>
                {labels[status]}
            </span>
        );
    };

    const handleDelete = (campaign: Campaign) => {
        confirm(
            "حذف الحملة",
            `هل أنت متأكد من حذف الحملة "${campaign.name}"؟`,
            async () => {
                const result = await deleteCampaign(campaign.id);
                if (result.success) {
                    toast.success("تم حذف الحملة بنجاح");
                    router.refresh();
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
                    router.refresh();
                } else {
                    toast.error(result.error || "حدث خطأ أثناء الإرسال");
                }
            }
        );
    };

    const handleDuplicate = async (campaign: Campaign) => {
        confirm(
            "تكرار الحملة",
            `هل تريد إنشاء نسخة جديدة من الحملة "${campaign.name}"؟`,
            async () => {
                try {
                    const result = await createCampaign({
                        name: `${campaign.name} (نسخة)`,
                        audienceType: campaign.audienceType as any,
                        includedTags: campaign.includedTags,
                        contactLimit: campaign.contactLimit || undefined,
                        recentDays: campaign.recentDays || undefined,
                        messageType: campaign.messageType as any,
                        messageContent: campaign.messageContent,
                        templateId: campaign.templateId,
                        status: "draft"
                    });

                    if (result.success) {
                        toast.success("تم تكرار الحملة بنجاح");
                        router.refresh();
                    } else {
                        toast.error(result.error || "حدث خطأ أثناء التكرار");
                    }
                } catch (error) {
                    toast.error("حدث خطأ غير متوقع");
                }
            }
        );
    };

    if (campaigns.length === 0) {
        return (
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
                        إلى حملة جديدة
                    </Link>
                )}
            </div>
        );
    }

    return (
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
                                <Link href={`/dashboard/campaigns/${campaign.id}`} className="hover:text-primary transition-colors">
                                    <h3 className="font-bold text-lg">{campaign.name}</h3>
                                </Link>
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
                                href={`/dashboard/campaigns/${campaign.id}`}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors"
                            >
                                <BarChart2 className="w-4 h-4" /> التفاصيل
                            </Link>

                            {(campaign.status === "draft" || campaign.status === "scheduled") && (
                                <Link
                                    href={`/dashboard/campaigns/${campaign.id}/edit`}
                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors"
                                >
                                    <Edit2 className="w-4 h-4" /> تعديل
                                </Link>
                            )}

                            <button
                                onClick={() => handleDuplicate(campaign)}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors"
                            >
                                <Copy className="w-4 h-4" /> تكرار
                            </button>

                            {campaign.status !== "active" && campaign.status !== "sending" && (
                                <button
                                    onClick={() => handleDelete(campaign)}
                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" /> حذف
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
            <ConfirmDialog {...dialogProps} />
        </div>
    );
}
