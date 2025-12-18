"use client";

import { Bot, RefreshCw, Send, Loader2, MoreHorizontal, CheckCheck, Smile, Paperclip, Mic } from "lucide-react";
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
    botName?: string;
}

export default function ChatPreview({ messages, onSendMessage, onReset, isTyping, botName = "المساعد الذكي" }: ChatPreviewProps) {
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
        <div className="bg-[#E5DDD5] rounded-[2.5rem] border border-gray-100 overflow-hidden flex flex-col h-full shadow-2xl shadow-primary/5 select-none relative" dir="rtl">
            {/* Header - Fixed like WhatsApp */}
            <div className="px-6 py-4 border-b border-black/5 flex items-center justify-between bg-[#F0F2F5] sticky top-0 z-20">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-11 h-11 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden border border-black/5">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <div className="absolute bottom-0 left-0 w-3 h-3 bg-[#25D366] border-2 border-[#F0F2F5] rounded-full"></div>
                    </div>
                    <div>
                        <h3 className="font-bold text-[15px] text-gray-800 tracking-tight">{botName}</h3>
                        <p className="text-[11px] text-gray-500 font-medium">متصل الآن</p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={onReset}
                        className="text-gray-500 hover:text-primary p-2 rounded-full hover:bg-black/5 transition-all group"
                        title="تفريغ المحادثة"
                    >
                        <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                    </button>
                    <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-black/5 transition-all">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Chat Area - WhatsApp Background Pattern */}
            <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-6 space-y-4 relative scroll-smooth selection:bg-primary/10 custom-scrollbar"
                style={{
                    backgroundImage: `url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")`,
                    backgroundSize: '400px',
                    backgroundColor: '#E5DDD5'
                }}
            >
                {/* Date Separator */}
                <div className="flex justify-center my-4">
                    <span className="bg-[#D9FDD3]/80 backdrop-blur-sm px-4 py-1.5 rounded-xl text-[11px] font-bold text-gray-600 shadow-sm border border-black/5">
                        اليوم
                    </span>
                </div>

                {messages.length === 0 && !isTyping && (
                    <div className="flex flex-col items-center justify-center mt-20 text-center px-10 opacity-30">
                        <Bot className="w-16 h-16 text-gray-400 mb-4" />
                        <p className="text-sm font-bold text-gray-600">أرسل رسالة لبدء المحادثة</p>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex mb-2 ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
                    >
                        <div className={`relative max-w-[85%] px-4 py-2.5 rounded-2xl text-[14px] shadow-sm ${msg.role === 'user'
                            ? 'bg-[#105D3B] text-white rounded-tr-none'
                            : 'bg-white text-gray-800 rounded-tl-none'
                            }`}>

                            {/* Message Text */}
                            <p className="font-medium leading-relaxed">{msg.text}</p>

                            {/* Metadata Footer */}
                            <div className={`flex items-center gap-1 mt-1 justify-end ${msg.role === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                                <span className="text-[10px] font-medium">
                                    {new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                {msg.role === 'user' && <CheckCheck className="w-3.5 h-3.5" />}
                            </div>

                            {/* Tail SVG - Refined for WhatsApp look */}
                            <div className={`absolute top-0 w-3 h-3 ${msg.role === 'user' ? '-right-2.5' : '-left-2.5'}`}>
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    {msg.role === 'user' ? (
                                        <path d="M0 0H12V12L0 0Z" fill="#105D3B" />
                                    ) : (
                                        <path d="M12 0H0V12L12 0Z" fill="white" />
                                    )}
                                </svg>
                            </div>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex justify-end mb-4 animate-in fade-in slide-in-from-left-2 transition-all">
                        <div className="bg-white px-5 py-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5 border border-gray-100 relative">
                            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                            {/* Tail for typing indicator */}
                            <div className="absolute top-0 -left-2.5 w-3 h-3">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 0H0V12L12 0Z" fill="white" />
                                </svg>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area - WhatsApp Design */}
            <div className="px-4 py-3 bg-[#F0F2F5] flex items-center gap-2">
                <div className="flex items-center gap-2 text-gray-500">
                    <button type="button" className="p-2 hover:bg-black/5 rounded-full transition-all">
                        <Smile className="w-6 h-6" />
                    </button>
                    <button type="button" className="p-2 hover:bg-black/5 rounded-full transition-all">
                        <Paperclip className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="اكتب رسالة..."
                        disabled={isTyping}
                        className="flex-1 px-4 py-2.5 bg-white rounded-full border-none focus:outline-none text-[15px] shadow-sm disabled:opacity-50"
                    />

                    <button
                        type="submit"
                        disabled={isTyping}
                        className={`p-3 rounded-full transition-all active:scale-90 flex items-center justify-center shadow-md ${isTyping || !inputRef.current?.value ? 'bg-gray-400' : 'bg-[#105D3B]'}`}
                    >
                        {isTyping ? (
                            <Loader2 className="w-5 h-5 animate-spin text-white" />
                        ) : (
                            <Send className="w-5 h-5 rotate-[-135deg] text-white" />
                        )}
                    </button>
                </form>

                <button type="button" className="p-2 text-gray-500 hover:bg-black/5 rounded-full transition-all">
                    <Mic className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}
