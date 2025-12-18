import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WizardStep3Props {
    setStatus: (status: "loading" | "connected" | "disconnected") => void;
    setStep: (step: number) => void;
}

export function WizardStep3({ setStatus, setStep }: WizardStep3Props) {
    return (
        <div className="p-12 text-center">
            <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-8 shadow-inner">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 animate-in zoom-in-50 duration-500">
                    <CheckCircle className="w-10 h-10" />
                </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">تم الربط بنجاح!</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-10 leading-relaxed">
                حساب الواتساب الخاص بك متصل الآن وجاهز للاستخدام. يمكنك البدء في استقبال الرسائل وإرسال الحملات فوراً.
            </p>

            <div className="max-w-md mx-auto pt-8 border-t border-gray-100">
                <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={() => {
                        setStatus("connected");
                        setStep(0);
                    }}
                >
                    الذهاب للوحة الإعدادات
                    <ArrowRight className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
}
