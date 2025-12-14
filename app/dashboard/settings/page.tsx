"use client";

import { Header } from "@/components/dashboard/header";
import { User, Bell, Lock, Globe, Save, MessageSquare, Smartphone, Mail, Shield, Key, Eye, ChevronLeft, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'integrations'>('profile');

  return (
    <>
      <Header />
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">الإعدادات</h1>
        <p className="text-gray-500">إدارة الملف الشخصي وإعدادات الحساب.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Sidebar / Tabs */}
        <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-gray-100 p-4 space-y-1">
                <TabButton 
                    active={activeTab === 'profile'} 
                    onClick={() => setActiveTab('profile')} 
                    icon={User} 
                    label="الملف الشخصي" 
                />
                <TabButton 
                    active={activeTab === 'notifications'} 
                    onClick={() => setActiveTab('notifications')} 
                    icon={Bell} 
                    label="الإشعارات" 
                />
                 <TabButton 
                    active={activeTab === 'security'} 
                    onClick={() => setActiveTab('security')} 
                    icon={Lock} 
                    label="الأمان" 
                />
                 <TabButton 
                    active={activeTab === 'integrations'} 
                    onClick={() => setActiveTab('integrations')} 
                    icon={Globe} 
                    label="التكامل والربط" 
                />
            </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl border border-gray-100 p-8">
                {activeTab === 'profile' && <ProfileTab />}
                {activeTab === 'notifications' && <NotificationsTab />}
                {activeTab === 'security' && <SecurityTab />}
                {activeTab === 'integrations' && <IntegrationsTab />}
            </div>
        </div>
      </div>
    </>
  );
}

