import { CheckCircle, ArrowRight, Bot, MessageSquare, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WizardStep3Props {
    setStatus: (status: "loading" | "connected" | "disconnected") => void;
    setStep: (step: number) => void;
}

export function WizardStep3({ setStatus, setStep }: WizardStep3Props) {
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
            <p className="text-gray-600 text-center mb-8 max-w-sm">
                تم تفعيل حساب واتساب للأعمال بنجاح. يمكنك الآن استخدام المميزات التالية:
            </p>

            {/* Features */}
            <div className="w-full max-w-md mb-8 space-y-3">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-sm text-blue-900 font-medium">
                        الرد الآلي الذكي (AI Brain)
                    </p>
                </div>

                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <MessageSquare className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-sm text-green-900 font-medium">
                        إدارة المحادثات والدعم الفني
                    </p>
                </div>

                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-100">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                        <Megaphone className="w-4 h-4 text-purple-600" />
                    </div>
                    <p className="text-sm text-purple-900 font-medium">
                        إطلاق الحملات التسويقية
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="w-full max-w-md">
                <Button
                    variant="default" // Using default provided by Shadcn which is likely styled as primary
                    size="lg"
                    className="w-full bg-[#105D3B] hover:bg-[#158052] font-bold text-lg h-12 shadow-lg shadow-green-900/20"
                    onClick={() => {
                        setStatus("connected");
                        setStep(0);
                    }}
                >
                    البدء الآن
                    <ArrowRight className="w-5 h-5 mr-2" />
                </Button>
            </div>

            {/* Progress */}
            <div className="mt-8 text-sm text-gray-500">الخطوة 3 من 3 - مكتمل</div>
        </div>
    );
}
