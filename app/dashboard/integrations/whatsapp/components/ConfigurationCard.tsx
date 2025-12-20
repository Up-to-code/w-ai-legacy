"use client";

import { Key, CheckCircle, X, Loader2 } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { CredentialInput } from "@/components/ui/credential-input";
import { CopyableInput } from "@/components/ui/copyable-input";
import { Button } from "@/components/ui/button";

interface ConfigurationCardProps {
    formData: {
        accessToken: string;
        phoneNumberId: string;
        businessAccountId: string;
        verifyToken: string;
    };
    setFormData: (data: any) => void;
    webhookUrl: string;
    handleCopy: (text: string) => void;
    refreshVerifyToken: () => Promise<void>;
    handleSave: () => Promise<boolean>;
    loading: boolean;
    onDisconnect: () => void;
}

export default function ConfigurationCard({
    formData,
    setFormData,
    webhookUrl,
    handleCopy,
    refreshVerifyToken,
    handleSave,
    loading,
    onDisconnect,
}: ConfigurationCardProps) {
    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <SectionHeader icon={Key} title="بيانات الربط" />
                <StatusBadge status="connected" />
            </div>

            <CredentialInput
                label="Access Token"
                value={formData.accessToken}
                onChange={(value) => setFormData({ ...formData, accessToken: value })}
                placeholder="Access Token"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CredentialInput
                    label="Phone Number ID"
                    value={formData.phoneNumberId}
                    onChange={(value) => setFormData({ ...formData, phoneNumberId: value })}
                    placeholder="Phone Number ID"
                    showToggle={false}
                />
                <CredentialInput
                    label="Business Account ID"
                    value={formData.businessAccountId}
                    onChange={(value) => setFormData({ ...formData, businessAccountId: value })}
                    placeholder="Business Account ID"
                    showToggle={false}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <CopyableInput
                    label="رابط الويب هوك الخاص بك"
                    value={webhookUrl}
                    onCopy={() => handleCopy(webhookUrl)}
                />
                <CopyableInput
                    label="رمز التحقق (Verify Token)"
                    value={formData.verifyToken}
                    onCopy={() => handleCopy(formData.verifyToken)}
                    onRefresh={refreshVerifyToken}
                    loading={loading}
                />
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs text-gray-600 leading-relaxed">
                💡 يتم توجيه الرسائل من Meta إلى هذا الرابط، ويقوم النظام بمطابقتها تلقائياً مع حسابك.
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 border-t border-gray-100">
                <Button variant="primary" onClick={handleSave} disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    {loading ? "جاري الحفظ..." : "حفظ الإعدادات"}
                </Button>

                <Button variant="danger" onClick={onDisconnect}>
                    <X className="w-4 h-4" />
                    إلغاء الربط
                </Button>
            </div>
        </div>
    );
}
