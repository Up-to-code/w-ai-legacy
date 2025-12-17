import { Key, Eye, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";

interface WizardStep1Props {
    formData: {
        accessToken: string;
        phoneNumberId: string;
        businessAccountId: string;
        verifyToken: string;
    };
    setFormData: (data: WizardStep1Props["formData"]) => void;
    handleSaveCredentials: () => Promise<boolean>;
    loading: boolean;
}

export function WizardStep1({ formData, setFormData, handleSaveCredentials, loading }: WizardStep1Props) {
    const [showToken, setShowToken] = useState(false);

    return (
        <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-[#105D3B]/10 flex items-center justify-center text-[#105D3B]">
                    <Key className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900 font-inter">إعداد مفاتيح الاتصال</h2>
                    <p className="text-sm text-gray-500">أدخل بيانات تطبيق Meta Business الخاص بك</p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="space-y-4">
                    <div className="group">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Access Token</label>
                        <div className="relative">
                            <input
                                type={showToken ? "text" : "password"}
                                value={formData.accessToken}
                                onChange={e => setFormData({ ...formData, accessToken: e.target.value })}
                                placeholder="AdBv..."
                                className="w-full p-4 bg-gray-50/50 rounded-2xl border border-gray-200 focus:border-[#105D3B] focus:outline-none focus:ring-4 focus:ring-[#105D3B]/5 font-mono text-sm transition-all text-left"
                                dir="ltr"
                            />
                            <button
                                onClick={() => setShowToken(!showToken)}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#105D3B] transition-colors"
                            >
                                <Eye className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="group">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number ID</label>
                            <input
                                type="text"
                                value={formData.phoneNumberId}
                                onChange={e => setFormData({ ...formData, phoneNumberId: e.target.value })}
                                placeholder="123456789"
                                className="w-full p-4 bg-gray-50/50 rounded-2xl border border-gray-200 focus:border-[#105D3B] focus:outline-none focus:ring-4 focus:ring-[#105D3B]/5 font-mono text-sm transition-all text-left"
                                dir="ltr"
                            />
                        </div>
                        <div className="group">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Business Account ID</label>
                            <input
                                type="text"
                                value={formData.businessAccountId}
                                onChange={e => setFormData({ ...formData, businessAccountId: e.target.value })}
                                placeholder="987654321"
                                className="w-full p-4 bg-gray-50/50 rounded-2xl border border-gray-200 focus:border-[#105D3B] focus:outline-none focus:ring-4 focus:ring-[#105D3B]/5 font-mono text-sm transition-all text-left"
                                dir="ltr"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        onClick={handleSaveCredentials}
                        disabled={loading || !formData.accessToken || !formData.phoneNumberId}
                        className="px-8 py-4 bg-[#105D3B] text-white rounded-2xl font-bold flex items-center gap-2 hover:shadow-xl hover:shadow-[#105D3B]/20 transition-all disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                        حفظ ومتابعة
                    </button>
                </div>
            </div>
        </div>
    );
}
