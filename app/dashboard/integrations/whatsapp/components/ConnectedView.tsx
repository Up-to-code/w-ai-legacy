'use client';

import {
  MessageSquare,
  Copy,
  RefreshCw,
  Key,
  CheckCircle,
  X,
  Loader2,
  ChevronDown,
  AlertTriangle,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/lib/hooks/use-toast";
import { sendTestMessage } from "@/app/actions/send-test-message";

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
  const [showAccessToken, setShowAccessToken] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: PointerEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowCountryDropdown(false);
        setCountrySearch("");
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape' && showCountryDropdown) {
        setShowCountryDropdown(false);
        setCountrySearch("");
      }
    }

    if (showCountryDropdown) {
      document.addEventListener("pointerdown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showCountryDropdown]);

  const countries = [
    { code: "+966", name: "السعودية", nameEn: "Saudi Arabia", flag: "🇸🇦" },
    { code: "+971", name: "الإمارات", nameEn: "UAE", flag: "🇦🇪" },
    { code: "+965", name: "الكويت", nameEn: "Kuwait", flag: "🇰🇼" },
    { code: "+974", name: "قطر", nameEn: "Qatar", flag: "🇶🇦" },
    { code: "+973", name: "البحرين", nameEn: "Bahrain", flag: "🇧🇭" },
    { code: "+968", name: "عمان", nameEn: "Oman", flag: "🇴🇲" },
    { code: "+967", name: "اليمن", nameEn: "Yemen", flag: "🇾🇪" },
    { code: "+20", name: "مصر", nameEn: "Egypt", flag: "🇪🇬" },
    { code: "+962", name: "الأردن", nameEn: "Jordan", flag: "🇯🇴" },
    { code: "+961", name: "لبنان", nameEn: "Lebanon", flag: "🇱🇧" },
    { code: "+963", name: "سوريا", nameEn: "Syria", flag: "🇸🇾" },
    { code: "+964", name: "العراق", nameEn: "Iraq", flag: "🇮🇶" },
    { code: "+212", name: "المغرب", nameEn: "Morocco", flag: "🇲🇦" },
    { code: "+213", name: "الجزائر", nameEn: "Algeria", flag: "🇩🇿" },
    { code: "+216", name: "تونس", nameEn: "Tunisia", flag: "🇹🇳" },
    { code: "+218", name: "ليبيا", nameEn: "Libya", flag: "🇱🇾" },
    { code: "+249", name: "السودان", nameEn: "Sudan", flag: "🇸🇩" },
    { code: "+1", name: "أمريكا/كندا", nameEn: "USA/Canada", flag: "🇺🇸" },
    { code: "+44", name: "بريطانيا", nameEn: "UK", flag: "🇬🇧" },
    { code: "+33", name: "فرنسا", nameEn: "France", flag: "🇫🇷" },
    { code: "+49", name: "ألمانيا", nameEn: "Germany", flag: "🇩🇪" },
    { code: "+39", name: "إيطاليا", nameEn: "Italy", flag: "🇮🇹" },
    { code: "+34", name: "إسبانيا", nameEn: "Spain", flag: "🇪🇸" },
    { code: "+31", name: "هولندا", nameEn: "Netherlands", flag: "🇳🇱" },
    { code: "+32", name: "بلجيكا", nameEn: "Belgium", flag: "🇧🇪" },
    { code: "+41", name: "سويسرا", nameEn: "Switzerland", flag: "🇨🇭" },
    { code: "+43", name: "النمسا", nameEn: "Austria", flag: "🇦🇹" },
    { code: "+46", name: "السويد", nameEn: "Sweden", flag: "🇸🇪" },
    { code: "+47", name: "النرويج", nameEn: "Norway", flag: "🇳🇴" },
    { code: "+45", name: "الدنمارك", nameEn: "Denmark", flag: "🇩🇰" },
    { code: "+358", name: "فنلندا", nameEn: "Finland", flag: "🇫🇮" },
    { code: "+7", name: "روسيا", nameEn: "Russia", flag: "🇷🇺" },
    { code: "+90", name: "تركيا", nameEn: "Turkey", flag: "🇹🇷" },
    { code: "+98", name: "إيران", nameEn: "Iran", flag: "🇮🇷" },
    { code: "+92", name: "باكستان", nameEn: "Pakistan", flag: "🇵🇰" },
    { code: "+91", name: "الهند", nameEn: "India", flag: "🇮🇳" },
    { code: "+86", name: "الصين", nameEn: "China", flag: "🇨🇳" },
    { code: "+81", name: "اليابان", nameEn: "Japan", flag: "🇯🇵" },
    { code: "+82", name: "كوريا الجنوبية", nameEn: "South Korea", flag: "🇰🇷" },
    { code: "+65", name: "سنغافورة", nameEn: "Singapore", flag: "🇸🇬" },
    { code: "+60", name: "ماليزيا", nameEn: "Malaysia", flag: "🇲🇾" },
    { code: "+62", name: "إندونيسيا", nameEn: "Indonesia", flag: "🇮🇩" },
    { code: "+66", name: "تايلاند", nameEn: "Thailand", flag: "🇹🇭" },
    { code: "+84", name: "فيتنام", nameEn: "Vietnam", flag: "🇻🇳" },
    { code: "+61", name: "أستراليا", nameEn: "Australia", flag: "🇦🇺" },
    { code: "+64", name: "نيوزيلندا", nameEn: "New Zealand", flag: "🇳🇿" },
    { code: "+27", name: "جنوب أفريقيا", nameEn: "South Africa", flag: "🇿🇦" },
    { code: "+234", name: "نيجيريا", nameEn: "Nigeria", flag: "🇳🇬" },
    { code: "+254", name: "كينيا", nameEn: "Kenya", flag: "🇰🇪" },
    { code: "+55", name: "البرازيل", nameEn: "Brazil", flag: "🇧🇷" },
    { code: "+52", name: "المكسيك", nameEn: "Mexico", flag: "🇲🇽" },
    { code: "+54", name: "الأرجنتين", nameEn: "Argentina", flag: "🇦🇷" },
  ];

  // Fast search - search in Arabic name, English name, and code
  const filteredCountries = countries.filter((c) => {
    const search = countrySearch.trim().toLowerCase();
    if (!search) return true;
    return (
      c.name.includes(search) ||
      c.nameEn.toLowerCase().includes(search) ||
      c.code.includes(search) ||
      c.code.replace('+', '').includes(search)
    );
  });

  // Auto-detect country code from phone input
  const detectCountryFromPhone = (phoneValue: string) => {
    if (phoneValue.startsWith('+')) {
      // Try to match country codes (longest first to avoid partial matches)
      const sortedCountries = [...countries].sort((a, b) => b.code.length - a.code.length);
      for (const country of sortedCountries) {
        if (phoneValue.startsWith(country.code)) {
          return country.code;
        }
      }
    }
    return null;
  };

  const handleSendTest = async () => {
    if (testPhone.length < 7) return;

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

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* TEST MESSAGE */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2.5 mb-1.5">
              <MessageSquare className="w-5 h-5 text-[#105D3B]" />
              اختبار الاتصال
            </h2>
            <p className="text-sm text-gray-600">أرسل رسالة تجريبية لتأكيد عمل التكامل بشكل صحيح.</p>
          </div>

          {/* Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 items-start" role="alert">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-amber-900 mb-1">وضع الاختبار</p>
              <p className="text-xs text-amber-800 leading-relaxed">
                يجب إضافة رقم المستلم في قائمة الأرقام التجريبية في لوحة Meta أولاً.{' '}
                <a 
                  href="https://developers.facebook.com/docs/whatsapp/cloud-api/get-started#test-numbers" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline font-medium hover:text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded px-0.5"
                >
                  راجع التعليمات
                </a>
              </p>
            </div>
          </div>

          {/* Phone Input */}
          <div className="space-y-2">
            <label htmlFor="test-phone-input" className="block text-sm font-semibold text-gray-900">
              رقم الهاتف للاختبار
            </label>
            
            <div className="flex flex-col sm:flex-row w-full border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#105D3B]/20 focus-within:border-[#105D3B] transition-all" dir="ltr">
              {/* Country Selector - Dropdown Menu */}
              <div className="relative bg-gray-50 border-b sm:border-b-0 sm:border-r border-gray-200" ref={dropdownRef}>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!sendingTest) {
                      setShowCountryDropdown(!showCountryDropdown);
                    }
                  }}
                  disabled={sendingTest}
                  className="w-full sm:w-auto px-4 py-3 flex items-center justify-between sm:justify-center gap-2.5 sm:min-w-[140px] md:min-w-[150px] hover:bg-gray-100 active:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none"
                  aria-label="اختر رمز الدولة"
                  aria-expanded={showCountryDropdown}
                  aria-haspopup="listbox"
                  type="button"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl shrink-0 pointer-events-none" aria-hidden="true">{countries.find(c => c.code === countryCode)?.flag || '🌐'}</span>
                    <span className="font-semibold text-gray-900 pointer-events-none">{countryCode}</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform shrink-0 pointer-events-none sm:hidden ${
                      showCountryDropdown ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                  <ChevronDown
                    className={`hidden sm:block w-4 h-4 text-gray-400 transition-transform shrink-0 pointer-events-none ${
                      showCountryDropdown ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {/* Dropdown Menu - Responsive positioning */}
                {showCountryDropdown && (
                  <div 
                    className="absolute sm:top-full top-auto bottom-full sm:bottom-auto left-0 sm:left-0 right-0 sm:right-auto mb-1.5 sm:mb-0 sm:mt-1.5 w-full sm:w-[90vw] sm:max-w-md bg-white border border-gray-200 rounded-xl shadow-xl z-50" 
                    dir="rtl"
                    role="listbox"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Search Input inside dropdown */}
                    <div className="sticky top-0 bg-white p-3 border-b border-gray-100 z-10">
                      <input
                        type="text"
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#105D3B]/20 focus:border-[#105D3B] text-sm"
                        placeholder="ابحث بالاسم أو الكود..."
                        value={countrySearch}
                        onChange={(e) => {
                          e.stopPropagation();
                          setCountrySearch(e.target.value);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (filteredCountries.length === 1) {
                              setCountryCode(filteredCountries[0].code);
                              setShowCountryDropdown(false);
                              setCountrySearch("");
                            }
                          }
                        }}
                        autoFocus
                        aria-label="البحث عن دولة"
                        dir="rtl"
                        aria-autocomplete="list"
                        aria-controls="country-list"
                      />
                      {countrySearch && (
                        <p className="text-xs text-gray-500 mt-1.5" role="status" aria-live="polite">
                          {filteredCountries.length} نتيجة
                        </p>
                      )}
                    </div>
                    {/* Countries List */}
                    <div id="country-list" className="max-h-64 sm:max-h-80 overflow-y-auto p-1" role="list">
                      {filteredCountries.length > 0 ? (
                        filteredCountries.map((c) => (
                          <button
                            key={c.code}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setCountryCode(c.code);
                              setShowCountryDropdown(false);
                              setCountrySearch("");
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setCountryCode(c.code);
                                setShowCountryDropdown(false);
                                setCountrySearch("");
                              }
                            }}
                            className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-[#105D3B]/5 focus:bg-[#105D3B]/5 focus:outline-none focus:ring-1 focus:ring-[#105D3B]/20 rounded-lg transition-colors text-right cursor-pointer"
                            role="option"
                            aria-selected={countryCode === c.code}
                            tabIndex={0}
                            type="button"
                          >
                            <span className="text-xl shrink-0" aria-hidden="true">{c.flag}</span>
                            <div className="flex-1 flex flex-col items-start min-w-0">
                              <span className="font-medium text-gray-900 text-sm">{c.name}</span>
                              <span className="text-xs text-gray-500 hidden sm:inline">{c.nameEn}</span>
                            </div>
                            <span className="font-mono text-sm font-semibold text-[#105D3B]" dir="ltr">{c.code}</span>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-8 text-center">
                          <p className="text-sm text-gray-500 mb-2">لم يتم العثور على نتائج</p>
                          {countrySearch.startsWith('+') && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setCountryCode(countrySearch);
                                setShowCountryDropdown(false);
                                setCountrySearch("");
                              }}
                              className="px-4 py-2 text-sm text-[#105D3B] font-semibold hover:bg-[#105D3B]/10 focus:bg-[#105D3B]/10 focus:outline-none focus:ring-2 focus:ring-[#105D3B]/20 focus:ring-offset-1 rounded-lg transition-all"
                              type="button"
                            >
                              استخدام {countrySearch}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Phone Input */}
              <input
                id="test-phone-input"
                type="tel"
                value={testPhone}
                onChange={(e) => {
                  let value = e.target.value;
                  // Allow + and digits
                  value = value.replace(/[^\d+]/g, "");
                  
                  // Auto-detect country if starts with +
                  if (value.startsWith('+')) {
                    const detectedCode = detectCountryFromPhone(value);
                    if (detectedCode) {
                      setCountryCode(detectedCode);
                      // Remove the country code from the input
                      value = value.substring(detectedCode.length);
                    }
                  }
                  
                  setTestPhone(value);
                }}
                placeholder="501234567 أو +966501234567"
                className="flex-1 px-4 py-3 outline-none font-mono text-sm sm:text-base text-gray-900 bg-transparent focus:ring-0 placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                dir="ltr"
                disabled={sendingTest}
                aria-label="رقم الهاتف"
                aria-required="true"
                aria-invalid={testPhone.length > 0 && testPhone.length < 7}
                aria-describedby="phone-hint phone-error"
              />
            </div>

            {testPhone.length > 0 && testPhone.length < 7 && (
              <p id="phone-error" className="text-xs text-red-600 flex items-center gap-1" role="alert" aria-live="polite">
                <span aria-hidden="true">⚠️</span>
                <span>رقم الهاتف يجب أن يكون 7 أرقام على الأقل</span>
              </p>
            )}

            <p id="phone-hint" className="text-xs text-gray-600 flex items-center gap-1.5">
              <span className="text-amber-500" aria-hidden="true">⚡</span>
              <span>سيتم إرسال رسالة &quot;Hello World&quot; تلقائياً للتأكد من نجاح الاتصال</span>
            </p>
          </div>

          <button
            onClick={handleSendTest}
            disabled={sendingTest || testPhone.length < 7}
            className="w-full sm:w-auto bg-[#105D3B] text-white px-6 sm:px-8 py-3 rounded-xl font-semibold hover:bg-[#0d4f32] focus:outline-none focus:ring-2 focus:ring-[#105D3B]/20 focus:ring-offset-2 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            aria-label="إرسال رسالة تجريبية"
            aria-describedby={testPhone.length < 7 ? "phone-error" : undefined}
            type="button"
          >
            {sendingTest ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                <span>جاري الإرسال...</span>
              </>
            ) : (
              <>
                <MessageSquare className="w-4 h-4" aria-hidden="true" />
                <span>إرسال رسالة تجريبية</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* CONFIG */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
        <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2.5">
              <Key className="w-5 h-5 text-[#105D3B]" aria-hidden="true" />
              بيانات الربط
            </h2>
            <div className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 border border-green-200" role="status" aria-live="polite">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" aria-hidden="true"></span>
              <span>متصل</span>
            </div>
          </div>

          {/* Access Token - Full Width */}
          <div className="space-y-2">
            <label htmlFor="access-token" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Access Token
            </label>
            <div className="relative">
              <input
                id="access-token"
                type={showAccessToken ? "text" : "password"}
                value={formData.accessToken}
                onChange={(e) =>
                  setFormData({ ...formData, accessToken: e.target.value })
                }
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 border border-gray-200 rounded-lg font-mono text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#105D3B]/20 focus:border-[#105D3B] transition-all"
                placeholder="Access Token"
                dir="ltr"
                aria-label="Access Token"
                aria-describedby="access-token-hint"
              />
              <button
                onClick={() => setShowAccessToken(!showAccessToken)}
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#105D3B]/20 focus:ring-offset-1 rounded p-1 transition-colors"
                aria-label={showAccessToken ? "إخفاء الرمز" : "إظهار الرمز"}
                aria-pressed={showAccessToken}
                type="button"
              >
                {showAccessToken ? (
                  <EyeOff className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <Eye className="w-4 h-4" aria-hidden="true" />
                )}
              </button>
            </div>
            <p id="access-token-hint" className="text-xs text-gray-500 sr-only">
              Access Token for WhatsApp Business API authentication
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="phone-number-id" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Phone Number ID
              </label>
              <input
                id="phone-number-id"
                value={formData.phoneNumberId}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumberId: e.target.value })
                }
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg font-mono text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#105D3B]/20 focus:border-[#105D3B] transition-all"
                placeholder="Phone Number ID"
                dir="ltr"
                aria-label="Phone Number ID"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="business-account-id" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Business Account ID
              </label>
              <input
                id="business-account-id"
                value={formData.businessAccountId}
                onChange={(e) =>
                  setFormData({ ...formData, businessAccountId: e.target.value })
                }
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg font-mono text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#105D3B]/20 focus:border-[#105D3B] transition-all"
                placeholder="Business Account ID"
                dir="ltr"
                aria-label="Business Account ID"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div className="space-y-2">
              <label htmlFor="webhook-url" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Webhook URL
              </label>
              <div className="relative">
                <input
                  id="webhook-url"
                  readOnly
                  value={webhookUrl}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-16 sm:pr-20 border border-gray-200 rounded-lg font-mono text-xs sm:text-sm text-gray-700 bg-gray-50"
                  dir="ltr"
                  aria-label="Webhook URL"
                />
                <button 
                  onClick={() => handleCopy(webhookUrl)}
                  className="absolute left-1.5 sm:left-2 top-1/2 -translate-y-1/2 flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-[#105D3B] hover:border-[#105D3B]/30 focus:outline-none focus:ring-2 focus:ring-[#105D3B]/20 focus:ring-offset-1 transition-all"
                  aria-label="نسخ Webhook URL"
                  type="button"
                >
                  <Copy className="w-3 sm:w-3.5 h-3 sm:h-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">نسخ</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="verify-token" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Verify Token
              </label>
              <div className="relative">
                <input
                  id="verify-token"
                  readOnly
                  value={formData.verifyToken}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-16 sm:pr-20 border border-gray-200 rounded-lg font-mono text-xs sm:text-sm text-gray-700 bg-gray-50"
                  dir="ltr"
                  aria-label="Verify Token"
                />
                <div className="absolute left-1.5 sm:left-2 top-1/2 -translate-y-1/2 flex items-center gap-1 sm:gap-1.5">
                  <button 
                    onClick={() => handleCopy(formData.verifyToken)}
                    className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-[#105D3B] hover:border-[#105D3B]/30 focus:outline-none focus:ring-2 focus:ring-[#105D3B]/20 focus:ring-offset-1 transition-all"
                    aria-label="نسخ Verify Token"
                    type="button"
                  >
                    <Copy className="w-3 sm:w-3.5 h-3 sm:h-3.5" aria-hidden="true" />
                    <span className="hidden sm:inline">نسخ</span>
                  </button>
                  <button 
                    onClick={refreshVerifyToken}
                    disabled={loading}
                    className="p-1 sm:p-1.5 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-[#105D3B] hover:border-[#105D3B]/30 focus:outline-none focus:ring-2 focus:ring-[#105D3B]/20 focus:ring-offset-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="توليد رمز جديد"
                    title="توليد رمز جديد"
                    type="button"
                  >
                    <RefreshCw className={`w-3 sm:w-3.5 h-3 sm:h-3.5 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-[#105D3B] text-white rounded-lg font-semibold hover:bg-[#0d4f32] focus:outline-none focus:ring-2 focus:ring-[#105D3B]/20 focus:ring-offset-2 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              aria-label="حفظ الإعدادات"
              type="button"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" aria-hidden="true" />
                  <span>حفظ الإعدادات</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowDisconnectModal(true)}
              className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 text-red-600 border border-red-200 rounded-lg font-medium hover:bg-red-50 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-300/50 focus:ring-offset-2 transition-all flex items-center justify-center gap-2"
              aria-label="إلغاء ربط WhatsApp"
              type="button"
            >
              <X className="w-4 h-4" aria-hidden="true" />
              <span>إلغاء الربط</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
