import { Key, ArrowRight, Loader2 } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { CredentialInput } from "@/components/ui/credential-input";
import { Button } from "@/components/ui/button";

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
    return (
        <div className="p-8">
            <SectionHeader
                icon={Key}
                iconBgColor="bg-[#105D3B]/10"
                iconColor="text-[#105D3B]"
                title="إعداد مفاتيح الاتصال"
                description="أدخل بيانات تطبيق Meta Business الخاص بك"
                className="mb-8"
            />

            <div className="space-y-6">
                <div className="space-y-4">
                    <CredentialInput
                        label="Access Token"
                        value={formData.accessToken}
                        onChange={(value) => setFormData({ ...formData, accessToken: value })}
                        placeholder="AdBv..."
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <CredentialInput
                            label="Phone Number ID"
                            value={formData.phoneNumberId}
                            onChange={(value) => setFormData({ ...formData, phoneNumberId: value })}
                            placeholder="123456789"
                            showToggle={false}
                        />
                        <CredentialInput
                            label="Business Account ID"
                            value={formData.businessAccountId}
                            onChange={(value) => setFormData({ ...formData, businessAccountId: value })}
                            placeholder="987654321"
                            showToggle={false}
                        />
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={handleSaveCredentials}
                        disabled={loading || !formData.accessToken || !formData.phoneNumberId}
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                        حفظ ومتابعة
                    </Button>
                </div>
            </div>
        </div>
    );
}
