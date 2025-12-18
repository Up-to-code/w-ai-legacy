"use client";

import { useState, useEffect } from "react";
import { Eye, History, Copy, Check, Info, FileText, ChevronRight, Zap, Loader2, Calendar } from "lucide-react";
import { buildBotSystemPrompt } from "@/lib/ai/bot-utils";
import { getPromptHistory } from "../actions";
import { jsonToToon } from "../utils/toon";
import type { BotSetting, KnowledgeSource, BotPromptHistory } from "@/types/bot";

interface PromptInspectorProps {
    settings: BotSetting;
    sources: KnowledgeSource[];
}

export default function PromptInspector({ settings, sources }: PromptInspectorProps) {
    const [view, setView] = useState<'compiled' | 'history'>('compiled');
    const [format, setFormat] = useState<'text' | 'json' | 'toon'>('text');
    const [history, setHistory] = useState<BotPromptHistory[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [copied, setCopied] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        if (view === 'history') {
            fetchHistory();
        }
    }, [view]);

    async function fetchHistory() {
        setLoadingHistory(true);
        try {
            const res = await getPromptHistory();
            if (res.success && res.data) {
                setHistory(res.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingHistory(false);
        }
    }

    const knowledgeItems = sources.map(s => ({
        name: s.name,
        type: s.type,
        content: (s.content || s.fileUrl) ?? null
    }));

    const compiledPrompt = buildBotSystemPrompt(
        settings.systemPrompt,
        settings.tone,
        knowledgeItems
    );

    const fullPayload = {
        role: "system",
        model: settings.aiModel,
        provider: settings.aiProvider,
        content: compiledPrompt
    };

    const handleCopy = () => {
        let textToCopy = compiledPrompt;
        if (format === 'json') textToCopy = JSON.stringify(fullPayload, null, 2);
        if (format === 'toon') textToCopy = jsonToToon(fullPayload);

        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-gray-50/50 rounded-3xl border border-gray-100 overflow-hidden flex flex-col h-full ring-1 ring-black/5">
            {/* Header Tabs */}
            <div className="flex bg-white border-b border-gray-100 p-1.5 gap-1">
                <button
                    onClick={() => setView('compiled')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${view === 'compiled' ? 'bg-primary/5 text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'
                        }`}
                >
                    <Eye className="w-3.5 h-3.5" />
                    المعاينة النهائية
                </button>
                <button
                    onClick={() => setView('history')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${view === 'history' ? 'bg-primary/5 text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'
                        }`}
                >
                    <History className="w-3.5 h-3.5" />
                    سجل التعديلات
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {view === 'compiled' ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Info className="w-3 h-3" />
                                {format === 'text' ? 'ما يراه المساعد الذكي فعلياً' : 'حمولة الـ JSON التقنية'}
                            </h5>
                            <div className="flex items-center gap-2">
                                <div className="flex bg-gray-100 p-0.5 rounded-lg border border-gray-200 shadow-sm mr-2">
                                    <button
                                        onClick={() => setFormat('text')}
                                        className={`px-3 py-1 rounded-md text-[9px] font-bold transition-all ${format === 'text' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        Text
                                    </button>
                                    <button
                                        onClick={() => setFormat('json')}
                                        className={`px-3 py-1 rounded-md text-[9px] font-bold transition-all ${format === 'json' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        JSON
                                    </button>
                                    <button
                                        onClick={() => setFormat('toon')}
                                        className={`px-3 py-1 rounded-md text-[9px] font-bold transition-all ${format === 'toon' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        TOON
                                    </button>
                                </div>
                                <button
                                    onClick={handleCopy}
                                    className="p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-100 group"
                                    title="نسخ المطلب"
                                >
                                    {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-gray-400 group-hover:text-primary" />}
                                </button>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm min-h-[300px]">
                            <pre className={`text-xs leading-relaxed font-mono whitespace-pre-wrap break-words ${format === 'text' ? 'dir-rtl text-right text-gray-600' : 'text-blue-600'}`}>
                                {format === 'text' ? compiledPrompt : format === 'json' ? JSON.stringify(fullPayload, null, 2) : jsonToToon(fullPayload)}
                            </pre>
                        </div>

                        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 flex gap-3 items-start">
                            <Zap className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <p className="text-[11px] text-primary/80 leading-relaxed font-medium">
                                يتم تجميع هذه التعليمات آلياً عند كل محادثة، بدمج توجيهاتك (System Prompt) مع أهم المعلومات من قاعدة المعرفة.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {loadingHistory ? (
                            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                                <Loader2 className="w-8 h-8 text-primary/30 animate-spin mb-3" />
                                <p className="text-xs text-gray-400 font-bold italic">جاري جلب السجل...</p>
                            </div>
                        ) : history.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-3 opacity-60 grayscale py-10">
                                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
                                    <History className="w-6 h-6 text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500">لا يوجد سجل تعديلات حالياً</p>
                                    <p className="text-[10px] text-gray-400">سيتم حفظ نسخة تلقائياً عند تغيير التعليمات.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {history.map((item) => (
                                    <div key={item.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:border-primary/20 transition-all group">
                                        <div className="flex items-start justify-between mb-3 border-b border-gray-50 pb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 bg-primary/5 rounded-lg flex items-center justify-center">
                                                    <Calendar className="w-3.5 h-3.5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-black text-gray-900">
                                                        {new Date(item.createdAt).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </p>
                                                    <p className="text-[9px] text-gray-400 font-bold">
                                                        {new Date(item.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold">
                                                {item.changeSummary || 'تعديل تقني'}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed font-mono text-right dir-rtl">
                                            {item.prompt}
                                        </p>
                                        <div className="mt-3 pt-2 border-t border-gray-50 flex justify-end">
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(item.prompt);
                                                    setCopiedId(item.id);
                                                    setTimeout(() => setCopiedId(null), 2000);
                                                }}
                                                className={`text-[10px] font-bold flex items-center gap-1 transition-all ${copiedId === item.id ? 'text-green-500' : 'text-primary opacity-0 group-hover:opacity-100'
                                                    }`}
                                            >
                                                {copiedId === item.id ? (
                                                    <><Check className="w-3 h-3" /> تم النسخ</>
                                                ) : (
                                                    <><Copy className="w-3 h-3" /> نسخ هذه النسخة</>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// Remove Zap function since we imported it from lucide
