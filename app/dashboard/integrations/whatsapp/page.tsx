"use client";

import { Header } from "@/components/dashboard/header";
import { MessageSquare, Loader2, ChevronLeft, X, ArrowRight } from "lucide-react";
import Link from "next/link";

// Hook
import { useWhatsAppIntegration } from "./hooks/useWhatsAppIntegration";
import { ConnectedView , WizardStep1 , WizardStep2 , WizardStep3  } from "./components";

// Components

export default function WhatsAppIntegrationPage() {
    const integration = useWhatsAppIntegration();

    // Loading state
    if (integration.isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#F3F4F6]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-[#105D3B]" />
                    <p className="text-gray-500 font-medium animate-pulse">جاري التحقق من الاتصال...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen  pb-20 relative overflow-hidden font-sans" dir="rtl">
             
    
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <Link href="/dashboard/integrations" className="hover:text-[#105D3B] transition-colors font-medium">التطبيقات</Link>
                    <ChevronLeft className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold text-gray-900">WhatsApp API</span>
                </div>

                {/* Disconnect Confirmation Modal */}
                {integration.showDisconnectModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200" onClick={() => integration.setShowDisconnectModal(false)}>
                        <div className="bg-white rounded-3xl p-8 max-w-md mx-4 shadow-2xl animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                    <X className="w-6 h-6 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">تأكيد إلغاء الربط</h3>
                                    <p className="text-sm text-gray-500 mt-1">هل أنت متأكد من هذا الإجراء؟</p>
                                </div>
                            </div>
                            
                            <p className="text-gray-700 leading-relaxed mb-6">
                                سيؤدي إلغاء الربط إلى إيقاف جميع البوتات والحملات المرتبطة بهذا الحساب فوراً. ستحتاج لإعادة التفعيل مجدداً.
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
                                    {integration.isDisconnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : "تأكيد الإلغاء"}
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
                                <MessageSquare className="w-8 h-8" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">WhatsApp Business API</h1>
                            
                            {/* Steps Indicator */}
                            {integration.status !== 'connected' && (
                                <div className="space-y-4 relative before:absolute before:right-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                                    {[1, 2, 3].map((s) => (
                                        <div key={s} className="relative flex items-center gap-4">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-500 z-10 ${
                                                integration.step >= s 
                                                ? "bg-[#105D3B] border-[#105D3B] text-white shadow-lg shadow-[#105D3B]/20" 
                                                : "bg-white border-gray-200 text-gray-400"
                                            }`}>
                                                {s}
                                            </div>
                                            <span className={`text-sm font-medium transition-colors duration-300 ${
                                                integration.step >= s ? "text-gray-900" : "text-gray-400"
                                            }`}>
                                                {s === 1 && "المفاتيح"}
                                                {s === 2 && "الويب هوك"}
                                                {s === 3 && "التحقق"}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                             {integration.status === 'connected' && (
                                <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                                    <div className="flex items-center gap-2 text-green-700 font-bold mb-1">
                                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                        متصل الآن
                                    </div>
                                    <p className="text-xs text-green-600/80">
                                        الخدمة تعمل بشكل صحيح وجاهزة لإرسال واستقبال الرسائل.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Help Box */}
                         <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 backdrop-blur-xl rounded-3xl p-6 border border-blue-100/50">
                            <h3 className="font-bold text-blue-900 mb-2 text-sm">تحتاج مساعدة؟</h3>
                            <p className="text-xs text-blue-700/80 leading-relaxed mb-4">
                                راجع دليل الربط التفصيلي للحصول على شرح خطوة بخطوة لكيفية استخراج البيانات من Meta.
                            </p>
                            <a href="#" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline">
                                مشاهدة الدليل <ArrowRight className="w-3 h-3" />
                            </a>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl shadow-[#105D3B]/5 min-h-[500px] transition-all duration-500">
                            {integration.status === "connected" ? (
                                <ConnectedView 
                                    formData={integration.formData}
                                    setFormData={integration.setFormData}
                                    handleSave={integration.saveSettings}
                                    loading={integration.isSaving}
                                    setShowDisconnectModal={integration.setShowDisconnectModal}
                                    handleCopy={integration.copyToClipboard}
                                    refreshVerifyToken={integration.refreshToken}
                                    webhookUrl={integration.webhookUrl}
                                />
                            ) : (
                                <>
                                    {integration.step === 1 && (
                                        <WizardStep1 
                                            formData={integration.formData}
                                            setFormData={integration.setFormData}
                                            handleSaveCredentials={integration.saveCredentials}
                                            loading={integration.isSaving}
                                        />
                                    )}
                                    {integration.step === 2 && (
                                        <WizardStep2 
                                            webhookUrl={integration.webhookUrl}
                                            verifyToken={integration.formData.verifyToken}
                                            refreshVerifyToken={integration.refreshToken}
                                            handleCopy={integration.copyToClipboard}
                                            setStep={integration.setStep}
                                            handleVerifyWebhook={integration.verifyWebhook}
                                            verifying={integration.isVerifying}
                                        />
                                    )}
                                    {integration.step === 3 && (
                                        <WizardStep3 
                                            setStatus={integration.setStatus}
                                            setStep={integration.setStep}
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
