"use client";

import { Layout, Palette, MessageSquare, Save, Loader2, Globe, Shield, Code, Copy, Check } from "lucide-react";
import type { BotSetting } from "@/types/bot";
import { useMemo, useState } from "react";
import { useToast } from "@/lib/hooks/use-toast";

interface WUISettingsProps {
    settings: BotSetting;
    setSettings: (settings: BotSetting) => void;
    onSave: () => Promise<void>;
    saving: boolean;
}

export default function WUISettings({ settings, setSettings, onSave, saving }: WUISettingsProps) {
    const toast = useToast();
    const [copied, setCopied] = useState(false);

    // Parse metadata safely for WUI settings
    const wuiConfig = useMemo(() => {
        try {
            const meta = typeof settings.metadata === 'string'
                ? JSON.parse(settings.metadata)
                : (settings.metadata || {});
            return meta.wui || {
                title: "كيف يمكننا مساعدتك؟",
                welcomeMessage: "مرحباً بك! أنا مساعدك الذكي، كيف يمكنني خدمتك اليوم؟",
                primaryColor: "#105D3B",
                position: "rtl",
                isSupportEnabled: true
            };
        } catch (e) {
            return {
                title: "كيف يمكننا مساعدتك؟",
                welcomeMessage: "مرحباً بك! أنا مساعدك الذكي، كيف يمكنني خدمتك اليوم؟",
                primaryColor: "#105D3B",
                position: "rtl",
                isSupportEnabled: true
            };
        }
    }, [settings.metadata]);

    const updateWui = (updates: Partial<typeof wuiConfig>) => {
        const meta = typeof settings.metadata === 'string'
            ? JSON.parse(settings.metadata)
            : (settings.metadata || {});

        const newMeta = {
            ...meta,
            wui: { ...wuiConfig, ...updates }
        };

        setSettings({
            ...settings,
            metadata: JSON.stringify(newMeta)
        });
    };

    const embedCode = `<!-- W-AI Chat Widget -->
<script src="${typeof window !== 'undefined' ? window.location.origin : 'https://w-ai.io'}/widget.js" 
  data-bot-id="${settings.id}" 
  data-color="${wuiConfig.primaryColor}" 
  data-position="${wuiConfig.position}"
  async>
</script>`;

    const handleCopy = () => {
        navigator.clipboard.writeText(embedCode);
        setCopied(true);
        toast.success("تم نسخ الكود بنجاح");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="p-8 h-full overflow-y-auto animate-in fade-in slide-in-from-bottom-2 custom-scrollbar">
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">

                    {/* Left Column */}
                    <div className="space-y-8">
                        {/* Welcome Texts */}
                        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm transition-all">
                            <div className="flex items-center gap-5 mb-10">
                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100/50">
                                    <MessageSquare className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black text-gray-900 leading-none">نصوص الترحيب</h4>
                                    <p className="text-[11px] text-gray-400 font-bold mt-1.5 uppercase tracking-wide">رسالة البداية والعنوان</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2.5 block px-1">عنوان الودجيت</label>
                                    <input
                                        type="text"
                                        value={wuiConfig.title}
                                        onChange={(e) => updateWui({ title: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white focus:ring-[12px] focus:ring-primary/5 transition-all outline-none"
                                        placeholder="كيف يمكننا مساعدتك؟"
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2.5 block px-1">رسالة الترحيب</label>
                                    <textarea
                                        value={wuiConfig.welcomeMessage}
                                        onChange={(e) => updateWui({ welcomeMessage: e.target.value })}
                                        className="w-full h-40 bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white focus:ring-[12px] focus:ring-primary/5 transition-all outline-none resize-none leading-relaxed"
                                        placeholder="..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Save Action */}
                        <div className="flex items-center">
                            <button
                                onClick={onSave}
                                disabled={saving}
                                className="w-full py-5 bg-[#105D3B] text-white rounded-[2rem] font-black flex items-center justify-center gap-4 hover:bg-[#0a4d30] transition-all active:scale-95 shadow-xl shadow-primary/20 disabled:opacity-70"
                            >
                                {saving ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <Save className="w-6 h-6" />
                                )}
                                حفظ تغييرات الويب (WUI)
                            </button>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        {/* Widget Appearance */}
                        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm transition-all">
                            <div className="flex items-center gap-5 mb-10">
                                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100/50">
                                    <Palette className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black text-gray-900 leading-none">مظهر الودجيت</h4>
                                    <p className="text-[11px] text-gray-400 font-bold mt-1.5 uppercase tracking-wide">الألوان والتصميم</p>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3 block px-1">اللون الأساسي</label>
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-14 h-14 rounded-2xl border-2 border-gray-100 shadow-inner relative overflow-hidden group cursor-pointer"
                                            style={{ backgroundColor: wuiConfig.primaryColor }}
                                        >
                                            <input
                                                type="color"
                                                value={wuiConfig.primaryColor}
                                                onChange={(e) => updateWui({ primaryColor: e.target.value })}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            value={wuiConfig.primaryColor?.toUpperCase()}
                                            onChange={(e) => updateWui({ primaryColor: e.target.value })}
                                            className="bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black flex-1 focus:bg-white transition-all uppercase"
                                            placeholder="#HEXCODE"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3 block px-1">موضع الودجيت</label>
                                    <div className="grid grid-cols-2 gap-3 p-1.5 bg-gray-50 rounded-2xl border border-gray-100">
                                        <button
                                            onClick={() => updateWui({ position: 'rtl' })}
                                            className={`px-4 py-3 rounded-xl transition-all text-xs font-black ${wuiConfig.position === 'rtl' ? 'bg-white text-primary shadow-sm ring-1 ring-black/5' : 'text-gray-400 hover:text-gray-600'}`}
                                        >
                                            يمين (RTL)
                                        </button>
                                        <button
                                            onClick={() => updateWui({ position: 'ltr' })}
                                            className={`px-4 py-3 rounded-xl transition-all text-xs font-black ${wuiConfig.position === 'ltr' ? 'bg-white text-primary shadow-sm ring-1 ring-black/5' : 'text-gray-400 hover:text-gray-600'}`}
                                        >
                                            يسار (LTR)
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Support Toggle */}
                        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100/50">
                                        <Shield className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black text-gray-900 leading-none">تفعيل الدعم</h4>
                                    </div>
                                </div>
                                <div
                                    onClick={() => updateWui({ isSupportEnabled: !wuiConfig.isSupportEnabled })}
                                    className={`w-14 h-7 rounded-full relative transition-all duration-300 cursor-pointer ${wuiConfig.isSupportEnabled ? 'bg-primary' : 'bg-gray-200'}`}
                                >
                                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 ${wuiConfig.isSupportEnabled ? 'right-1' : 'right-8'}`} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Domain Restriction Section - NEW */}
                <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm transition-all">
                    <div className="flex items-center gap-5 mb-8">
                        <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100/50">
                            <Shield className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <h4 className="text-xl font-black text-gray-900 leading-none">حماية النطاق (Domain Restriction)</h4>
                            <p className="text-[11px] text-gray-400 font-bold mt-1.5 uppercase tracking-wide">التحكم في المواقع المسموح لها باستخدام البوت</p>
                        </div>
                    </div>

                    <div>
                        <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2.5 block px-1">النطاقات المسموح بها (افصل بينها بفاصلة)</label>
                        <textarea
                            value={wuiConfig.allowedDomains || ''}
                            onChange={(e) => updateWui({ allowedDomains: e.target.value })}
                            className="w-full h-24 bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white focus:ring-[12px] focus:ring-primary/5 transition-all outline-none resize-none leading-relaxed placeholder:text-gray-300"
                            placeholder="example.com, mysite.org"
                        />
                        <p className="text-[10px] text-gray-400 mt-3 font-bold px-1">
                            اترك الحقل فارغاً للسماح لجميع النطاقات بالوصول.
                        </p>
                    </div>
                </div>

                {/* Embed Code Section - NEW */}
                <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm transition-all">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
                                <Code className="w-6 h-6 text-gray-600" />
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-gray-900 leading-none">كود التثبيت (Embed Code)</h4>
                                <p className="text-[11px] text-gray-400 font-bold mt-1.5 uppercase tracking-wide">انسخ الكود لإضافة البوت لموقعك</p>
                            </div>
                        </div>
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-2 px-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-2xl transition-all font-black text-xs active:scale-95"
                        >
                            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                            {copied ? "تم النسخ" : "نسخ الكود"}
                        </button>
                    </div>

                    <div className="relative group">
                        <pre className="bg-[#1C1C1C] text-gray-300 p-8 rounded-[2rem] text-sm font-mono overflow-x-auto selection:bg-white/10 custom-scrollbar leading-relaxed">
                            {embedCode}
                        </pre>
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-[2rem]" />
                    </div>

                    <div className="mt-8 p-6 bg-blue-50/50 rounded-2xl border border-blue-100/50 flex items-start gap-4">
                        <Globe className="w-5 h-5 text-blue-500 mt-1 shrink-0" />
                        <p className="text-[12px] text-blue-700 leading-relaxed font-bold">
                            قم بنسخ هذا الكود ولصقه في نهاية وسم <code className="bg-blue-100 px-1.5 py-0.5 rounded text-blue-800">&lt;/body&gt;</code> في موقعك الإلكتروني لتفعيل ودجيت المحادثة فوراً.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