function TabButton({ active, onClick, icon: Icon, label }: any) {
    return (
        <button 
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                active 
                ? "bg-primary/5 text-primary" 
                : "text-gray-500 hover:bg-gray-50"
            }`}
        >
            <Icon className="w-5 h-5" /> {label}
        </button>
    );
}

function ProfileTab() {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="text-xl font-bold mb-6">الملف الشخصي</h3>
            
            <div className="flex items-center gap-6 mb-8">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gray-100 border-4 border-white shadow-sm flex items-center justify-center overflow-hidden">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed" alt="Ahmed" className="w-full h-full" />
                    </div>
                    <button className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full border-2 border-white shadow-sm hover:bg-primary/90">
                        <User className="w-4 h-4" />
                    </button>
                </div>
                <div>
                    <h4 className="font-bold text-lg">Ahmed User</h4>
                    <p className="text-gray-500 text-sm">مدير الحساب</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل</label>
                    <input type="text" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-primary focus:outline-none" defaultValue="Ahmed User" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                    <input type="email" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-primary focus:outline-none" defaultValue="ahmed@example.com" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
                    <input type="text" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-primary focus:outline-none" defaultValue="+966 50 000 0000" dir="ltr text-right" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">المسمى الوظيفي</label>
                    <input type="text" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-primary focus:outline-none" defaultValue="Manager" />
                </div>
            </div>

            <div className="border-t border-gray-100 pt-8 flex justify-end">
                <button className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-primary/90">
                    <Save className="w-4 h-4" /> حفظ التغييرات
                </button>
            </div>
        </div>
    );
}

function NotificationsTab() {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="text-xl font-bold mb-6">إعدادات الإشعارات</h3>
            <div className="space-y-6">
                 <div className="flex items-start justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-100">
                            <Mail className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900">إشعارات البريد الإلكتروني</h4>
                            <p className="text-sm text-gray-500">استلام ملخص يومي وتنبيهات الأمان.</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div>
                 <div className="flex items-start justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-100">
                            <MessageSquare className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900">إشعارات الواتساب</h4>
                            <p className="text-sm text-gray-500">تلقي تنبيهات عند توقف البوت أو المشاكل التقنية.</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div>
                 <div className="flex items-start justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-100">
                            <Smartphone className="w-5 h-5 text-purple-500" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900">إشعارات الجوال (Push)</h4>
                            <p className="text-sm text-gray-500">تنبيهات فورية على تطبيق الجوال.</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div>
            </div>
             <div className="border-t border-gray-100 pt-8 flex justify-end mt-8">
                <button className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-primary/90">
                    <Save className="w-4 h-4" /> حفظ التغييرات
                </button>
            </div>
        </div>
    );
}

function SecurityTab() {
     return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="text-xl font-bold mb-6">الأمان وكلمة المرور</h3>
            <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Key className="w-5 h-5 text-gray-600" /> تغيير كلمة المرور
                    </h4>
                    <div className="space-y-4">
                        <input type="password" placeholder="كلمة المرور الحالية" className="w-full p-3 bg-white rounded-xl border border-gray-200 focus:border-primary focus:outline-none" />
                        <input type="password" placeholder="كلمة المرور الجديدة" className="w-full p-3 bg-white rounded-xl border border-gray-200 focus:border-primary focus:outline-none" />
                        <input type="password" placeholder="تأكيد كلمة المرور الجديدة" className="w-full p-3 bg-white rounded-xl border border-gray-200 focus:border-primary focus:outline-none" />
                    </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex items-center justify-between">
                     <div className="flex gap-4">
                         <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-100">
                            <Shield className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h4 className="font-bold">المصادقة الثنائية (2FA)</h4>
                            <p className="text-sm text-gray-500">زيادة أمان حسابك عن طريق رمز التحقق.</p>
                        </div>
                    </div>
                     <button className="px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm font-medium hover:bg-gray-50">
                        تفعيل
                     </button>
                </div>
            </div>
             <div className="border-t border-gray-100 pt-8 flex justify-end mt-8">
                <button className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-primary/90">
                    <Save className="w-4 h-4" /> تحديث كلمة المرور
                </button>
            </div>
        </div>
     )
}

function IntegrationsTab() {
    const [step, setStep] = useState(1);
    const [webhookUrl] = useState("https://w-ai.sa/api/webhook/whatsapp");
    const [showToken, setShowToken] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [checking, setChecking] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(webhookUrl);
        alert("تم نسخ رابط الويب هوك!");
    };

    const handleCheckConnection = () => {
        setChecking(true);
        // Simulate API check
        setTimeout(() => {
            setChecking(false);
            setIsConnected(true);
        }, 2000);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold">ربط WhatsApp Business API</h3>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                    <span>خطوة {step} من 3</span>
                </div>
             </div>
             
             {/* Progress Bar */}
             <div className="w-full h-2 bg-gray-100 rounded-full mb-8 overflow-hidden" dir="ltr">
                <div 
                    className="h-full bg-primary transition-all duration-500 ease-out"
                    style={{ width: `${(step / 3) * 100}%` }}
                ></div>
             </div>

             <div className="space-y-8 min-h-[400px]">
                 
                 {/* Step 1: Credentials */}
                 {step === 1 && (
                     <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 mb-6">
                            <h4 className="font-bold text-lg mb-2 text-blue-900 flex items-center gap-2">
                                <Key className="w-5 h-5" /> الخطوة 1: مفاتيح الربط (API Keys)
                            </h4>
                            <p className="text-sm text-blue-800">
                                قم بجلب هذه البيانات من لوحة تحكم Meta Developers ثم اضغط التالي.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Access Token (رمز الوصول المؤقت أو الدائم)</label>
                                <div className="relative">
                                    <input 
                                        type={showToken ? "text" : "password"} 
                                        placeholder="EAAJsd8..." 
                                        className="w-full p-4 bg-white rounded-xl border border-gray-200 font-mono text-sm focus:border-primary focus:outline-none" 
                                    />
                                    <button 
                                        onClick={() => setShowToken(!showToken)}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
                                    >
                                        <Eye className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number ID</label>
                                    <input type="text" placeholder="1092837465..." className="w-full p-4 bg-white rounded-xl border border-gray-200 font-mono text-sm focus:border-primary focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Account ID</label>
                                    <input type="text" placeholder="1928374650..." className="w-full p-4 bg-white rounded-xl border border-gray-200 font-mono text-sm focus:border-primary focus:outline-none" />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end mt-8">
                            <button 
                                onClick={() => setStep(2)}
                                className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 flex items-center gap-2"
                            >
                                التالي: إعداد الويب هوك <ChevronLeft className="w-4 h-4" />
                            </button>
                        </div>
                     </div>
                 )}

                 {/* Step 2: Verify Token */}
                 {step === 2 && (
                     <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 mb-6">
                            <h4 className="font-bold text-lg mb-2 text-purple-900 flex items-center gap-2">
                                <Shield className="w-5 h-5" /> الخطوة 2: حماية الويب هوك
                            </h4>
                            <p className="text-sm text-purple-800">
                                اختر كلمة سر (Verify Token). ستحتاج لإدخالها في إعدادات Meta في الخطوة القادمة.
                            </p>
                        </div>

                        <div className="space-y-4">
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Verify Token (كلمة سر التحقق)</label>
                                <input type="text" defaultValue="replyx_secret_token_123" className="w-full p-4 bg-white rounded-xl border border-gray-200 font-mono text-sm focus:border-primary focus:outline-none" />
                                <p className="text-xs text-gray-500 mt-2">يمكنك كتابة أي كلمة، المهم أن تتذكرها.</p>
                            </div>
                        </div>

                        <div className="flex justify-between mt-8">
                            <button 
                                onClick={() => setStep(1)}
                                className="text-gray-500 font-medium px-6 py-3 hover:bg-gray-50 rounded-xl"
                            >
                                رجوع
                            </button>
                            <button 
                                onClick={() => setStep(3)}
                                className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 flex items-center gap-2"
                            >
                                التالي: الربط النهائي <ChevronLeft className="w-4 h-4" />
                            </button>
                        </div>
                     </div>
                 )}

                 {/* Step 3: Webhook URL & Check */}
                 {step === 3 && (
                     <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        
                        {!isConnected ? (
                            <>
                                <div className="bg-green-50 p-6 rounded-2xl border border-green-100 mb-6">
                                    <h4 className="font-bold text-lg mb-2 text-green-900 flex items-center gap-2">
                                        <Globe className="w-5 h-5" /> الخطوة 3: تفعيل الويب هوك (Webhook)
                                    </h4>
                                    <p className="text-sm text-green-800">
                                        انسخ الرابط أدناه وضعه في حقل Callback URL في إعدادات Meta، ثم اضغط "تحقق من الربط".
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Callback URL</label>
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                value={webhookUrl} 
                                                readOnly 
                                                className="w-full p-4 bg-blue-50/30 rounded-xl border border-blue-100 text-blue-800 font-mono text-sm focus:outline-none" 
                                                dir="ltr"
                                            />
                                            <button 
                                                onClick={handleCopy}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white text-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:text-primary border border-gray-100"
                                            >
                                                نسخ
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between mt-8">
                                    <button 
                                        onClick={() => setStep(2)}
                                        className="text-gray-500 font-medium px-6 py-3 hover:bg-gray-50 rounded-xl"
                                    >
                                        رجوع
                                    </button>
                                    <button 
                                        onClick={handleCheckConnection}
                                        disabled={checking}
                                        className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                                    >
                                        {checking ? (
                                            <>
                                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                                جاري التحقق...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-5 h-5" /> تحقق من الربط
                                            </>
                                        )}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12 animate-in zoom-in duration-300">
                                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">تم الربط بنجاح! 🎉</h3>
                                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                                    تم التحقق من الاتصال مع WhatsApp Business API. يمكنك الآن إرسال واستقبال الرسائل.
                                </p>
                                <button className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800">
                                    العودة للإعدادات
                                </button>
                            </div>
                        )}
                     </div>
                 )}
             </div>
        </div>
    )
}

