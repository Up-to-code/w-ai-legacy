"use client";

import { Search, MessageSquare, ExternalLink, Loader2 } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getIntegrations } from "@/app/actions/integrations";

// App definition - Only WhatsApp for now
const APPS = [
  {
    id: "whatsapp",
    name: "WhatsApp Business API",
    description: "اربط حسابك مع واتساب لإرسال الحملات والرد الآلي.",
    icon: MessageSquare,
    color: "bg-green-500",
    category: "communication",
  },
];

const CATEGORIES = [
  { id: "all", label: "الكل" },
  { id: "communication", label: "المراسلة" },
];

export default function IntegrationsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [connectedApps, setConnectedApps] = useState<string[]>([]);
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
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === cat.id
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
                  <StatusBadge status="connected" />
                ) : (
                  <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
                )}
              </div>

              <div className="mb-6 flex-1">
                <h3 className="font-bold text-gray-900 mb-2">{app.name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{app.description}</p>
              </div>

              <div className="flex gap-2">
                <Link href="/dashboard/integrations/whatsapp" className={`w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors ${connectedApps.includes(app.id)
                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  : "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20"
                  }`}>
                  {connectedApps.includes(app.id) ? "إدارة الإعدادات" : "ربط الخدمة"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
