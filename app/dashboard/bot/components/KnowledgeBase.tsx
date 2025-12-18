"use client";

import { Database, Plus, Search, FileText, Link as LinkIcon, Trash2, Loader2, Info, Cpu, Code } from "lucide-react";
import { useState } from "react";
import type { KnowledgeSource } from "@/types/bot";

interface KnowledgeBaseProps {
    sources: KnowledgeSource[];
    onDelete: (id: string) => void;
    onAdd: () => void;
}

export default function KnowledgeBase({ sources, onDelete, onAdd }: KnowledgeBaseProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredSources = sources.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-8 h-full overflow-y-auto animate-in fade-in slide-in-from-bottom-2 flex flex-col">
            <div className="flex justify-end mb-8">
                <button
                    onClick={onAdd}
                    className="bg-primary text-white px-8 py-3.5 rounded-2xl text-sm font-black flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95 shrink-0"
                >
                    <Plus className="w-4 h-4" /> إضافة مصدر جديد
                </button>
            </div>

            {/* Stats & Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1 group">
                    <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="البحث في المصادر..."
                        className="w-full pr-12 pl-6 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-primary/30 focus:ring-8 focus:ring-primary/5 transition-all text-sm font-medium"
                    />
                </div>
                <div className="flex items-center gap-2 px-5 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl text-xs font-bold text-gray-400">
                    <Info className="w-4 h-4 text-primary/40" />
                    لديك <span className="text-primary font-black mx-1">{sources.length}</span> مصدر مفعل
                </div>
            </div>

            {/* Knowledge List */}
            <div className="flex-1 space-y-4">
                {filteredSources.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-gray-100 rounded-[2.5rem] bg-gray-50/20">
                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-6">
                            <Database className="w-10 h-10 text-gray-100" />
                        </div>
                        <h4 className="font-bold text-gray-400 text-lg">لا توجد مصادر</h4>
                        <p className="text-xs text-gray-300 max-w-xs mt-2 font-medium">
                            {searchQuery ? "حاول استخدام كلمات بحث أخرى" : "ابدأ بإضافة أول مصدر معرفة لتدريب المساعد الخاص بك"}
                        </p>
                    </div>
                ) : (
                    filteredSources.map((source) => (
                        <div key={source.id} className="flex items-center justify-between p-5 border border-gray-100 rounded-[1.75rem] bg-white hover:border-primary/20 hover:shadow-xl hover:shadow-gray-200/40 transition-all group relative overflow-hidden">
                            <div className="flex items-center gap-5 relative z-10">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-sm ${source.type === 'file' ? 'bg-blue-50/50 text-blue-500 border-blue-100' :
                                    source.type === 'url' ? 'bg-emerald-50/50 text-emerald-500 border-emerald-100' :
                                        'bg-amber-50/50 text-amber-500 border-amber-100'
                                    }`}>
                                    {source.type === 'file' ? <FileText className="w-7 h-7" /> :
                                        source.type === 'url' ? <LinkIcon className="w-7 h-7" /> :
                                            <FileText className="w-7 h-7" />}
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-gray-900 group-hover:text-primary transition-colors text-base">{source.name}</h4>
                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-wider">
                                        <span className={`${source.type === 'file' ? 'text-blue-500' :
                                            source.type === 'url' ? 'text-emerald-500' :
                                                'text-amber-500'
                                            }`}>
                                            {source.type === 'text' ? 'محتوى نصي' : source.type === 'url' ? 'رابط ويب' : 'ملف مرفق'}
                                        </span>
                                        <span className="text-gray-200">•</span>
                                        <span className="text-gray-400">نشط وجاهز للاستخدام</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 relative z-10 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                <button
                                    onClick={() => onDelete(source.id)}
                                    className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                                    title="حذف المصدر"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="mt-8 p-6 bg-gray-50/80 rounded-[2rem] border border-gray-100 flex gap-4">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                    <Info className="w-5 h-5 text-primary" />
                </div>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                    <strong className="text-gray-900 block mb-0.5">كيف تعمل قاعدة المعرفة؟</strong>
                    يقوم المساعد بقراءة هذه المصادر واستخراج الإجابات منها بدقة عالية عندما يسأله العميل. كلما كانت مصادرك منظمة وواضحة، كانت إجابات المساعد أكثر ذكاءً.
                </p>
            </div>
        </div>
    );
}
