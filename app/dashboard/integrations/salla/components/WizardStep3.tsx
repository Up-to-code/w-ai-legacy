"use client";

import { CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface WizardStep3Props {
    storeName?: string;
    onComplete: () => void;
}

export function WizardStep3({ storeName, onComplete }: WizardStep3Props) {
    return (
        <div className="p-8 flex flex-col items-center justify-center min-h-[500px]">
            {/* Success Animation */}
            <div className="mb-8 relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-2xl shadow-green-500/30 animate-in zoom-in duration-500">
                    <CheckCircle className="w-12 h-12 text-white" strokeWidth={3} />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-400 rounded-full animate-ping"></div>
            </div>

            {/* Success Message */}
            <h2 className="text-3xl font-bold text-gray-900 mb-3 text-center">
                تم الربط بنجاح! 🎉
            </h2>
            <p className="text-gray-600 text-center mb-2">
                تم ربط متجرك في سلة بنجاح
            </p>
            {storeName && (
                <p className="text-lg font-semibold text-[#105D3B] mb-8">
                    {storeName}
                </p>
            )}

            {/* Features */}
            <div className="w-full max-w-md mb-8 space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-sm text-green-900 font-medium">
                        التفاعل الذكي مع العملاء عبر AI
                    </p>
                </div>

                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-sm text-green-900 font-medium">
                        الربط السلس مع باقي تطبيقات المنصة
                    </p>
                </div>

                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-sm text-green-900 font-medium">
                        إشعارات فورية عند وصول طلب جديد
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                <button
                    onClick={onComplete}
                    className="flex-1 px-8 py-3 bg-[#105D3B] hover:bg-[#158052] text-white rounded-xl font-bold transition-all shadow-lg shadow-green-900/20"
                >
                    عرض لوحة التحكم
                </button>
                <Link
                    href="/dashboard/integrations"
                    className="flex-1 px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all text-center flex items-center justify-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    التطبيقات
                </Link>
            </div>

            {/* Progress */}
            <div className="mt-8 text-sm text-gray-500">الخطوة 2 من 2 - مكتمل</div>
        </div>
    );
}
