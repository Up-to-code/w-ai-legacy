"use client";

import { Bot, Clock, Calendar, MessageSquare } from "lucide-react";
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

    const updateBusinessHours = (updates: Partial<NonNullable<WhatsAppAIConfig['businessHours']>>) => {
        onChange({
            ...config,
            businessHours: { ...config.businessHours!, ...updates }
        });
    };

    const toggleDay = (day: number) => {
        const currentDays = config.businessHours?.days || [];
        const newDays = currentDays.includes(day)
            ? currentDays.filter(d => d !== day)
            : [...currentDays, day].sort();

        updateBusinessHours({ days: newDays });
    };

    const weekDays = [
        { id: 0, label: 'أحد' },
        { id: 1, label: 'اثنين' },
        { id: 2, label: 'ثلاثاء' },
        { id: 3, label: 'أربعاء' },
        { id: 4, label: 'خميس' },
        { id: 5, label: 'جمعة' },
        { id: 6, label: 'سبت' }
    ];

    return (
        <div className="space-y-6">
            {/* AI Toggle */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                            <Bot className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h4 className="text-lg font-black text-gray-900">الرد التلقائي بالذكاء الاصطناعي</h4>
                            <p className="text-xs text-gray-500 font-medium mt-1">استخدم البوت للرد على رسائل WhatsApp تلقائياً</p>
                        </div>
                    </div>
                    <div
                        onClick={() => !loading && updateConfig({ enabled: !config.enabled })}
                        className={`w-14 h-7 rounded-full relative transition-all duration-300 ${loading ? 'cursor-wait opacity-50' : 'cursor-pointer'
                            } ${config.enabled ? 'bg-primary' : 'bg-gray-200'}`}
                    >
                        <div
                            className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 ${config.enabled ? 'right-1' : 'right-8'
                                } ${loading ? 'animate-pulse' : ''}`}
                        />
                    </div>
                </div>

                {/* Detailed settings removed as per user request */}
            </div>
        </div>
    );
}
