
"use client";

import { ShoppingBag, Loader2, Edit2, RefreshCw, X, Package, ArrowLeft, ExternalLink, Bot, CheckCircle2 } from "lucide-react";
import type { SallaFormData } from "../types";
import Link from "next/link";
import { useState } from "react";
import { updateSallaAIConfig } from "@/app/actions/update-salla-ai-config";
import { useToast } from "@/lib/hooks/use-toast";

interface ConnectedViewProps {
    formData: SallaFormData;
    setShowDisconnectModal: (show: boolean) => void;
    refreshToken: () => Promise<boolean>;
    isRefreshingToken: boolean;
}

export function ConnectedView({
    formData,
    setShowDisconnectModal,
    refreshToken,
    isRefreshingToken,
}: ConnectedViewProps) {
    const { storeInfo, expiresAt, aiAutoResponse } = formData;
    const toast = useToast();
    const [isSavingAI, setIsSavingAI] = useState(false);
    const [aiEnabled, setAiEnabled] = useState(aiAutoResponse?.enabled || false);

    // Calculate days until token expires
    const daysUntilExpiry = expiresAt
        ? Math.ceil(
            (new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        )
        : 0;

    const handleAIToggle = async () => {
        if (isSavingAI) return;

        const newState = !aiEnabled;
        setAiEnabled(newState); // Optimistic update
        setIsSavingAI(true);

        try {
            const result = await updateSallaAIConfig(newState);

            if (result.success) {
                toast.success(newState ? "تم تفعيل الرد الآلي" : "تم إيقاف الرد الآلي");
            } else {
                setAiEnabled(!newState); // Revert on failure
                toast.error(result.error || "فشل حفظ الإعدادات");
            }
        } catch (error) {
            setAiEnabled(!newState);
            toast.error("حدث خطأ أثناء الحفظ");
        } finally {
            setIsSavingAI(false);
        }
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">متصل بمتجر سلة</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        المتجر متصل ويعمل بشكل صحيح
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={refreshToken}
                        disabled={isRefreshingToken}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {isRefreshingToken ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <RefreshCw className="w-4 h-4" />
                        )}
                        تحديث الرمز
                    </button>
                    <Link
                        href="/dashboard/integrations/salla/products"
                        className="px-4 py-2 bg-[#105D3B] hover:bg-[#158052] text-white rounded-xl font-medium transition-all flex items-center gap-2 shadow-sm shadow-green-900/10"
                    >
                        <Package className="w-4 h-4" />
                        عرض المنتجات
                    </Link>
                </div>
            </div>

            {/* Store Information Card */}
            {storeInfo && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 mb-6 border border-green-100">
                    <div className="flex items-start gap-4">
                        {storeInfo.logo ? (
                            <img
                                src={storeInfo.logo}
                                alt={storeInfo.name}
                                className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-md"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#105D3B] to-[#158052] flex items-center justify-center text-white">
                                <ShoppingBag className="w-8 h-8" />
                            </div>
                        )}

                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                                {storeInfo.name}
                            </h3>
                            <div className="space-y-1">
                                {storeInfo.domain && (
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">النطاق:</span>{" "}
                                        <a
                                            href={`https://${storeInfo.domain}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#105D3B] hover:underline"
                                        >
                                            {storeInfo.domain}
                                        </a>
                                    </p>
                                )}
                                {storeInfo.email && (
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">البريد:</span> {storeInfo.email}
                                    </p>
                                )}
                                {storeInfo.merchant && (
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">التاجر:</span>{" "}
                                        {storeInfo.merchant.name}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-green-700 bg-green-100 px-3 py-1.5 rounded-full text-xs font-bold">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            متصل
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* View Products Card */}
                <Link
                    href="/dashboard/integrations/salla/products"
                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Package className="w-24 h-24 text-[#105D3B]" />
                    </div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-[#105D3B] mb-4 group-hover:scale-110 transition-transform">
                            <Package className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">منتجات المتجر</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            استعرض جميع منتجاتك المستوردة من سلة مع إمكانية البحث والفلترة
                        </p>
                        <span className="text-[#105D3B] text-sm font-bold flex items-center gap-2 group-hover:translate-x-[-4px] transition-transform">
                            تصفح المنتجات <ArrowLeft className="w-4 h-4" />
                        </span>
                    </div>
                </Link>

                {/* Token Expiry Card */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                            <RefreshCw className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">حالة الرمز</p>
                            <h3 className="text-lg font-bold text-gray-900">
                                {daysUntilExpiry > 0 ? "نشط" : "منتهي"}
                            </h3>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">ينتهي خلال</span>
                            <span className={`font-bold ${daysUntilExpiry < 5 ? "text-red-500" : "text-gray-900"}`}>
                                {daysUntilExpiry > 0 ? `${daysUntilExpiry} يوم` : "الآن"}
                            </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full transition-all ${daysUntilExpiry < 5 ? "bg-red-500" : "bg-blue-500"}`}
                                style={{ width: `${Math.min(100, Math.max(0, (daysUntilExpiry / 14) * 100))}%` }}
                            />
                        </div>
                        {daysUntilExpiry < 5 && (
                            <p className="text-xs text-red-500 mt-2">
                                يرجى تحديث الرمز قريباً لتجنب انقطاع الخدمة
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* AI Response Settings */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 ${aiEnabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                            <Bot className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">الرد الآلي الذكي (AI)</h3>
                            <p className="text-sm text-gray-500">
                                {aiEnabled ? (
                                    <span className="text-green-600 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        نشط الآن - البوت يستقبل استفسارات العملاء
                                    </span>
                                ) : (
                                    "الخدمة متوقفة حالياً"
                                )}
                            </p>
                        </div>
                    </div>

                    <div
                        onClick={handleAIToggle}
                        className={`w-14 h-7 rounded-full relative transition-all duration-300 ${isSavingAI ? 'cursor-wait opacity-50' : 'cursor-pointer'} ${aiEnabled ? 'bg-[#105D3B]' : 'bg-gray-200'}`}
                    >
                        <div
                            className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 ${aiEnabled ? 'right-1' : 'right-8'} ${isSavingAI ? 'animate-pulse' : ''}`}
                        />
                    </div>
                </div>

                <div className={`transition-all duration-300 ${aiEnabled ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-600 leading-relaxed">
                        يتم استخدام الذكاء الاصطناعي لتحليل أسئلة العملاء والرد عليها بناءً على بيانات متجرك ومنتجاتك.
                        سيتم الرد تلقائياً على الاستفسارات الشائعة مثل حالة الطلب، تفاصيل المنتجات، أوقات العمل، واقتراح منتجات تناسب احتياجات العملاء (نظام التوصيات الذكي).
                    </div>
                </div>
            </div>

            {/* Other Settings (Simplified) */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                <h3 className="font-bold text-gray-900 mb-4">إعدادات المزامنة</h3>
                <div className="space-y-4">
                    {/* Order Sync */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div>
                            <p className="font-medium text-gray-900">مزامنة الطلبات تلقائياً</p>
                            <p className="text-xs text-gray-500">استيراد الطلبات الجديدة فور إنشائها</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked disabled />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#105D3B] opacity-60"></div>
                        </label>
                    </div>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">
                    * خيارات المزامنة مفعلة افتراضياً ولا يمكن تغييرها حالياً
                </p>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                <h3 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                    <X className="w-5 h-5" />
                    منطقة الخطر
                </h3>
                <p className="text-sm text-red-700 mb-4">
                    إلغاء الربط سيوقف جميع عمليات المزامنة مع متجر سلة
                </p>
                <button
                    onClick={() => setShowDisconnectModal(true)}
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all"
                >
                    إلغاء الربط مع سلة
                </button>
            </div>
        </div>
    );
}
