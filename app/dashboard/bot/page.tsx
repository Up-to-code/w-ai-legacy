"use client";

import { Header } from "@/components/dashboard/header";
import { Bot, Settings2, Save, FileText, Database, Plus, Search, Trash2, Send, RefreshCw, Sparkles, Loader2, Link as LinkIcon, AlertCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/lib/hooks/use-toast";
import { useConfirmDialog } from "@/components/ui/confirm-dialog";
import { 
  getBotSettings, 
  updateBotSettings, 
  getKnowledgeSources, 
  createKnowledgeSource, 
  deleteKnowledgeSource,
  testBotResponse 
} from "@/app/actions/bot";
import type { BotSetting, KnowledgeSource, BotTone } from "@/types/bot";

export default function BotPage() {
  const toast = useToast();
  const { confirm } = useConfirmDialog();
  const [activeTab, setActiveTab] = useState<'settings' | 'knowledge'>('settings');
  const [loading, setLoading] = useState(true);
  
  // Settings State
  const [settings, setSettings] = useState<BotSetting | null>(null);
  const [saving, setSaving] = useState(false);
  
  // Knowledge Base State
  const [sources, setSources] = useState<KnowledgeSource[]>([]);
  const [fetchingSources, setFetchingSources] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Chat State
  const [chatMessages, setChatMessages] = useState<any[]>([
      { role: 'ai', text: 'مرحباً! كيف يمكنني مساعدتك في الرد على العملاء اليوم؟' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Load initial data
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
        
        if (sourcesRes.success && sourcesRes.data) {
          setSources(sourcesRes.data);
        }
      } catch (error) {
        toast.error("فشل جلب البيانات");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [toast]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, isTyping]);

  const handleSaveSettings = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const result = await updateBotSettings({
        name: settings.name,
        tone: settings.tone,
        systemPrompt: settings.systemPrompt,
        isActive: settings.isActive
      });
      
      if (result.success) {
        toast.success("تم تحديث الإعدادات بنجاح");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الحفظ");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSource = (id: string) => {
    confirm(
      "حذف المصدر",
      "هل أنت متأكد من حذف هذا المصدر؟ لن يتمكن البوت من استخدامه بعد الآن.",
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
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    // User message
    const userMsg = inputMessage;
    const newMessages = [...chatMessages, { role: 'user', text: userMsg }];
    setChatMessages(newMessages);
    setInputMessage('');
    setIsTyping(true);

    try {
      const result = await testBotResponse({ message: userMsg });
      if (result.success && result.data) {
        setChatMessages(prev => [...prev, { role: 'ai', text: result.data.response }]);
      } else {
        setChatMessages(prev => [...prev, { role: 'ai', text: 'عذراً، حدث خطأ في النظام.' }]);
      }
    } catch (error) {
       setChatMessages(prev => [...prev, { role: 'ai', text: 'حدث خطأ في الاتصال.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Simple Add Source Modal handler
  const handleAddSource = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const type = formData.get('type') as 'text' | 'url';
    const content = formData.get('content') as string;
    const name = formData.get('name') as string;

    if (!content || !name) return;

    try {
        const result = await createKnowledgeSource({
            type: type === 'url' ? 'url' : 'text',
            name: name,
            content: type === 'text' ? content : undefined,
            fileUrl: type === 'url' ? content : undefined, // In real app, validating URL logic needed
        });

        if (result.success && result.data) {
            setSources(prev => [result.data!, ...prev]);
            toast.success("تم إضافة المصدر");
            setIsAddModalOpen(false);
        } else {
            toast.error(result.error);
        }
    } catch (e) {
        toast.error("فشل الإضافة");
    }
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <>
      <Header />
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">إعدادات المساعد الذكي (AI)</h1>
        <p className="text-gray-500">تخصيص سلوك الرد الآلي والمعلومات التي يعتمد عليها.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-200px)]">
         {/* Main Content Column */}
         <div className="lg:col-span-2 flex flex-col space-y-6">
            
            {/* Tabs */}
            <div className="bg-white p-2 rounded-2xl border border-gray-100 flex gap-1 w-fit">
                <button 
                    onClick={() => setActiveTab('settings')}
                    className={`px-6 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 ${activeTab === 'settings' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <Settings2 className="w-4 h-4" /> الإعدادات العامة
                </button>
                <button 
                    onClick={() => setActiveTab('knowledge')}
                    className={`px-6 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 ${activeTab === 'knowledge' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <Database className="w-4 h-4" /> قاعدة المعرفة
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-white rounded-3xl border border-gray-100 overflow-hidden relative">
                {activeTab === 'settings' && settings ? (
                    <div className="p-8 h-full overflow-y-auto animate-in fade-in slide-in-from-bottom-2">
                         <div className="max-w-2xl">
                            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-primary" />
                                الشخصية والسلوك
                            </h3>
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">اسم المساعد</label>
                                    <input 
                                        type="text" 
                                        value={settings.name || ''}
                                        onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                                        className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-primary focus:outline-none" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">نبرة الصوت</label>
                                    <div className="flex gap-4">
                                        {(['formal', 'friendly', 'enthusiastic'] as BotTone[]).map(tone => (
                                            <label key={tone} className={`flex items-center gap-2 cursor-pointer bg-gray-50 px-4 py-2 rounded-lg border transition-colors ${settings.tone === tone ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-200 hover:bg-gray-100'}`}>
                                                <input 
                                                    type="radio" 
                                                    name="tone" 
                                                    className="accent-primary" 
                                                    checked={settings.tone === tone}
                                                    onChange={() => setSettings({ ...settings, tone })}
                                                />
                                                <span className="text-sm">
                                                    {tone === 'formal' ? 'رسمية' : tone === 'friendly' ? 'ودودة' : 'حماسية'}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">تعليمات النظام (System Prompt)</label>
                                    <p className="text-xs text-gray-500 mb-2">اكتب التعليمات الأساسية التي يجب أن يلتزم بها البوت (مثال: أنت مساعد خدمة عملاء لشركة W-AI...)</p>
                                    <textarea 
                                        value={settings.systemPrompt || ''}
                                        onChange={(e) => setSettings({ ...settings, systemPrompt: e.target.value })}
                                        className="w-full h-40 p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-primary focus:outline-none resize-none leading-relaxed"
                                        placeholder="اكتب هنا التعليمات التي يجب أن يتبعها الذكاء الاصطناعي..."
                                    ></textarea>
                                </div>
                            </div>
                            
                            <div className="mt-8 flex justify-end">
                                <button 
                                    onClick={handleSaveSettings}
                                    disabled={saving}
                                    className="bg-primary text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-primary/90 transition-transform active:scale-95 disabled:opacity-70"
                                >
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
                                    حفظ التغييرات
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-8 h-full overflow-y-auto animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <Database className="w-5 h-5 text-primary" />
                                    مصادر البيانات
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">أضف ملفات أو نصوص لتدريب المساعد عليها.</p>
                            </div>
                            <button 
                                onClick={() => setIsAddModalOpen(true)}
                                className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-primary/90"
                            >
                                <Plus className="w-4 h-4" /> مصدر جديد
                            </button>
                        </div>

                        {/* Knowledge List */}
                        <div className="space-y-4">
                            {sources.length === 0 ? (
                                <div className="text-center py-10 text-gray-500">
                                    <Database className="w-10 h-10 mx-auto mb-3 opacity-20" />
                                    <p>لا توجد مصادر معرفة حتى الآن.</p>
                                </div>
                            ) : (
                                sources.map((source) => (
                                    <div key={source.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl bg-white hover:border-gray-200 hover:shadow-sm transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${source.type === 'file' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                                                {source.type === 'file' ? <FileText className="w-6 h-6" /> : source.type === 'url' ? <LinkIcon className="w-6 h-6" /> : <Search className="w-6 h-6" />}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">{source.name}</h4>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {source.type === 'text' ? 'نص مخصص' : source.type === 'url' ? 'رابط خارجي' : 'ملف مرفق'} • {new Date(source.createdAt).toLocaleDateString('ar-EG')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => handleDeleteSource(source.id)}
                                                className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
                
                {/* Add Source Modal (Simplified Overlay) */}
                {isAddModalOpen && (
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                        <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
                            <h3 className="font-bold text-lg mb-4">إضافة مصدر معرفة</h3>
                            <form onSubmit={handleAddSource} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">نوع المصدر</label>
                                    <select name="type" className="w-full p-2 bg-gray-50 rounded-xl border border-gray-200">
                                        <option value="text">نص مخصص</option>
                                        <option value="url">رابط (URL)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">اسم المصدر</label>
                                    <input name="name" required placeholder="مثال: سياسة الاسترجاع" className="w-full p-2 bg-gray-50 rounded-xl border border-gray-200" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">المحتوى / الرابط</label>
                                    <textarea name="content" required placeholder="اكتب النص أو الرابط هنا..." className="w-full h-32 p-2 bg-gray-50 rounded-xl border border-gray-200 resize-none"></textarea>
                                </div>
                                <div className="flex gap-2 justify-end pt-2">
                                    <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-xl">إلغاء</button>
                                    <button type="submit" className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90">إضافة</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
         </div>

         {/* Preview Column */}
         <div className="lg:col-span-1 flex flex-col h-full">
             <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden flex flex-col h-full shadow-lg shadow-gray-100/50">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <h3 className="font-bold text-sm">محاكاة المحادثة</h3>
                    </div>
                    <button 
                        onClick={() => setChatMessages([])} 
                        className="text-xs text-gray-500 hover:text-primary flex items-center gap-1"
                    >
                        <RefreshCw className="w-3 h-3" /> إعادة ضبط
                    </button>
                </div>
                
                {/* Chat Area */}
                <div 
                    ref={chatContainerRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat"
                >
                    {chatMessages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
                            <Bot className="w-8 h-8 mb-2 opacity-50" />
                            <p>ابدأ المحادثة للتجربة...</p>
                        </div>
                    )}

                    {chatMessages.map((msg, idx) => (
                        <div key={idx} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            {msg.role === 'ai' && (
                                <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm mt-1">
                                    <Bot className="w-3 h-3 text-primary" />
                                </div>
                            )}
                            <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${msg.role === 'user' ? 'bg-[#dcf8c6] text-gray-900 rounded-tr-none' : 'bg-white text-gray-900 rounded-tl-none'}`}>
                                <p>{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex gap-2">
                             <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm mt-1">
                                <Bot className="w-3 h-3 text-primary" />
                            </div>
                            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Input Area */}
                <div className="p-3 bg-gray-50 border-t border-gray-100">
                    <div className="relative flex items-center gap-2">
                        <input 
                            type="text" 
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="اكتب رسالة..." 
                            className="flex-1 p-3 bg-white rounded-full border border-gray-200 focus:outline-none focus:border-primary text-sm shadow-sm"
                        />
                        <button 
                            onClick={handleSendMessage}
                            disabled={!inputMessage.trim()}
                            className="bg-primary text-white p-3 rounded-full hover:bg-primary/90 transition-transform active:scale-95 flex items-center justify-center shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-4 h-4 ml-0.5" />
                        </button>
                    </div>
                </div>
             </div>
         </div>
      </div>
    </>
  );
}
