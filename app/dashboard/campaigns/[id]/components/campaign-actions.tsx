"use client";

import { useState } from "react";
import { Pause, Play, Square, Send, Loader2, Edit2 } from "lucide-react";
import {
    pauseCampaign,
    resumeCampaign,
    stopCampaign,
    sendCampaign
} from "@/app/actions/campaigns";
import { useToast } from "@/lib/hooks/use-toast";
import { useConfirmDialog, ConfirmDialog } from "@/components/ui/confirm-dialog";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CampaignActionsProps {
    campaignId: string;
    status: string;
}

export function CampaignActions({ campaignId, status }: CampaignActionsProps) {
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const { confirm, dialogProps } = useConfirmDialog();
    const router = useRouter();

    const handleAction = async (action: () => Promise<any>, message: string) => {
        setLoading(true);
        try {
            const result = await action();
            if (result.success) {
                toast.success(result.message || message);
                router.refresh(); // Refresh the server component data
            } else {
                toast.error(result.error || "حدث خطأ أثناء تنفيذ الإجراء");
            }
        } catch (error) {
            toast.error("حدث خطأ غير متوقع");
        } finally {
            setLoading(false);
        }
    };

    const onPause = () => {
        confirm("إيقاف مؤقت", "هل أنت متأكد من إيقاف هذه الحملة مؤقتاً؟", () =>
            handleAction(() => pauseCampaign(campaignId), "تم الإيقاف مؤقتاً")
        );
    };

    const onResume = () => {
        handleAction(() => resumeCampaign(campaignId), "تم استئناف الحملة");
    };

    const onStop = () => {
        confirm("إنهاء الحملة", "هل أنت متأكد من إنهاء هذه الحملة؟ لا يمكن استئنافها بعد الإنهاء.", () =>
            handleAction(() => stopCampaign(campaignId), "تم إنهاء الحملة")
        );
    };

    const onSend = () => {
        confirm("بدء الإرسال", "هل تريد بدء إرسال الحملة الآن لجميع جهات الاتصال المستهدفة؟", () =>
            handleAction(() => sendCampaign(campaignId), "بدأ الإرسال بنجاح")
        );
    };

    return (
        <div className="flex flex-wrap gap-2">
            {(status === "draft" || status === "scheduled") && (
                <Link
                    href={`/dashboard/campaigns/${campaignId}/edit`}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-2"
                >
                    <Edit2 className="w-4 h-4" /> تعديل الحملة
                </Link>
            )}

            {status === "draft" && (
                <button
                    onClick={onSend}
                    disabled={loading}
                    className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    بدء الإرسال الآن
                </button>
            )}

            {(status === "active" || status === "sending") && (
                <>
                    <button
                        onClick={onPause}
                        disabled={loading}
                        className="px-4 py-2 bg-orange-50 text-orange-700 border border-orange-100 rounded-xl text-sm font-bold hover:bg-orange-100 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        <Pause className="w-4 h-4" /> إيقاف مؤقت
                    </button>
                    <button
                        onClick={onStop}
                        disabled={loading}
                        className="px-4 py-2 bg-red-50 text-red-700 border border-red-100 rounded-xl text-sm font-bold hover:bg-red-100 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        <Square className="w-4 h-4" /> إنهاء
                    </button>
                </>
            )}

            {status === "paused" && (
                <button
                    onClick={onResume}
                    disabled={loading}
                    className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-sm font-bold hover:bg-emerald-100 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                    <Play className="w-4 h-4" /> استئناف
                </button>
            )}

            <ConfirmDialog {...dialogProps} />
        </div>
    );
}
