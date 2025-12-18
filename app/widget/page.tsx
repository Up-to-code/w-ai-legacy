"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Bot, Send, Loader2, CheckCheck, Smile, Paperclip, Mic, RefreshCw } from "lucide-react";

/**
 * Chat Message Type
 */
interface Message {
    role: 'user' | 'ai';
    text: string;
}

function WidgetContent() {
    const searchParams = useSearchParams();
    const botId = searchParams.get("botId");

    // UI State
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [config, setConfig] = useState<any>({
        primaryColor: "#105D3B",
        title: "المساعد الذكي",
        welcomeMessage: "مرحباً! كيف يمكنني مساعدتك اليوم؟",
        position: "rtl"
    });

    const scrollRef = useRef<HTMLDivElement>(null);

    // Fetch Config on Mount
    useEffect(() => {
        if (!botId) return;

        const fetchConfig = async () => {
            try {
                const res = await fetch(`/api/widget/config?botId=${botId}`);
                if (res.ok) {
                    const data = await res.json();

                    setConfig((prev: any) => ({
                        ...prev,
                        // Use DB name if available, otherwise keep default
                        title: data.name || prev.title,
                        // Merge WUI settings
                        primaryColor: data.wui?.primaryColor || prev.primaryColor,
                        welcomeMessage: data.wui?.welcomeMessage || prev.welcomeMessage,
                        position: data.wui?.position || prev.position,
                    }));

                    // URL Params override DB settings (useful for testing override)
                    const urlColor = searchParams.get("color");
                    if (urlColor) {
                        setConfig((prev: any) => ({ ...prev, primaryColor: decodeURIComponent(urlColor) }));
                    }
                }
            } catch (error) {
                console.error("Failed to fetch widget config:", error);
            }
        };

        fetchConfig();
    }, [botId, searchParams]);

    // Scroll to bottom on message
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isTyping || !botId) return;

        const userText = input;
        setInput("");
        setMessages(prev => [...prev, { role: 'user', text: userText }]);
        setIsTyping(true);

        try {
            const response = await fetch("/api/chat/stream", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    botId,
                    message: userText,
                    history: messages.slice(-10),
                    referer: document.referrer // Pass embedding page URL for domain validation
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || "API Error");
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let aiText = "";

            setMessages(prev => [...prev, { role: 'ai', text: "" }]);

            while (true) {
                const { done, value } = await reader!.read();
                if (done) break;

                const chunk = decoder.decode(value);
                aiText += chunk;

                setMessages(prev => {
                    const last = prev[prev.length - 1];
                    const rest = prev.slice(0, -1);
                    return [...rest, { role: 'ai', text: aiText }];
                });
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: 'ai', text: "عذراً، حدث خطأ في الاتصال." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-[#E5DDD5] select-none text-right font-sans" dir="rtl">
            {/* Header */}
            <div
                className="px-4 py-3 border-b border-black/5 flex items-center justify-between shadow-sm sticky top-0 z-20"
                style={{ backgroundColor: config.primaryColor }}
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/10">
                        <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-[14px] text-white leading-none">{config.title}</h3>
                        <p className="text-[10px] text-white/70 mt-1 font-medium">متصل الآن</p>
                    </div>
                </div>
                <button
                    onClick={() => setMessages([])}
                    className="p-2 hover:bg-white/10 rounded-full transition-all text-white/70 hover:text-white"
                >
                    <RefreshCw className="w-4 h-4" />
                </button>
            </div>

            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-3 relative scroll-smooth"
                style={{
                    backgroundImage: `url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")`,
                    backgroundSize: '400px',
                }}
            >
                {messages.length === 0 && (
                    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-black/5 mx-4 mt-4 animate-in fade-in slide-in-from-top-2">
                        <p className="text-[13px] text-gray-700 font-medium leading-relaxed">
                            {config.welcomeMessage}
                        </p>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                        <div className={`relative max-w-[85%] px-3.5 py-2 rounded-2xl text-[14px] shadow-sm animate-in fade-in slide-in-from-bottom-1 ${msg.role === 'user'
                            ? 'bg-[#105D3B] text-white rounded-tr-none'
                            : 'bg-white text-gray-800 rounded-tl-none'
                            }`} style={msg.role === 'user' ? { backgroundColor: config.primaryColor } : {}}>
                            <p className="font-medium whitespace-pre-wrap">{msg.text}</p>
                            <div className={`flex items-center gap-1 mt-1 justify-end ${msg.role === 'user' ? 'text-white/60' : 'text-gray-300'}`}>
                                <span className="text-[9px] font-bold">
                                    {new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                {msg.role === 'user' && <CheckCheck className="w-3 h-3" />}
                            </div>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex justify-end animate-in fade-in slide-in-from-left-2">
                        <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5 border border-gray-100">
                            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-3 bg-[#F0F2F5] flex items-center gap-2 border-t border-black/5">
                <button type="button" className="p-2 text-gray-500 hover:bg-black/5 rounded-full"><Smile className="w-6 h-6" /></button>
                <form onSubmit={handleSendMessage} className="flex-1 flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="اكتب رسالة..."
                        className="flex-1 px-4 py-2 bg-white rounded-full border-none focus:outline-none text-[15px] shadow-sm"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isTyping}
                        className="p-2.5 rounded-full text-white shadow-md transition-all active:scale-90 disabled:bg-gray-400"
                        style={{ backgroundColor: config.primaryColor }}
                    >
                        {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 rotate-[-135deg]" />}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function WidgetPage() {
    return (
        <Suspense fallback={<div className="h-screen flex items-center justify-center bg-gray-50"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
            <WidgetContent />
        </Suspense>
    );
}
