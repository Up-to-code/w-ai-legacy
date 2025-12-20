"use client";

import { Bot, Zap, CheckCircle2 } from "lucide-react";
import { WhatsAppAIConfig } from "../types";

interface AISettingsProps {
    config: WhatsAppAIConfig;
    onChange: (config: WhatsAppAIConfig) => void;
    loading?: boolean;
}

export default function AISettings({ config, onChange, loading = false }: AISettingsProps) {
    const updateConfig = (updates: Partial<WhatsAppAIConfig>) => {
        onChange({ ...config, ...updates });
    };

    return (
        <div className="space-y-6">
            {/* AI Toggle */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${config.enabled
                                ? 'bg-primary/10 ring-2 ring-primary/20'
                                : 'bg-gray-100'
                            }`}>
                            <Bot className={`w-6 h-6 transition-colors ${config.enabled ? 'text-primary' : 'text-gray-400'
                                }`} />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-lg font-black text-gray-900">الرد التلقائي بالذكاء الاصطناعي</h4>
                            <p className="text-xs text-gray-500 font-medium mt-1">
                                استخدم البوت للرد على رسائل WhatsApp تلقائياً
                            </p>
                        </div>
                    </div>

                    {/* Toggle Switch */}
                    <div
                        onClick={() => !loading && updateConfig({ enabled: !config.enabled })}
                        className={`w-14 h-7 rounded-full relative transition-all duration-300 ${loading ? 'cursor-wait opacity-50' : 'cursor-pointer hover:shadow-lg'
                            } ${config.enabled ? 'bg-primary' : 'bg-gray-200'}`}
                    >
                        <div
                            className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-md ${config.enabled ? 'right-1' : 'right-8'
                                } ${loading ? 'animate-pulse' : ''}`}
                        />
                    </div>
                </div>

                {/* Status Indicator */}
                <div className={`mt-6 pt-6 border-t border-gray-100 transition-all duration-300 ${config.enabled ? 'opacity-100' : 'opacity-0 h-0 pt-0 mt-0 border-0'
                    }`}>
                    {config.enabled && (
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Zap className="w-4 h-4 text-green-600" />
                                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping" />
                                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
                                </div>
                                <span className="text-xs font-bold text-green-700">نشط الآن</span>
                            </div>

                            <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-green-50 rounded-xl border border-green-100">
                                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                                <p className="text-xs text-green-700 font-medium">
                                    {loading ? "جاري الحفظ..." : "البوت يستقبل الرسائل ويرد تلقائياً"}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
