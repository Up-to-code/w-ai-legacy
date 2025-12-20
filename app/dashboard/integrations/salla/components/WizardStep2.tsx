"use client";

import { Link2, Loader2, ChevronRight } from "lucide-react";

interface WizardStep2Props {
    handleStartOAuth: () => Promise<boolean>;
    loading: boolean;
    setStep: (step: number) => void;
}

export function WizardStep2({
    handleStartOAuth,
    loading,
    setStep,
}: WizardStep2Props) {
    return (
        <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#105D3B] flex items-center justify-center text-white">
                    <Link2 className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">التفويض</h2>
                    <p className="text-sm text-gray-500">
                        اسمح للتطبيق بالوصول إلى متجرك في سلة
                    </p>
                </div>
            </div>

            {/* Instructions */}
            <div className="mb-8 space-y-4">
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-xl">
                    <h3 className="font-bold text-green-900 mb-2">ماذا سيحدث الآن؟</h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-green-800">
                        <li>سيتم توجيهك إلى صفحة التفويض في سلة</li>
                        <li>قم بتسجيل الدخول إلى حساب متجرك</li>
                        <li>وافق على صلاحيات التطبيق</li>
                        <li>سيتم إعادتك تلقائياً لإتمام الربط</li>
                    </ol>
                </div>

                {/* Visual Steps */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white border-2 border-gray-200 rounded-xl">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                            <span className="text-2xl">🔐</span>
                        </div>
                        <p className="text-xs font-semibold text-gray-900">تسجيل الدخول</p>
                    </div>

                    <div className="text-center p-4 bg-white border-2 border-gray-200 rounded-xl">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                            <span className="text-2xl">✅</span>
                        </div>
                        <p className="text-xs font-semibold text-gray-900">الموافقة</p>
                    </div>

                    <div className="text-center p-4 bg-white border-2 border-gray-200 rounded-xl">
                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-2">
                            <span className="text-2xl">🎉</span>
                        </div>
                        <p className="text-xs font-semibold text-gray-900">الربط</p>
                    </div>
                </div>
            </div>

            {/* OAuth Button */}
            <div className="mb-6">
                <button
                    onClick={handleStartOAuth}
                    disabled={loading}
                    className="w-full px-8 py-4 bg-gradient-to-r from-[#105D3B] to-[#158052] hover:from-[#158052] hover:to-[#105D3B] text-white rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-green-900/20"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            جاري التوجيه...
                        </>
                    ) : (
                        <>
                            <Link2 className="w-6 h-6" />
                            الاتصال بسلة الآن
                        </>
                    )}
                </button>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">الخطوة 1 من 2</div>
            </div>
        </div>
    );
}
