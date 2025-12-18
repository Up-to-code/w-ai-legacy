"use client";

import { Bot, RefreshCw, Send, Loader2 } from "lucide-react";
import { useRef, useEffect } from "react";

interface ChatMessage {
    role: 'user' | 'ai';
    text: string;
}

interface ChatPreviewProps {
    messages: ChatMessage[];
    onSendMessage: (text: string) => void;
    onReset: () => void;
    isTyping: boolean;
}

export default function ChatPreview({ messages, onSendMessage, onReset, isTyping }: ChatPreviewProps) {
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Scroll to bottom
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        const text = inputRef.current?.value || "";
        if (!text.trim() || isTyping) return;

        onSendMessage(text);
        if (inputRef.current) inputRef.current.value = "";
    };

    return (
        <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden flex flex-col h-full shadow-2xl shadow-primary/5">
            {/* Header */}
            <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-20">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <Bot className="w-5 h-5 text-primary" />
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                        <h3 className="font-bold text-sm text-gray-900">محاكاة المحادثة</h3>
                        <p className="text-[10px] text-green-600 font-medium">نشط الآن</p>
                    </div>
                </div>
                <button
                    onClick={onReset}
                    className="text-gray-400 hover:text-primary p-2 rounded-xl hover:bg-primary/5 transition-all group"
                    title="تفريغ المحادثة"
                >
                    <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                </button>
            </div>

            {/* Chat Area */}
            <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#f8f9fa] relative scroll-smooth selection:bg-primary/10"
                style={{
                    backgroundImage: `url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")`,
                    backgroundSize: '400px',
                    backgroundRepeat: 'repeat'
                }}
            >
                {messages.length === 0 && !isTyping && (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-in fade-in zoom-in duration-500">
                        <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-4">
                            <Bot className="w-8 h-8 text-gray-200" />
                        </div>
                        <h4 className="font-bold text-gray-400 text-sm">ابدأ تجربة المساعد</h4>
                        <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                            أرسل رسالة لاختبار ردود البوت بناءً على الإعدادات والمعلومات الحالية.
                        </p>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex gap-3 animate-in fade-in slide-in-from-bottom-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        {msg.role === 'ai' && (
                            <div className="w-8 h-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm self-end mb-1">
                                <Bot className="w-4 h-4 text-primary" />
                            </div>
                        )}
                        <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm relative ${msg.role === 'user'
                                ? 'bg-primary text-white rounded-br-none'
                                : 'bg-white text-gray-800 rounded-bl-none border border-gray-50'
                            }`}>
                            {msg.text}
                            <span className={`absolute bottom-1 ${msg.role === 'user' ? 'left-2 text-white/50' : 'right-2 text-gray-300'} text-[9px]`}>
                                {new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex gap-3 animate-pulse">
                        <div className="w-8 h-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm self-end mb-1">
                            <Bot className="w-4 h-4 text-primary" />
                        </div>
                        <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1.5 border border-gray-50">
                            <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-50">
                <form onSubmit={handleSubmit} className="relative flex items-center gap-3">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="اسأل المساعد شيئاً..."
                        disabled={isTyping}
                        className="flex-1 pr-5 pl-12 py-3.5 bg-gray-50/50 rounded-2xl border border-gray-100 focus:outline-none focus:border-primary/30 focus:bg-white text-sm transition-all disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={isTyping}
                        className="absolute left-1.5 p-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all active:scale-90 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:active:scale-100"
                    >
                        {isTyping ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Send className="w-4 h-4 -rotate-45 ml-0.5" />}
                    </button>
                </form>
                <p className="text-[10px] text-gray-300 text-center mt-3">
                    هذه ميزة تجريبية للتحقق من دقة الردود قبل التفعيل للعملاء.
                </p>
            </div>
        </div>
    );
}
