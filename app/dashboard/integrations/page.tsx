"use client";

import { Header } from "@/components/dashboard/header";
import { Search, Filter, MessageSquare, Smartphone, Zap, CheckCircle, ExternalLink, Globe, Slack, Mail } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const APPS = [
  {
    id: "whatsapp",
    name: "WhatsApp Business API",
    description: "اربط حسابك مع واتساب لإرسال الحملات والرد الآلي.",
    icon: MessageSquare,
    color: "bg-green-500",
    category: "communication",
    connected: false,
    link: "/dashboard/settings"
  },
  {
    id: "google_sheets",
    name: "Google Sheets",
    description: "تزامن تلقائي لبيانات العملاء والطلبات مع جداول بيانات جوجل.",
    icon: Globe,
    color: "bg-green-600",
    category: "utilities",
    connected: false,
    link: "#"
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "اربط المنصة مع أكثر من 5000 تطبيق عالمي عبر زابيير.",
    icon: Zap,
    color: "bg-orange-500",
    category: "automation",
    connected: false,
    link: "#"
  },
  {
    id: "slack",
    name: "Slack",
    description: "استقبل إشعارات الطلبات والرسائل الجديدة على قنوات سلاك.",
    icon: Slack,
    color: "bg-purple-600",
    category: "communication",
    connected: false,
    link: "#"
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    description: "مزامنة جهات الاتصال لإرسال حملات البريد الإلكتروني.",
    icon: Mail,
    color: "bg-yellow-500",
    category: "marketing",
    connected: false,
    link: "#"
  },
  {
    id: "sms",
    name: "SMS Gateway",
    description: "بوابة رسائل نصية قصيرة بديلة للواتساب.",
    icon: Smartphone,
    color: "bg-blue-500",
    category: "communication",
    connected: false,
    link: "#"
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
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredApps = APPS.filter(app => {
    const matchesCategory = activeCategory === "all" || app.category === activeCategory;
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Header />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">سوق التطبيقات والربط</h1>
        <p className="text-gray-500 text-sm mt-1">تصفح التطبيقات والخدمات التي يمكنك ربطها مع المنصة لتعزيز إنتاجيتك.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[600px]">
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
                            {/* Render icon with inline logic to handle 'any' type if needed, or structured icon */}
                            <app.icon className={`w-6 h-6 ${app.color.replace('bg-', 'text-')}`} />
                        </div>
                        {app.connected ? (
                             <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> متصل
                            </span>
                        ) : (
                            <Link href={app.link} className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <ExternalLink className="w-4 h-4 text-gray-400 hover:text-primary" />
                            </Link>
                        )}
                    </div>
                    
                    <div className="mb-6 flex-1">
                        <h3 className="font-bold text-gray-900 mb-2">{app.name}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">{app.description}</p>
                    </div>

                    <Link 
                        href={app.link} 
                        className={`w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
                            app.connected 
                            ? "bg-gray-100 text-gray-600 hover:bg-gray-200" 
                            : "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20"
                        }`}
                    >
                        {app.connected ? "إدارة الربط" : "ربط الخدمة"}
                    </Link>
                </div>
            ))}
        </div>
      </div>
    </>
  );
}
