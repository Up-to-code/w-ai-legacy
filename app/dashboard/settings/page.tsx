"use client";

import { Header } from "@/components/dashboard/header";
import { User, Bell, Lock, Globe, Save, MessageSquare, Smartphone, Mail, Shield, Key, Eye, ChevronLeft, CheckCircle, LogOut, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/lib/hooks/use-toast";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>('profile');

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
            </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl border border-gray-100 p-8 min-h-[500px]">
                {activeTab === 'profile' && <ProfileTab />}
                {activeTab === 'notifications' && <NotificationsTab />}
                {activeTab === 'security' && <SecurityTab />}
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
    const { user, isLoading, updateProfile } = useAuth();
    const toast = useToast();
    const [formData, setFormData] = useState({ 
      name: "",
      phone: "",
      jobTitle: ""
    });
    const [saving, setSaving] = useState(false);
    
    // Fetch full user profile including custom fields
    useEffect(() => {
      async function loadProfile() {
        const { getUserProfile } = await import("@/app/actions/profile");
        const result = await getUserProfile();
        
        if (result.success && result.user) {
          setFormData({
            name: result.user.name || "",
            phone: result.user.phone || "",
            jobTitle: result.user.jobTitle || ""
          });
        } else if (user) {
          setFormData({
            name: user.name || "",
            phone: user.phone || "",
            jobTitle: user.jobTitle || ""
          });
        }
      }
      
      if (user) {
        loadProfile();
      }
    }, [user]);
    
    const getUserInitial = () => {
      if (!user?.name) return "U";
      return user.name.charAt(0).toUpperCase();
    };

    const handleSave = async () => {
      if (!formData.name.trim()) {
        toast.error("الاسم مطلوب");
        return;
      }

      setSaving(true);

      try {
        const result = await updateProfile({ 
            name: formData.name,
            phone: formData.phone || undefined,
            jobTitle: formData.jobTitle || undefined
        });

        if (result.success) {
            toast.success(result.message || "تم تحديث الملف الشخصي");
            if (result.user) {
                setFormData({
                    name: result.user.name || "",
                    phone: result.user.phone || "",
                    jobTitle: result.user.jobTitle || ""
                });
            }
        } else {
            toast.error(result.error);
        }
      } catch (error) {
        toast.error("حدث خطأ أثناء التحديث");
      } finally {
        setSaving(false);
      }
    };
    
    if (isLoading) {
        return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="text-xl font-bold mb-6">الملف الشخصي</h3>
            
            <div className="flex items-center gap-6 mb-8">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gray-100 border-4 border-white shadow-sm flex items-center justify-center overflow-hidden">
                        {user?.image ? (
                          <img src={user.image} alt={user.name || "User"} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary/10">
                            <span className="text-3xl font-bold text-primary">{getUserInitial()}</span>
                          </div>
                        )}
                    </div>
                </div>
                <div>
                    <h4 className="font-bold text-lg">{user?.name || "مستخدم"}</h4>
                    <p className="text-gray-500 text-sm">مدير الحساب</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل</label>
                    <input 
                      type="text" 
                      className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-primary focus:outline-none" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="اسمك الكامل"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                    <input 
                      type="email" 
                      className="w-full p-3 bg-gray-100 rounded-xl border border-gray-200 cursor-not-allowed" 
                      value={user?.email || ""}
                      disabled
                      placeholder="example@email.com"
                    />
                    <p className="text-xs text-gray-500 mt-1">لا يمكن تغيير البريد الإلكتروني</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
                    <input 
                      type="text" 
                      className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-primary focus:outline-none" 
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+966 50 000 0000"
                      dir="ltr"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">المسمى الوظيفي</label>
                    <input 
                      type="text" 
                      className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-primary focus:outline-none" 
                      value={formData.jobTitle}
                      onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                      placeholder="Manager"
                    />
                </div>
            </div>

            <div className="border-t border-gray-100 pt-8 flex justify-end">
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
                    حفظ التغييرات
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
  const router = useRouter();
  const toast = useToast();
  
  const [passwords, setPasswords] = useState({
      current: "",
      new: "",
      confirm: ""
  });
  const [loadingPass, setLoadingPass] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);

  const handleLogout = async () => {
    setLoadingLogout(true);
    try {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/login"); // Localized login route handled by middleware usually, plain login for now
                },
            },
        });
    } catch (error) {
        toast.error("فشل تسجيل الخروج");
        setLoadingLogout(false);
    }
  };

  const handleChangePassword = async () => {
      if (!passwords.current || !passwords.new || !passwords.confirm) {
          toast.error("جميع الحقول مطلوبة");
          return;
      }

      if (passwords.new !== passwords.confirm) {
          toast.error("كلمة المرور الجديدة غير متطابقة");
          return;
      }
      
      if (passwords.new.length < 8) {
          toast.error("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
          return;
      }

      setLoadingPass(true);
      try {
        const { error } = await authClient.changePassword({
            currentPassword: passwords.current,
            newPassword: passwords.new,
            revokeOtherSessions: true,
        });

        if (error) {
            toast.error(error.message || "حدث خطأ أثناء تغيير كلمة المرور");
        } else {
            toast.success("تم تغيير كلمة المرور بنجاح");
            setPasswords({ current: "", new: "", confirm: "" });
        }
      } catch (err) {
         toast.error("حدث خطأ غير متوقع");
      } finally {
        setLoadingPass(false);
      }
  };
  
  return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="text-xl font-bold mb-6">الأمان وكلمة المرور</h3>
            <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Key className="w-5 h-5 text-gray-600" /> تغيير كلمة المرور
                    </h4>
                    <div className="space-y-4">
                        <input 
                            type="password" 
                            placeholder="كلمة المرور الحالية" 
                            className="w-full p-3 bg-white rounded-xl border border-gray-200 focus:border-primary focus:outline-none" 
                            value={passwords.current}
                            onChange={e => setPasswords({...passwords, current: e.target.value})}
                        />
                        <input 
                            type="password" 
                            placeholder="كلمة المرور الجديدة" 
                            className="w-full p-3 bg-white rounded-xl border border-gray-200 focus:border-primary focus:outline-none" 
                            value={passwords.new}
                            onChange={e => setPasswords({...passwords, new: e.target.value})}
                        />
                        <input 
                            type="password" 
                            placeholder="تأكيد كلمة المرور الجديدة" 
                            className="w-full p-3 bg-white rounded-xl border border-gray-200 focus:border-primary focus:outline-none" 
                            value={passwords.confirm}
                            onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                        />
                    </div>
                    <div className="flex justify-end mt-4">
                        <button 
                            onClick={handleChangePassword}
                            disabled={loadingPass}
                            className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loadingPass ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
                            تحديث كلمة المرور
                        </button>
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
                
                {/* Logout Section */}
                <div className="bg-red-50 p-6 rounded-2xl border border-red-100 flex items-center justify-between">
                     <div className="flex gap-4">
                         <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-red-100">
                            <LogOut className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <h4 className="font-bold text-red-900">تسجيل الخروج</h4>
                            <p className="text-sm text-red-700">تسجيل الخروج من حسابك على هذا الجهاز.</p>
                        </div>
                    </div>
                     <button 
                       onClick={handleLogout}
                       disabled={loadingLogout}
                       className="px-6 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-70"
                     >
                        {loadingLogout && <Loader2 className="w-4 h-4 animate-spin" />}
                        تسجيل خروج
                     </button>
                </div>
            </div>
        </div>
     )
}
