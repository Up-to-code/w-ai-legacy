import { getCampaign, getCampaignMessages } from "@/app/actions/campaigns";
import { getTags } from "@/app/actions/tags";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { ArrowRight, Calendar, Users, CheckCircle, Eye, AlertCircle, Clock, Edit2, MessageSquare, Send, Filter } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";
import { CampaignActions } from "./components/campaign-actions";

export default async function CampaignDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Fetch campaign, messages and tags in parallel
    const [campaignResult, messagesResult, tagsResult] = await Promise.all([
        getCampaign(id),
        getCampaignMessages(id),
        getTags()
    ]);

    if (!campaignResult.success || !campaignResult.data) {
        notFound();
    }

    const campaign = campaignResult.data;
    const messages = messagesResult.success ? messagesResult.data || [] : [];
    const allTags = tagsResult.success ? tagsResult.data || [] : [];

    const statusColors = {
        draft: "bg-gray-100 text-gray-700",
        scheduled: "bg-blue-100 text-blue-700",
        sending: "bg-yellow-100 text-yellow-700",
        active: "bg-emerald-100 text-emerald-700",
        completed: "bg-green-100 text-green-700",
        failed: "bg-red-100 text-red-700",
        paused: "bg-orange-100 text-orange-700",
    };

    const statusLabels = {
        draft: "مسودة",
        scheduled: "مجدولة",
        sending: "جاري الإرسال",
        active: "نشطة",
        completed: "مكتملة",
        failed: "فشلت",
        paused: "متوقفة",
    };

    // Calculate percentages
    const targetCount = campaign.targetAudienceCount || 0;
    const deliveredCount = campaign.deliveredCount || 0;
    const readCount = campaign.readCount || 0;

    const deliveryRate = targetCount > 0 ? Math.round((deliveredCount / targetCount) * 100) : 0;
    const readRate = targetCount > 0 ? Math.round((readCount / targetCount) * 100) : 0;

    return (
        <div className="max-w-6xl mx-auto pb-20 px-4 sm:px-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard/campaigns"
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                        <ArrowRight className="w-5 h-5 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-3">
                            {campaign.name}
                            <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[campaign.status as keyof typeof statusColors] || statusColors.draft}`}>
                                {statusLabels[campaign.status as keyof typeof statusLabels] || campaign.status}
                            </span>
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            تم الإنشاء: {format(new Date(campaign.createdAt), "PPP p", { locale: ar })}
                        </p>
                    </div>
                </div>

                <CampaignActions campaignId={campaign.id} status={campaign.status} />
            </div>

            {/* Progress for active campaigns */}
            {(campaign.status === "sending" || campaign.status === "active") && (
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8 animate-in fade-in slide-in-from-top-2">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-800">حالة الإرسال</h3>
                        <span className="text-sm font-bold text-primary">{deliveryRate}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div
                            className="bg-primary h-full transition-all duration-500 ease-out"
                            style={{ width: `${deliveryRate}%` }}
                        />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                        <span>تم تسليم {deliveredCount} من {targetCount}</span>
                        <span>باقي {Math.max(0, targetCount - deliveredCount)} جهة</span>
                    </div>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-3 text-blue-600">
                        <Users className="w-6 h-6" />
                    </div>
                    <div className="text-3xl font-bold text-gray-800">{targetCount}</div>
                    <div className="text-sm text-gray-500 font-medium">الجمهور المستهدف</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-3 text-green-600">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                    <div className="text-3xl font-bold text-gray-800">{deliveredCount}</div>
                    <div className="text-sm text-green-600 font-bold mb-1">{deliveryRate}%</div>
                    <div className="text-xs text-gray-500 font-medium">تم التسليم</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mb-3 text-purple-600">
                        <Eye className="w-6 h-6" />
                    </div>
                    <div className="text-3xl font-bold text-gray-800">{readCount}</div>
                    <div className="text-sm text-purple-600 font-bold mb-1">{readRate}%</div>
                    <div className="text-xs text-gray-500 font-medium">تمت القراءة</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-3 text-red-600">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <div className="text-3xl font-bold text-gray-800">0</div>
                    <div className="text-sm text-gray-500 font-medium">فشل الإرسال</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Message Content */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 font-bold text-lg bg-gray-50/50 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-gray-500" />
                            محتوى الرسالة
                        </div>
                        <div className="p-6">
                            <div className="bg-[#DCF8C6]/20 p-4 rounded-lg border border-[#DCF8C6] inline-block max-w-full lg:max-w-[90%] relative shadow-sm">
                                <p className="whitespace-pre-wrap text-gray-800 text-sm leading-relaxed mb-4">
                                    {campaign.messageContent}
                                </p>
                                <div className="flex justify-end mt-2">
                                    <span className="text-[10px] text-gray-400">
                                        {format(new Date(), "p", { locale: ar })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Activity/Messages Log */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 font-bold text-lg bg-gray-50/50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-gray-500" />
                                آخر العمليات
                            </div>
                            <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{messages.length} رسالة</span>
                        </div>
                        <div className="overflow-x-auto">
                            {messages.length === 0 ? (
                                <div className="p-12 text-center">
                                    <p className="text-gray-400 text-sm">لا توجد رسائل مرسلة بعد في هذه الحملة.</p>
                                </div>
                            ) : (
                                <table className="w-full text-right">
                                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                                        <tr>
                                            <th className="px-6 py-3 font-bold border-b border-gray-100 text-right">المرسل إليه</th>
                                            <th className="px-6 py-3 font-bold border-b border-gray-100 text-right">الحالة</th>
                                            <th className="px-6 py-3 font-bold border-b border-gray-100 text-right">الوقت</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-sm">
                                        {messages.map((msg: any) => (
                                            <tr key={msg.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-gray-900">{msg.contact?.name || "بدون اسم"}</div>
                                                    <div className="text-xs text-gray-500">{msg.contact?.phone}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={cn(
                                                        "px-2 py-0.5 rounded-full text-xs font-medium",
                                                        msg.status === "read" ? "bg-blue-100 text-blue-700" :
                                                            msg.status === "delivered" ? "bg-green-100 text-green-700" :
                                                                msg.status === "failed" ? "bg-red-100 text-red-700" :
                                                                    "bg-gray-100 text-gray-600"
                                                    )}>
                                                        {msg.status === "read" ? "تمت القراءة" :
                                                            msg.status === "delivered" ? "تم التسليم" :
                                                                msg.status === "failed" ? "فشل" :
                                                                    "تم الإرسال"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-xs text-gray-500">
                                                    {msg.createdAt ? format(new Date(msg.createdAt), "p", { locale: ar }) : "-"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Details */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
                        <h3 className="font-bold text-gray-800 mb-6 text-lg border-b border-gray-50 pb-4">إعدادات الجمهور</h3>

                        <div className="space-y-6">
                            <div>
                                <div className="text-xs text-gray-400 mb-1">نوع الجمهور</div>
                                <div className="font-bold text-sm bg-gray-50 p-2 rounded-lg flex items-center gap-2">
                                    <Filter className="w-4 h-4 text-primary" />
                                    {campaign.audienceType === "all" ? "جميع جهات الاتصال" :
                                        campaign.audienceType === "tags" ? "وسوم محددة" :
                                            campaign.audienceType === "count" ? "عدد محدد من الجهات" :
                                                campaign.audienceType === "recent" ? "الجهات المضافة مؤخراً" : "مخصص"}
                                </div>
                            </div>

                            {campaign.audienceType === "tags" && campaign.includedTags && (
                                <div>
                                    <div className="text-xs text-gray-400 mb-2">الوسوم المحددة</div>
                                    <div className="flex flex-wrap gap-2">
                                        {campaign.includedTags.map((tagId: string) => {
                                            const tag = allTags.find(t => t.id === tagId);
                                            return (
                                                <span key={tagId} className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-xs font-bold border border-primary/10">
                                                    {tag ? tag.name : `وسم ${tagId.slice(0, 4)}`}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {campaign.audienceType === "count" && (
                                <div>
                                    <div className="text-xs text-gray-400 mb-1">عدد المستهدفين</div>
                                    <div className="font-bold text-sm">أول {campaign.contactLimit} جهة اتصال</div>
                                </div>
                            )}

                            {campaign.audienceType === "recent" && (
                                <div>
                                    <div className="text-xs text-gray-400 mb-1">الفترة الزمنية</div>
                                    <div className="font-bold text-sm">آخر {campaign.recentDays} يوم</div>
                                </div>
                            )}

                            <div className="pt-4 border-t border-gray-50 grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-xs text-gray-400 mb-1">الإنشاء</div>
                                    <div className="font-medium text-xs">
                                        {format(new Date(campaign.createdAt), "PP", { locale: ar })}
                                    </div>
                                </div>
                                {campaign.scheduledAt && (
                                    <div>
                                        <div className="text-xs text-blue-400 mb-1">الجدولة</div>
                                        <div className="font-medium text-xs text-blue-600">
                                            {format(new Date(campaign.scheduledAt), "PP p", { locale: ar })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

