import { Globe, Copy, RefreshCw, Loader2, ShieldCheck } from "lucide-react";

interface WizardStep2Props {
    webhookUrl: string;
    verifyToken: string;
    refreshVerifyToken: () => Promise<void>;
    handleCopy: (text: string) => void;
    setStep: (step: number) => void;
    handleVerifyWebhook: () => Promise<boolean>;
    verifying: boolean;
}

export function WizardStep2({ 
    webhookUrl, 
    verifyToken, 
    refreshVerifyToken, 
    handleCopy, 
    setStep, // Now we expect a number for setStep
    handleVerifyWebhook, 
    verifying 
}: WizardStep2Props) {
    return (
        <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <Globe className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">إعداد الويب هوك</h2>
                    <p className="text-sm text-gray-500">قم بتكوين الرابط في لوحة تحكم Meta</p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="space-y-4">
                    <div className="group">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Webhook URL</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={webhookUrl}
                                readOnly
                                className="w-full p-4 pr-24 bg-gray-50/50 rounded-2xl border border-gray-200 font-mono text-sm text-gray-600 text-left"
                                dir="ltr"
                            />
                            <button
                                onClick={() => handleCopy(webhookUrl)}
                                className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all"
                            >
                                <Copy className="w-3 h-3" /> نسخ
                            </button>
                        </div>
                    </div>

                    <div className="group">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Verify Token</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={verifyToken}
                                readOnly
                                className="w-full p-4 pr-24 bg-gray-50/50 rounded-2xl border border-gray-200 font-mono text-sm text-gray-600 text-left"
                                dir="ltr"
                            />
                            <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                <button
                                    onClick={() => handleCopy(verifyToken)}
                                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all"
                                >
                                    <Copy className="w-3 h-3" /> نسخ
                                </button>
                                <button 
                                    onClick={refreshVerifyToken}
                                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"
                                >
                                    <RefreshCw className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 text-sm text-blue-800 leading-relaxed mb-6">
                    💡 بعد تفعيل الويب هوك في Meta، انقر على الزر بالأسفل للتأكد من نجاح العملية.
                </div>

                <div className="flex justify-between items-center pt-4">
                    <button
                        onClick={() => setStep(1)}
                        className="text-gray-500 font-bold hover:text-gray-700 transition-colors"
                    >
                        السابق
                    </button>
                    <button
                        onClick={handleVerifyWebhook}
                        disabled={verifying}
                        className="px-8 py-4 bg-[#105D3B] text-white rounded-2xl font-bold flex items-center gap-2 hover:shadow-xl hover:shadow-[#105D3B]/20 transition-all disabled:opacity-50"
                    >
                        {verifying ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                        التحقق من الاتصال
                    </button>
                </div>
            </div>
        </div>
    );
}
