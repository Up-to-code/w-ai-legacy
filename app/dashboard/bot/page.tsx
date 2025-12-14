"use client";

import { Header } from "@/components/dashboard/header";
import { Bot, Settings2, Save, FileText, Database, Plus, Search, Trash2, Send, RefreshCw, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function BotPage() {
  const [activeTab, setActiveTab] = useState<'settings' | 'knowledge'>('settings');
  const [chatMessages, setChatMessages] = useState<any[]>([
      { role: 'ai', text: 'مرحباً! كيف يمكنني مساعدتك في الرد على العملاء اليوم؟' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    // User message
    const newMessages = [...chatMessages, { role: 'user', text: inputMessage }];
    setChatMessages(newMessages);
    setInputMessage('');

    // Simulate AI thinking and reply
    setTimeout(() => {
        setChatMessages(prev => [...prev, { role: 'ai', text: 'هذا مجرد رد تجريبي يحاكي الذكاء الاصطناعي. يمكن تخصيص هذا الرد بناءً على قاعدة المعرفة.' }]);
    }, 1500);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

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
            <div className="flex-1 bg-white rounded-3xl border border-gray-100 overflow-hidden">
                {activeTab === 'settings' ? (
                    <div className="p-8 h-full overflow-y-auto animate-in fade-in slide-in-from-bottom-2">
                         <div className="max-w-2xl">
                            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-primary" />
                                الشخصية والسلوك
                            </h3>
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">اسم المساعد</label>
                                    <input type="text" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-primary focus:outline-none" defaultValue="المساعد الذكي" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">نبرة الصوت</label>
                                    <div className="flex gap-4">
                                        {['رسمية', 'ودودة', 'حماسية'].map(tone => (
                                            <label key={tone} className="flex items-center gap-2 cursor-pointer bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 has-[:checked]:border-primary has-[:checked]:bg-primary/5 hover:bg-gray-100 transition-colors">
                                                <input type="radio" name="tone" className="accent-primary" defaultChecked={tone === 'ودودة'} />
                                                <span className="text-sm">{tone}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">تعليمات النظام (System Prompt)</label>
                                    <p className="text-xs text-gray-500 mb-2">اكتب التعليمات الأساسية التي يجب أن يلتزم بها البوت (مثال: أنت مساعد خدمة عملاء لشركة W-AI...)</p>
                                    <textarea 
                                        className="w-full h-40 p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-primary focus:outline-none resize-none leading-relaxed"
                                        placeholder="اكتب هنا التعليمات التي يجب أن يتبعها الذكاء الاصطناعي..."
                                        defaultValue="أنت مساعد ذكي ومفيد لشركة تقنية. يجب أن تكون ردودك قصيرة، مهذبة، وباللغة العربية. هدفك هو مساعدة المستخدمين في حل مشاكلهم التقنية."
                                    ></textarea>
                                </div>
                            </div>
                            
                            <div className="mt-8 flex justify-end">
                                <button className="bg-primary text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-primary/90 transition-transform active:scale-95">
                                    <Save className="w-4 h-4" /> حفظ التغييرات
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
                            <button className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-primary/90">
                                <Plus className="w-4 h-4" /> مصدر جديد
                            </button>
                        </div>

                        {/* Knowledge List */}
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl bg-white hover:border-gray-200 hover:shadow-sm transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">ملف الأسئلة الشائعة {i}.pdf</h4>
                                            <p className="text-xs text-gray-400 mt-1">تم التحديث: قبل يومين • 1.2 MB</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg">
                                            <Settings2 className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {/* Text Source Example */}
                            <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl bg-white hover:border-gray-200 hover:shadow-sm transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                                        <Search className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">سياسة الأسعار</h4>
                                        <p className="text-xs text-gray-400 mt-1">مصدر نصي • 400 كلمة</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg">
                                        <Settings2 className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
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
                            className="bg-primary text-white p-3 rounded-full hover:bg-primary/90 transition-transform active:scale-95 flex items-center justify-center shadow-md"
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
