import { useState } from "react";
import { Sparkles, Save, Loader2, RotateCcw, Cpu, Info } from "lucide-react";
import type { BotSetting, KnowledgeSource } from "@/types/bot";
import { MAX_CONTEXT_TOKENS } from "@/lib/ai/bot-utils";
import { improveBotPrompt } from "../actions";
import { useToast } from "@/lib/hooks/use-toast";

interface BotSettingsProps {
    settings: BotSetting;
    setSettings: (settings: BotSetting) => void;
    onSave: () => Promise<void>;
    onReset: () => void;
    saving: boolean;
    tokens: number;
    sources: KnowledgeSource[];
}

export default function BotSettings({ settings, setSettings, onSave, onReset, saving, tokens, sources }: BotSettingsProps) {
    const [improving, setImproving] = useState(false);
    const toast = useToast();
    const isOverLimit = tokens > MAX_CONTEXT_TOKENS;

    const handleImprovePrompt = async () => {
        if (!settings.systemPrompt?.trim()) {
            toast.error("يرجى كتابة مسودة للمطلب أولاً ليتم تحسينها.");
            return;
        }

        setImproving(true);
        try {
            const res = await improveBotPrompt(settings.systemPrompt, {
                name: settings.name,
                tone: settings.tone,
                metadata: settings.metadata
            });
            if (res.success && res.data) {
                // Directly update the settings state to prevent any weird revert issues
                const updatedSettings = { ...settings, systemPrompt: res.data };
                setSettings(updatedSettings);
                toast.success("تم تحسين المطلب بنجاح بواسطة الذكاء الاصطناعي.");
            } else {
                throw new Error(res.error);
            }
        } catch (error: any) {
            toast.error(error.message || "حدث خطأ أثناء محاولة تحسين المطلب.");
        } finally {
            setImproving(false);
        }
    };

    return (
        <div className="p-8 h-full overflow-y-auto animate-in fade-in slide-in-from-bottom-2">
            <div className="max-w-2xl mx-auto">

                <div className="space-y-10">
                    {/* Unified Assistant Brain */}
                    <div className="space-y-4">
                        <div className="bg-primary/5 border border-primary/20 rounded-[3rem] p-10 flex flex-col gap-8 shadow-sm relative overflow-hidden">
                            {/* Decorative background element */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />

                            <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/10">
                                        <Cpu className="w-7 h-7 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black text-gray-900 leading-none">عقل المساعد (Brain)</h4>
                                        <p className="text-[10px] text-gray-400 font-bold mt-1.5 uppercase tracking-tight">قواعد العمل، النبرة، وتعليمات الرد</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleImprovePrompt}
                                    disabled={improving}
                                    className="flex items-center gap-2.5 px-6 py-3 bg-amber-50 text-amber-600 border border-amber-200 rounded-2xl text-[12px] font-black hover:bg-amber-100 transition-all active:scale-95 disabled:opacity-50 shadow-sm"
                                >
                                    {improving ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Sparkles className="w-4 h-4" />
                                    )}
                                    تحسين الذكاء الاصطناعي
                                </button>
                            </div>

                            <textarea
                                value={settings.systemPrompt || ''}
                                onChange={(e) => setSettings({ ...settings, systemPrompt: e.target.value })}
                                className="w-full h-[400px] p-8 bg-white/90 rounded-[2rem] border border-gray-100 focus:bg-white focus:border-primary/30 focus:ring-[12px] focus:ring-primary/5 transition-all outline-none resize-none text-base font-medium leading-relaxed dir-rtl custom-scrollbar shadow-inner relative z-10"
                                placeholder="..."
                            />

                            <div className="flex gap-4 relative z-10">
                                <div className="flex-1 p-5 bg-white/60 rounded-2xl border border-gray-100/50 flex gap-4">
                                    <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                    <p className="text-xs text-gray-500 font-medium leading-relaxed">
                                        <strong>نصيحة:</strong> كلما كنت دقيقاً في وصف شخصية المساعد ومهامه، كانت الردود أفضل. يمكنك الضغط على "تحسين" ليقوم الذكاء الاصطناعي بتنظيم أفكارك.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Simple Actions */}
                    <div className="flex items-center justify-between pt-6">
                        <button
                            onClick={onReset}
                            className="text-gray-300 hover:text-gray-500 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest transition-colors"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            إعادة ضبط المصنع
                        </button>

                        <button
                            onClick={onSave}
                            disabled={saving || isOverLimit}
                            className={`px-12 py-4 rounded-[1.5rem] font-black flex items-center gap-3 transition-all active:scale-95 shadow-2xl disabled:opacity-70 disabled:active:scale-100 ${isOverLimit
                                ? 'bg-gray-400 text-white cursor-not-allowed shadow-none'
                                : 'bg-primary text-white hover:bg-primary/90 shadow-primary/20'
                                }`}
                        >
                            {saving ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Save className="w-5 h-5" />
                            )}
                            {isOverLimit ? 'تجاوزت الحد المسموح' : 'حفظ التغييرات'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
