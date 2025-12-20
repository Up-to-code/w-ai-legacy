"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ShoppingBag, Loader2, ChevronLeft, X } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/lib/hooks/use-toast";

// Hook
import { useSallaIntegration } from "./hooks/useSallaIntegration";
import {
    ConnectedView,
    WizardStep2,
    WizardStep3,
} from "./components";

export default function SallaIntegrationPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const toast = useToast();
    const integration = useSallaIntegration();
    const hasHandledCallback = useRef(false);

    // Handle OAuth callback success/error
    useEffect(() => {
        if (hasHandledCallback.current) return;

        const success = searchParams?.get("success");
        const error = searchParams?.get("error");
        const storeName = searchParams?.get("store");

        if (success === "true") {
            hasHandledCallback.current = true;
            toast.success(`تم الربط بنجاح${storeName ? ` - ${storeName}` : ""}!`);
            integration.setStatus("connected");
            integration.setStep(2); // Success step
            integration.fetchStoreInfo();

            // Clean up URL
            router.replace("/dashboard/integrations/salla");
        } else if (error) {
            hasHandledCallback.current = true;
            const errorMessages: Record<string, string> = {
                missing_code: "لم يتم استلام رمز التفويض",
                missing_credentials: "بيانات التطبيق مفقودة",
                token_exchange_failed: "فشل تبادل الرمز",
                save_failed: "فشل حفظ البيانات",
                server_error: "حدث خطأ في الخادم",
            };

            toast.error(errorMessages[error] || decodeURIComponent(error));

            // Clean up URL
            router.replace("/dashboard/integrations/salla");
        }
    }, [searchParams, toast, integration, router]);

    // Loading state
    if (integration.isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#F3F4F6]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-[#105D3B]" />
                    <p className="text-gray-500 font-medium animate-pulse">
                        جاري التحقق من الاتصال...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen pb-20 relative overflow-hidden font-sans"
            dir="rtl"
        >
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <Link
                        href="/dashboard/integrations"
                        className="hover:text-[#105D3B] transition-colors font-medium"
                    >
                        التطبيقات
                    </Link>
                    <ChevronLeft className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold text-gray-900">Salla</span>
                </div>

                {/* Disconnect Confirmation Modal */}
                {integration.showDisconnectModal && (
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200"
                        onClick={() => integration.setShowDisconnectModal(false)}
                    >
                        <div
                            className="bg-white rounded-3xl p-8 max-w-md mx-4 shadow-2xl animate-in zoom-in-95 duration-200"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                    <X className="w-6 h-6 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">
                                        تأكيد إلغاء الربط
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        هل أنت متأكد من هذا الإجراء؟
                                    </p>
                                </div>
                            </div>

                            <p className="text-gray-700 leading-relaxed mb-6">
                                سيؤدي إلغاء الربط إلى إيقاف جميع عمليات المزامنة مع متجر سلة
                                فوراً. ستحتاج لإعادة التفعيل مجدداً.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => integration.setShowDisconnectModal(false)}
                                    className="flex-1 px-6 py-3 rounded-xl font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
                                >
                                    إلغاء
                                </button>
                                <button
                                    onClick={integration.disconnect}
                                    disabled={integration.isDisconnecting}
                                    className="flex-1 px-6 py-3 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                                >
                                    {integration.isDisconnecting ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        "تأكيد الإلغاء"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Sidebar / Info Panel */}
                    <div className="lg:col-span-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-lg shadow-[#105D3B]/5 transition-all duration-500">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#105D3B] to-[#158052] flex items-center justify-center text-white shadow-lg shadow-green-900/10 mb-6">
                                <ShoppingBag className="w-8 h-8" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                                Salla Integration
                            </h1>

                            {/* Steps Indicator */}
                            {integration.status !== "connected" && integration.step !== 3 && (
                                <div className="space-y-4 relative before:absolute before:right-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                                    {[1, 2].map((s) => (
                                        <div key={s} className="relative flex items-center gap-4">
                                            <div
                                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-500 z-10 ${integration.step >= s
                                                        ? "bg-[#105D3B] border-[#105D3B] text-white shadow-lg shadow-[#105D3B]/20"
                                                        : "bg-white border-gray-200 text-gray-400"
                                                    }`}
                                            >
                                                {s}
                                            </div>
                                            <span
                                                className={`text-sm font-medium transition-colors duration-300 ${integration.step >= s
                                                        ? "text-gray-900"
                                                        : "text-gray-400"
                                                    }`}
                                            >
                                                {s === 1 && "التفويض"}
                                                {s === 2 && "الاتصال"}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {integration.status === "connected" && (
                                <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                                    <div className="flex items-center gap-2 text-green-700 font-bold mb-1">
                                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                        متصل الآن
                                    </div>
                                    <p className="text-xs text-green-600/80">
                                        المتجر متصل ويعمل بشكل صحيح
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Help Box */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 backdrop-blur-xl rounded-3xl p-6 border border-blue-100/50">
                            <h3 className="font-bold text-blue-900 mb-2 text-sm">
                                تحتاج مساعدة؟
                            </h3>
                            <p className="text-xs text-blue-700/80 leading-relaxed mb-4">
                                راجع دليل الربط التفصيلي للحصول على شرح خطوة بخطوة لكيفية
                                الحصول على بيانات التطبيق من بوابة شركاء سلة.
                            </p>
                            <a
                                href="https://salla.partners"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline"
                            >
                                بوابة شركاء سلة ←
                            </a>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl shadow-[#105D3B]/5 min-h-[500px] transition-all duration-500">
                            {integration.status === "connected" && integration.step !== 2 ? (
                                <ConnectedView
                                    formData={integration.formData}
                                    setShowDisconnectModal={integration.setShowDisconnectModal}
                                    refreshToken={integration.refreshToken}
                                    isRefreshingToken={integration.isRefreshingToken}
                                />
                            ) : (
                                <>
                                    {integration.step === 1 && (
                                        <WizardStep2
                                            handleStartOAuth={integration.startOAuth}
                                            loading={integration.isConnecting}
                                            setStep={integration.setStep}
                                        />
                                    )}
                                    {integration.step === 2 && (
                                        <WizardStep3
                                            storeName={integration.formData.storeInfo?.name}
                                            onComplete={() => {
                                                integration.setStatus("connected");
                                                integration.setStep(0);
                                            }}
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
