"use client";

import { MessageSquare, Loader2, ChevronDown, AlertTriangle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    COUNTRIES,
    findCountryByCode,
    filterCountries,
    isValidPhoneLength,
    getPhoneValidationError,
    cleanPhoneNumber,
    detectCountryFromPhone,
} from "../utils";

interface TestMessageCardProps {
    onSendTest: (phone: string) => Promise<void>;
    loading: boolean;
}

export default function TestMessageCard({ onSendTest, loading }: TestMessageCardProps) {
    const [testPhone, setTestPhone] = useState("");
    const [countryCode, setCountryCode] = useState("+966");
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

    const handleSend = async () => {
        if (!isValidPhoneLength(testPhone)) return;
        await onSendTest(countryCode + testPhone);
        setTestPhone("");
    };

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6 h-full">
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
                            disabled={loading}
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
                        className="flex-1 border-0 rounded-none h-auto py-3"
                        dir="ltr"
                        disabled={loading}
                    />
                </div>

                {phoneError && (
                    <p className="text-xs text-red-600">⚠️ {phoneError}</p>
                )}
            </div>

            <Button
                variant="primary"
                onClick={handleSend}
                disabled={loading || !isValidPhoneLength(testPhone)}
                className="w-full"
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
                {loading ? "جاري الإرسال..." : "إرسال رسالة تجريبية"}
            </Button>
        </div>
    );
}
