"use client";

import { X, Globe, Type, Plus, Info, Loader2 } from "lucide-react";
import { useState } from "react";

interface AddSourceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (data: { type: 'text' | 'url'; name: string; content: string }) => Promise<void>;
}

export default function AddSourceModal({ isOpen, onClose, onAdd }: AddSourceModalProps) {
    const [type, setType] = useState<'text' | 'url'>('text');
    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !content || loading) return;

        setLoading(true);
        try {
            await onAdd({ type, name, content });
            setName('');
            setContent('');
            onClose();
        } catch (error) {
            // Error handling handled by parent
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-2xl text-gray-900 leading-tight">إضافة معرفة جديدة</h3>
                        <p className="text-gray-400 text-sm mt-1">اختر نوع المصدر لتزويد البوت بالمعلومات.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-all"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Source Type Toggle */}
                    <div className="flex p-1.5 bg-gray-50 rounded-2xl border border-gray-100">
                        <button
                            type="button"
                            onClick={() => setType('text')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${type === 'text'
                                    ? 'bg-white text-primary shadow-sm border border-gray-100'
                                    : 'text-gray-500 hover:bg-white/50'
                                }`}
                        >
                            <Type className={`w-4 h-4 ${type === 'text' ? 'text-primary' : 'text-gray-400'}`} />
                            نص مخصص
                        </button>
                        <button
                            type="button"
                            onClick={() => setType('url')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${type === 'url'
                                    ? 'bg-white text-primary shadow-sm border border-gray-100'
                                    : 'text-gray-500 hover:bg-white/50'
                                }`}
                        >
                            <Globe className={`w-4 h-4 ${type === 'url' ? 'text-primary' : 'text-gray-400'}`} />
                            رابط موقع (URL)
                        </button>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-700 mx-1">اسم المصدر</label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder={type === 'text' ? "مثال: سياسة الشحن" : "مثال: صفحة الأسئلة الشائعة"}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-700 mx-1">
                                {type === 'text' ? "المحتوى النصي" : "الرابط الكامل"}
                            </label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                placeholder={type === 'text' ? "اكتب المعلومات التي تريد تزويد البوت بها هنا..." : "https://example.com/faq"}
                                className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm resize-none ${type === 'text' ? 'h-40' : 'h-14'}`}
                            />
                        </div>
                    </div>

                    <div className="p-4 bg-amber-50 rounded-2xl flex gap-3 border border-amber-100">
                        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-amber-700 leading-relaxed">
                            {type === 'text'
                                ? "تأكد من كتابة معلومات دقيقة وواضحة. البوت سيستخدم هذا النص حرفياً للإجابة على المستخدم."
                                : "سيحاول النظام تحليل محتوى الرابط واستخراج المعلومات المفيدة منه لتدريب المساعد."}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3.5 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all active:scale-95"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] py-3.5 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20 disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Plus className="w-5 h-5" />
                            )}
                            إضافة المصدر
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
