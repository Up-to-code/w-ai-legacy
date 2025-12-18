"use client";

import { Settings2, Database, Bot, Loader2 } from "lucide-react";
import { useBot } from "./hooks/use-bot";

// Components
import BotSettings from "./components/BotSettings";
import KnowledgeBase from "./components/KnowledgeBase";
import ChatPreview from "./components/ChatPreview";
import WUISettings from "./components/WUISettings";
import AddSourceModal from "./components/AddSourceModal";
import { ConfirmDialog } from "./components/ConfirmDialog";

export default function BotPage() {
    const {
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
        handleSaveSettings,
        handleResetSettings,
        handleAddSource,
        handleDeleteSource,
        handleSendMessage,
        dialogProps
    } = useBot();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] animate-pulse">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                    <Bot className="w-8 h-8 text-primary/40" />
                </div>
                <p className="text-gray-400 text-sm font-medium">جاري تهيئة المساعد الذكي...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-140px)]" dir="rtl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 overflow-hidden min-h-0">
                {/* Unified Control Center */}
                <div className="lg:col-span-8 bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-200/40 overflow-hidden flex flex-col relative">

                    {/* Header with Navigation - Pure Minimalist */}
                    <div className="px-10 py-12 border-b border-gray-50 flex flex-col gap-10 shrink-0 bg-white/80 backdrop-blur-md sticky top-0 z-20">
                        {/* Bot Name & Identity */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-none select-none">
                                    {settings?.name || 'nana'}
                                </h1>
                                <div className="w-16 h-16 bg-gray-50 rounded-[1.5rem] flex items-center justify-center border border-gray-100 shadow-sm relative group overflow-hidden">
                                    <Bot className="w-9 h-9 text-gray-800" />
                                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>

                            {/* Status Switchers */}
                            <div className="flex items-center gap-1 p-1 bg-gray-50 rounded-[1.25rem] border border-gray-100">
                                <button
                                    onClick={() => setSettings(settings ? { ...settings, isActive: true } : null)}
                                    className={`px-5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${settings?.isActive ? 'bg-white text-[#105D3B] shadow-sm ring-1 ring-black/5' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    مفعل
                                </button>
                                <button
                                    onClick={() => setSettings(settings ? { ...settings, isActive: false } : null)}
                                    className={`px-5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!settings?.isActive ? 'bg-white text-red-500 shadow-sm ring-1 ring-black/5' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    معطل
                                </button>
                            </div>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="flex items-center justify-center gap-2">
                            <div className="flex items-center gap-1.5 p-1.5 bg-gray-50/80 rounded-[1.5rem] border border-gray-100 w-fit">
                                <button
                                    onClick={() => setActiveTab('settings')}
                                    className={`px-8 py-2.5 rounded-[1.15rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'settings'
                                        ? 'bg-white text-primary shadow-sm ring-1 ring-black/5'
                                        : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    الدماغ (Brain)
                                </button>
                                <button
                                    onClick={() => setActiveTab('knowledge')}
                                    className={`px-8 py-2.5 rounded-[1.15rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'knowledge'
                                        ? 'bg-white text-primary shadow-sm ring-1 ring-black/5'
                                        : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    المعرفة (Context)
                                </button>
                                <button
                                    onClick={() => setActiveTab('wui')}
                                    className={`px-8 py-2.5 rounded-[1.15rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'wui'
                                        ? 'bg-white text-primary shadow-sm ring-1 ring-black/5'
                                        : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    الويب (WUI)
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-hidden relative">
                        {activeTab === 'settings' ? (
                            settings ? (
                                <BotSettings
                                    settings={settings}
                                    setSettings={setSettings}
                                    onSave={handleSaveSettings}
                                    onReset={handleResetSettings}
                                    saving={saving}
                                    tokens={totalTokens}
                                    sources={sources}
                                />
                            ) : (
                                <div className="flex-1 h-full flex flex-col items-center justify-center p-20">
                                    <Loader2 className="w-12 h-12 text-primary/20 animate-spin mb-4" />
                                    <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Initialising neural link...</p>
                                </div>
                            )
                        ) : activeTab === 'knowledge' ? (
                            <KnowledgeBase
                                sources={sources}
                                onDelete={handleDeleteSource}
                                onAdd={() => setIsAddModalOpen(true)}
                            />
                        ) : (
                            settings && (
                                <WUISettings
                                    settings={settings}
                                    setSettings={setSettings}
                                    onSave={handleSaveSettings}
                                    saving={saving}
                                />
                            )
                        )}
                    </div>
                </div>

                {/* Preview Area */}
                <div className="lg:col-span-4 h-full">
                    <ChatPreview
                        messages={chatMessages}
                        onSendMessage={handleSendMessage}
                        onReset={() => setChatMessages([])}
                        isTyping={isTyping}
                        botName={settings?.name}
                    />
                </div>
            </div>

            {/* Modals */}
            <AddSourceModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddSource}
            />

            <ConfirmDialog {...dialogProps} />
        </div>
    );
}
