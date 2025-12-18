"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useToast } from "@/lib/hooks/use-toast";
import { useConfirm } from "./use-confirm";
import {
    getBotSettings,
    updateBotSettings,
    getKnowledgeSources,
    createKnowledgeSource,
    deleteKnowledgeSource,
    resetBotSettings,
    testBotResponse
} from "../actions";
import { estimateTokens } from "@/lib/ai/bot-utils";
import type { BotSetting, KnowledgeSource } from "@/types/bot";

export function useBot() {
    const toast = useToast();
    const { confirm, dialogProps } = useConfirm();

    // UI State
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'settings' | 'knowledge' | 'wui'>('settings');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Data State
    const [settings, setSettings] = useState<BotSetting | null>(null);
    const [sources, setSources] = useState<KnowledgeSource[]>([]);
    const [saving, setSaving] = useState(false);

    // Chat Preview State
    const [chatMessages, setChatMessages] = useState<any[]>([
        { role: 'ai', text: 'مرحباً! كيف يمكنني مساعدتك في الرد على العملاء اليوم؟' }
    ]);
    const [isTyping, setIsTyping] = useState(false);

    // Token Calculation
    const totalTokens = useMemo(() => {
        let count = 0;
        count += estimateTokens(settings?.systemPrompt);
        sources.forEach(source => {
            count += estimateTokens(source.content || source.fileUrl);
        });
        return count;
    }, [settings?.systemPrompt, sources]);

    // Initial Load
    useEffect(() => {
        const loadData = async () => {
            try {
                const [settingsRes, sourcesRes] = await Promise.all([
                    getBotSettings(),
                    getKnowledgeSources({ limit: 50 })
                ]);

                if (settingsRes.success && settingsRes.data) {
                    setSettings(settingsRes.data);
                }

                if (sourcesRes.success && 'sources' in sourcesRes) {
                    setSources(sourcesRes.sources);
                }
            } catch (error) {
                console.error("Initial load error:", error);
                toast.error("فشل تحميل البيانات");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [toast]);

    // Actions
    const handleSaveSettings = useCallback(async () => {
        if (!settings) return;
        setSaving(true);
        try {
            const dataToSave = { ...settings };
            
            // Ensure metadata is a valid JSON string if it was modified
            if (typeof dataToSave.metadata === 'object' && dataToSave.metadata !== null) {
                dataToSave.metadata = JSON.stringify(dataToSave.metadata);
            }

            const result = await updateBotSettings(dataToSave);
            if (result.success) {
                toast.success("تم حفظ الإعدادات بنجاح");
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error("حدث خطأ أثناء الحفظ");
        } finally {
            setSaving(false);
        }
    }, [settings, toast]);

    const handleResetSettings = useCallback(() => {
        confirm(
            "إعادة ضبط الإعدادات",
            "هل أنت متأكد من إعادة تعيين جميع الإعدادات لقيمها الافتراضية؟ لا يمكن التراجع عن هذه الخطوة.",
            async () => {
                setSaving(true);
                try {
                    const result = await resetBotSettings();
                    if (result.success && result.data) {
                        setSettings(result.data);
                        toast.success("تمت إعادة الضبط بنجاح");
                    } else {
                        toast.error(result.error);
                    }
                } catch (error) {
                    toast.error("حدث خطأ أثناء إعادة الضبط");
                } finally {
                    setSaving(false);
                }
            }
        );
    }, [confirm, toast]);

    const handleAddSource = useCallback(async (data: { type: 'text' | 'url'; name: string; content: string }) => {
        try {
            const result = await createKnowledgeSource({
                type: data.type,
                name: data.name,
                content: data.content,
                fileUrl: data.type === 'url' ? data.content : undefined,
            });

            if (result.success && result.data) {
                setSources(prev => [result.data!, ...prev]);
                toast.success("تمت إضافة مصدر المعرفة");
            } else {
                toast.error(result.error);
            }
        } catch (e) {
            toast.error("فشل إضافة المصدر");
        }
    }, [toast]);

    const handleDeleteSource = useCallback((id: string) => {
        confirm(
            "حذف مصدر المعرفة",
            "هل أنت متأكد من حذف هذا المصدر؟ سيؤدي ذلك لتقليل دقة إجابات البوت بخصوص هذا الموضوع.",
            async () => {
                try {
                    const result = await deleteKnowledgeSource(id);
                    if (result.success) {
                        setSources(prev => prev.filter(s => s.id !== id));
                        toast.success("تم حذف المصدر");
                    } else {
                        toast.error(result.error);
                    }
                } catch (e) {
                    toast.error("فشل الحذف");
                }
            },
            "danger"
        );
    }, [confirm, toast]);

    const handleSendMessage = useCallback(async (text: string) => {
        setChatMessages(prev => [...prev, { role: 'user', text }]);
        setIsTyping(true);

        try {
            const contextHistory = chatMessages
                .filter(m => m.text !== 'مرحباً! كيف يمكنني مساعدتك في الرد على العملاء اليوم؟')
                .slice(-10);

            const result = await testBotResponse({ 
                message: text,
                history: contextHistory
            });

            if (result.success && result.data) {
                setChatMessages(prev => [...prev, { role: 'ai', text: result.data!.response }]);
            } else {
                toast.error(result.error || "فشل الحصول على رد من البوت");
                setChatMessages(prev => [...prev, { role: 'ai', text: 'عذراً، واجهت مشكلة في معالجة طلبك.' }]);
            }
        } catch (error) {
            toast.error("خطأ في الاتصال");
        } finally {
            setIsTyping(false);
        }
    }, [chatMessages, toast]);

    return {
        // State
        loading,
        activeTab,
        setActiveTab,
        isAddModalOpen,
        setIsAddModalOpen,
        settings,
        setSettings,
        sources,
        saving,
        chatMessages,
        setChatMessages,
        isTyping,
        totalTokens,
        dialogProps,

        // Handlers
        handleSaveSettings,
        handleResetSettings,
        handleAddSource,
        handleDeleteSource,
        handleSendMessage
    };
}
