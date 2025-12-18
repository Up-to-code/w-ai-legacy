import { Globe, Loader2, ShieldCheck } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { CopyableInput } from "@/components/ui/copyable-input";
import { Button } from "@/components/ui/button";

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
    setStep,
    handleVerifyWebhook,
    verifying
}: WizardStep2Props) {
    return (
        <div className="p-8">
            <SectionHeader
                icon={Globe}
                iconBgColor="bg-blue-50"
                iconColor="text-blue-600"
                title="إعداد الويب هوك"
                description="قم بتكوين الرابط في لوحة تحكم Meta"
                className="mb-8"
            />

            <div className="space-y-6">
                <div className="space-y-4">
                    <CopyableInput
                        label="رابط الويب هوك الخاص بك"
                        value={webhookUrl}
                        onCopy={() => handleCopy(webhookUrl)}
                    />
                    <CopyableInput
                        label="رمز التحقق (Verify Token)"
                        value={verifyToken}
                        onCopy={() => handleCopy(verifyToken)}
                        onRefresh={refreshVerifyToken}
                    />
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs text-gray-600 leading-relaxed">
                    💡 يتم توجيه الرسائل من Meta إلى هذا الرابط، ويقوم النظام بمطابقتها تلقائياً مع حسابك.
                </div>

                <div className="flex justify-between items-center pt-4">
                    <Button variant="ghost" onClick={() => setStep(1)}>
                        السابق
                    </Button>
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={handleVerifyWebhook}
                        disabled={verifying}
                    >
                        {verifying ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                        التحقق من الاتصال
                    </Button>
                </div>
            </div>
        </div>
    );
}
