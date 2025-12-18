'use client';

import {
  MessageSquare,
  Key,
  CheckCircle,
  X,
  Loader2,
  ChevronDown,
  AlertTriangle,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/lib/hooks/use-toast";
import { sendTestMessage } from "@/app/actions/send-test-message";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { CredentialInput } from "@/components/ui/credential-input";
import { CopyableInput } from "@/components/ui/copyable-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  COUNTRIES,
  findCountryByCode,
  detectCountryFromPhone,
  filterCountries,
  isValidPhoneLength,
  cleanPhoneNumber,
  getPhoneValidationError,
} from "../utils";

interface ConnectedViewProps {
  formData: {
    accessToken: string;
    phoneNumberId: string;
    businessAccountId: string;
    verifyToken: string;
  };
  setFormData: (data: ConnectedViewProps["formData"]) => void;
  handleSave: () => Promise<boolean>;
  loading: boolean;
  setShowDisconnectModal: (show: boolean) => void;
  handleCopy: (text: string) => void;
  refreshVerifyToken: () => Promise<void>;
  webhookUrl: string;
}

export function ConnectedView({
  formData,
  setFormData,
  handleSave,
  loading,
  setShowDisconnectModal,
  handleCopy,
  refreshVerifyToken,
  webhookUrl,
}: ConnectedViewProps) {
  const toast = useToast();

  const [testPhone, setTestPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+966");
  const [sendingTest, setSendingTest] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(e: PointerEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowCountryDropdown(false);
        setCountrySearch("");
      }
    }

    if (showCountryDropdown) {
      document.addEventListener("pointerdown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [showCountryDropdown]);

  const filteredCountries = filterCountries(COUNTRIES, countrySearch);
  const selectedCountry = findCountryByCode(countryCode);
  const phoneError = getPhoneValidationError(testPhone);

  const handleSendTest = async () => {
    if (!isValidPhoneLength(testPhone)) return;
    setSendingTest(true);
    try {
      const res = await sendTestMessage(countryCode + testPhone);
      if (res.success) {
        toast.success("تم إرسال الرسالة بنجاح");
        setTestPhone("");
      } else {
        toast.error(res.error || "فشل الإرسال");
      }
    } catch {
      toast.error("حدث خطأ أثناء الإرسال");
    } finally {
      setSendingTest(false);
    }
  };

  const handlePhoneChange = (value: string) => {
    const cleaned = cleanPhoneNumber(value);

    if (cleaned.startsWith('+')) {
      const detected = detectCountryFromPhone(cleaned);
      if (detected) {
        setCountryCode(detected);
        setTestPhone(cleaned.substring(detected.length));
        return;
      }
    }

    setTestPhone(cleaned);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* TEST MESSAGE */}
      <Card>
        <div className="p-6 sm:p-8 space-y-6">
          <SectionHeader
            icon={MessageSquare}
            title="اختبار الاتصال"
            description="أرسل رسالة تجريبية لتأكيد عمل التكامل."
          />

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 items-start">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-amber-900 mb-1">وضع الاختبار</p>
              <p className="text-xs text-amber-800">يجب إضافة الرقم في قائمة الأرقام التجريبية في Meta أولاً.</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>رقم الهاتف للاختبار</Label>
            <div className="flex border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#105D3B]/20" dir="ltr">
              <div className="relative bg-gray-50 border-r border-gray-200" ref={dropdownRef}>
                <button
                  onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                  disabled={sendingTest}
                  className="px-4 py-3 flex items-center gap-2 min-w-[120px] hover:bg-gray-100 disabled:opacity-50"
                  type="button"
                >
                  <span className="text-xl">{selectedCountry?.flag || "🌐"}</span>
                  <span className="font-semibold">{countryCode}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showCountryDropdown ? "rotate-180" : ""}`} />
                </button>

                {showCountryDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white border rounded-xl shadow-xl z-50" dir="rtl">
                    <div className="p-2 border-b">
                      <Input
                        placeholder="ابحث..."
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        className="h-9"
                      />
                    </div>
                    <div className="max-h-48 overflow-y-auto p-1">
                      {filteredCountries.map((c) => (
                        <button
                          key={c.code}
                          onClick={() => {
                            setCountryCode(c.code);
                            setShowCountryDropdown(false);
                            setCountrySearch("");
                          }}
                          className="w-full px-3 py-2 flex items-center gap-3 hover:bg-gray-50 rounded-lg text-right"
                          type="button"
                        >
                          <span className="text-lg">{c.flag}</span>
                          <span className="flex-1 text-sm">{c.name}</span>
                          <span className="font-mono text-sm text-[#105D3B]" dir="ltr">{c.code}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Input
                ref={phoneInputRef}
                type="tel"
                value={testPhone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="501234567"
                className="flex-1 border-0 rounded-none"
                dir="ltr"
                disabled={sendingTest}
              />
            </div>

            {phoneError && (
              <p className="text-xs text-red-600">⚠️ {phoneError}</p>
            )}
          </div>

          <Button
            variant="primary"
            onClick={handleSendTest}
            disabled={sendingTest || !isValidPhoneLength(testPhone)}
          >
            {sendingTest ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
            {sendingTest ? "جاري الإرسال..." : "إرسال رسالة تجريبية"}
          </Button>
        </div>
      </Card>

      {/* CONFIG */}
      <Card>
        <div className="p-6 sm:p-8 space-y-6">
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
              label="Webhook URL"
              value={webhookUrl}
              onCopy={() => handleCopy(webhookUrl)}
            />
            <CopyableInput
              label="Verify Token"
              value={formData.verifyToken}
              onCopy={() => handleCopy(formData.verifyToken)}
              onRefresh={refreshVerifyToken}
              loading={loading}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 border-t border-gray-100">
            <Button variant="primary" onClick={handleSave} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              {loading ? "جاري الحفظ..." : "حفظ الإعدادات"}
            </Button>

            <Button variant="danger" onClick={() => setShowDisconnectModal(true)}>
              <X className="w-4 h-4" />
              إلغاء الربط
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}