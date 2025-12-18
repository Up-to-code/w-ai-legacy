"use client";

import { Info, Zap } from "lucide-react";
import { MAX_CONTEXT_TOKENS } from "@/lib/ai/bot-utils";

interface TokenUsageBarProps {
    tokens: number;
}

export default function TokenUsageBar({ tokens }: TokenUsageBarProps) {
    const percentage = Math.min((tokens / MAX_CONTEXT_TOKENS) * 100, 100);

    // Determine color based on usage
    let barColor = "bg-primary";
    let textColor = "text-primary";

    if (percentage > 90) {
        barColor = "bg-red-500";
        textColor = "text-red-600";
    } else if (percentage > 70) {
        barColor = "bg-amber-500";
        textColor = "text-amber-600";
    }

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${percentage > 90 ? 'bg-red-50' : 'bg-primary/5'}`}>
                        <Zap className={`w-4 h-4 ${percentage > 90 ? 'text-red-500' : 'text-primary'}`} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-gray-900">حجم البيانات (Tokens)</h4>
                        <p className="text-[10px] text-gray-400 font-medium">الحد الأقصى الموصى به: {MAX_CONTEXT_TOKENS}</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className={`text-sm font-black ${textColor}`}>
                        {tokens.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold ml-1">/{MAX_CONTEXT_TOKENS}</span>
                </div>
            </div>

            {/* Progress Bar Container */}
            <div className="w-full h-2.5 bg-gray-50 rounded-full overflow-hidden border border-gray-100/50 p-0.5">
                <div
                    className={`h-full rounded-full transition-all duration-500 ease-out shadow-sm ${barColor}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>

            <div className="mt-3 flex gap-2 items-start">
                <Info className="w-3.5 h-3.5 text-gray-300 shrink-0 mt-0.5" />
                <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
                    يتم احتساب التوكنز بناءً على حجم تعليمات النظام ومحتوى قاعدة المعرفة. حاول البقاء تحت الـ 70% لضمان ردود أسرع وأكثر دقة.
                </p>
            </div>
        </div>
    );
}
