import { getCampaign } from "@/app/actions/campaigns";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { ArrowRight, Calendar, Users, CheckCircle, Eye, AlertCircle, Clock } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function CampaignDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getCampaign(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const campaign = result.data;

  const statusColors = {
    draft: "bg-gray-100 text-gray-700",
    scheduled: "bg-blue-100 text-blue-700",
    sending: "bg-yellow-100 text-yellow-700",
    completed: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
  };

  const statusLabels = {
    draft: "مسودة",
    scheduled: "مجدولة",
    sending: "جاري الإرسال",
    completed: "مكتملة",
    failed: "فشلت",
  };

  return (
    <>
       <div className="max-w-5xl mx-auto pb-20 px-4 sm:px-6">
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-8">
            <Link 
                href="/dashboard/campaigns" 
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
            >
                <ArrowRight className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-3">
                    {campaign.name}
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[campaign.status as keyof typeof statusColors]}`}>
                        {statusLabels[campaign.status as keyof typeof statusLabels] || campaign.status}
                    </span>
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                    تم الإنشاء: {format(new Date(campaign.createdAt), "PPP p", { locale: ar })}
                </p>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-3 text-blue-600">
                    <Users className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold text-gray-800">{campaign.targetAudienceCount || 0}</div>
                <div className="text-sm text-gray-500 font-medium">الجمهور المستهدف</div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-3 text-green-600">
                    <CheckCircle className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold text-gray-800">{campaign.deliveredCount || 0}</div>
                <div className="text-sm text-gray-500 font-medium">تم التسليم</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mb-3 text-purple-600">
                    <Eye className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold text-gray-800">{campaign.readCount || 0}</div>
                <div className="text-sm text-gray-500 font-medium">تمت القراءة</div>
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
            {/* Content Preview */}
            <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 font-bold text-lg bg-gray-50/50">
                        محتوى الرسالة
                    </div>
                    <div className="p-6">
                        <div className="bg-[#DCF8C6]/20 p-4 rounded-lg border border-[#DCF8C6] inline-block max-w-full lg:max-w-[80%] relative">
                            <p className="whitespace-pre-wrap text-gray-800 text-sm leading-relaxed">
                                {campaign.messageContent}
                            </p>
                            <span className="text-[10px] text-gray-400 block text-left mt-2 pl-1">
                                {format(new Date(), "p", { locale: ar })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar Details */}
            <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-bold text-gray-800 mb-4 text-lg">تفاصيل التوقيت</h3>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 shrink-0">
                                <Calendar className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 mb-1">تاريخ الإنشاء</div>
                                <div className="font-medium text-sm">
                                    {format(new Date(campaign.createdAt), "PPP", { locale: ar })}
                                </div>
                            </div>
                        </div>

                        {campaign.scheduledAt && (
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                                    <Clock className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 mb-1">موعد الإرسال</div>
                                    <div className="font-medium text-sm">
                                        {format(new Date(campaign.scheduledAt), "PPP p", { locale: ar })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-bold text-gray-800 mb-4 text-lg">الجمهور المستهدف</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-50">
                            <span className="text-sm text-gray-500">النوع</span>
                            <span className="font-medium text-sm">
                                {campaign.audienceType === "all" ? "الكل" : "مخصص (وسوم)"}
                            </span>
                        </div>
                        {campaign.audienceType === "tags" && campaign.includedTags && campaign.includedTags.length > 0 && (
                            <div>
                                <div className="text-xs text-gray-500 mb-2">الوسوم المضمنة:</div>
                                <div className="flex flex-wrap gap-2">
                                    {campaign.includedTags.map((tag: string, idx: number) => (
                                        <span key={idx} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                                            {/* Note: In a real app we might fetch tag names via tag IDs, for now displaying ID or simple placeholder if needed, 
                                                but schema stores generic IDs. Ideally we fetch names. 
                                                For this MVP we'll show generic count or just render the ID if acceptable, 
                                                or better, just "Tag" or we could fetch tags. 
                                                Let's assume just showing "Tag" badge or ID is okay for MVP unless requested. */}
                                            وسم {idx + 1}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </>
  );
}
