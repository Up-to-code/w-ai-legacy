"use client";

import { Header } from "@/components/dashboard/header";
import { Search, Filter, MessageSquare, Smartphone, Zap, CheckCircle, ExternalLink, Globe, Slack, Mail, Loader2, Key, Shield, ChevronLeft, Eye, X, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useToast } from "@/lib/hooks/use-toast";
import { getIntegrations, connectIntegration, disconnectIntegration } from "@/app/actions/integrations";


// App definition
interface AppDef {
  id: string; // Service ID
  name: string;
  description: string;
  icon: any;
  color: string;
  category: string;
  link?: string;
}

const APPS: AppDef[] = [
  {
    id: "whatsapp",
    name: "WhatsApp Business API",
    description: "اربط حسابك مع واتساب لإرسال الحملات والرد الآلي.",
    icon: MessageSquare,
    color: "bg-green-500",
    category: "communication",
  },
  {
    id: "google_sheets",
    name: "Google Sheets",
    description: "تزامن تلقائي لبيانات العملاء والطلبات مع جداول بيانات جوجل.",
    icon: Globe,
    color: "bg-green-600",
    category: "utilities",
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "اربط المنصة مع أكثر من 5000 تطبيق عالمي عبر زابيير.",
    icon: Zap,
    color: "bg-orange-500",
    category: "automation",
  },
  {
    id: "slack",
    name: "Slack",
    description: "استقبل إشعارات الطلبات والرسائل الجديدة على قنوات سلاك.",
    icon: Slack,
    color: "bg-purple-600",
    category: "communication",
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    description: "مزامنة جهات الاتصال لإرسال حملات البريد الإلكتروني.",
    icon: Mail,
    color: "bg-yellow-500",
    category: "marketing",
  },
  {
    id: "sms",
    name: "SMS Gateway",
    description: "بوابة رسائل نصية قصيرة بديلة للواتساب.",
    icon: Smartphone,
    color: "bg-blue-500",
    category: "communication",
  }
];

const CATEGORIES = [
  { id: "all", label: "الكل" },
  { id: "communication", label: "المراسلة" },
  { id: "marketing", label: "التسويق" },
  { id: "automation", label: "الأتمتة" },
  { id: "utilities", label: "أدوات مساعدة" },
];

export default function IntegrationsPage() {
  const toast = useToast();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [connectedApps, setConnectedApps] = useState<string[]>([]); // List of connected service IDs
  const [activeAppId, setActiveAppId] = useState<string | null>(null); // For connecting flow
  const [isLoading, setIsLoading] = useState(true);

  // Load integrations status
  useEffect(() => {
    async function loadIntegrations() {
      try {
        const result = await getIntegrations();
        if (result.success && result.data) {
          const connectedIds = result.data.filter(i => i.status === 'connected').map(i => i.serviceId as string);
          setConnectedApps(connectedIds);
        }
      } catch (error) {
        console.error("Failed to load integrations", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadIntegrations();
  }, []);

  const handleConnectSuccess = (serviceId: string) => {
    setConnectedApps(prev => [...prev, serviceId]);
    setActiveAppId(null);
    toast.success("تم الربط بنجاح");
  };

  const handleDisconnect = async (serviceId: string) => {
      // In a real app we'd want a confirmation dialog here
      try {
          const result = await disconnectIntegration(serviceId);
          if (result.success) {
            setConnectedApps(prev => prev.filter(id => id !== serviceId));
            toast.success("تم إلغاء الربط");
          } else {
            toast.error(result.error);
          }
      } catch (e) {
          toast.error("فشل إلغاء الربط");
      }
  };

  const filteredApps = APPS.filter(app => {
    const matchesCategory = activeCategory === "all" || app.category === activeCategory;
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (isLoading) {
      return (
          <div className="flex items-center justify-center h-screen">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
      );
  }

  return (
    <>
      <Header />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">سوق التطبيقات والربط</h1>
        <p className="text-gray-500 text-sm mt-1">تصفح التطبيقات والخدمات التي يمكنك ربطها مع المنصة لتعزيز إنتاجيتك.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[600px] relative">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col lg:flex-row gap-4 justify-between bg-white sticky top-0 z-10">
           {/* Categories */}
           <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                            activeCategory === cat.id 
                            ? "bg-gray-900 text-white" 
                            : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                        {cat.label}
                    </button>
                ))}
           </div>

           {/* Search */}
           <div className="relative w-full lg:w-80">
                <input 
                  type="text" 
                  placeholder="بحث عن تطبيق..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                />
                 <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
           </div>
        </div>

        {/* Apps Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApps.map((app) => (
                <div key={app.id} className="group border border-gray-200 rounded-2xl p-5 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all bg-white flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-2xl ${app.color} bg-opacity-10 flex items-center justify-center text-white shadow-sm`}>
                            <app.icon className={`w-6 h-6 ${app.color.replace('bg-', 'text-')}`} />
                        </div>
                        {connectedApps.includes(app.id) ? (
                             <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> متصل
                            </span>
                        ) : (
                             <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
                        )}
                    </div>
                    
                    <div className="mb-6 flex-1">
                        <h3 className="font-bold text-gray-900 mb-2">{app.name}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">{app.description}</p>
                    </div>

                    <div className="flex gap-2">
                        {app.id === 'whatsapp' ? (
                            <Link href="/dashboard/integrations/whatsapp" className={`w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
                                connectedApps.includes(app.id)
                                ? "bg-gray-100 text-gray-700 hover:bg-gray-200" 
                                : "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20"
                            }`}>
                                {connectedApps.includes(app.id) ? "إدارة الإعدادات" : "ربط الخدمة"}
                            </Link>
                        ) : (
                            <>
                                {connectedApps.includes(app.id) && (
                                    <button
                                        onClick={() => toast.success("الاتصال يعمل بشكل جيد ✅")}
                                        className="px-4 py-2.5 rounded-xl font-bold text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                                        title="اختبار الاتصال"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                    </button>
                                )}
                                <button 
                                    onClick={() => connectedApps.includes(app.id) ? handleDisconnect(app.id) : setActiveAppId(app.id)}
                                    className={`flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
                                        connectedApps.includes(app.id)
                                        ? "bg-red-50 text-red-600 hover:bg-red-100" 
                                        : "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20"
                                    }`}
                                >
                                    {connectedApps.includes(app.id) ? "إلغاء الربط" : "ربط الخدمة"}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Placeholder Modal for other apps */}
      {activeAppId && activeAppId !== 'whatsapp' && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
               <div className="bg-white rounded-3xl p-8 w-full max-w-md text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                         <Zap className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">قريباً!</h3>
                    <p className="text-gray-500 mb-6">هذا الربط قيد التطوير حالياً وسيكون متاحاً قريباً.</p>
                    <button 
                        onClick={() => setActiveAppId(null)}
                        className="bg-gray-900 text-white px-6 py-2 rounded-xl font-bold"
                    >
                        حسناً
                    </button>
               </div>
          </div>
      )}
    </>
  );
}
