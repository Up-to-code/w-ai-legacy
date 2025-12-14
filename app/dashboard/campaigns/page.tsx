"use client";

import { Header } from "@/components/dashboard/header";
import { Search, Plus, Filter, Send, Calendar, Users, MoreVertical, Play, BarChart2 } from "lucide-react";
import { useState } from "react";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([
    { id: 1, name: 'عروض الصيف الكبرى', status: 'completed', audience: 1250, delivered: 1240, read: 980, date: '2024-06-01' },
    { id: 2, name: 'رسالة ترحيبية للعملاء الجدد', status: 'active', audience: 45, delivered: 45, read: 30, date: '2024-12-10' },
    { id: 3, name: 'إشعار صيانة المنصة', status: 'scheduled', audience: 5000, delivered: 0, read: 0, date: '2024-12-25' },
  ]);

  return (
    <>
      <Header />
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold mb-2">الحملات التسويقية</h1>
            <p className="text-gray-500">إدارة حملات الرسائل الجماعية (Broadcasts) وتحليل نتائجها.</p>
        </div>
        <button 
            className="bg-primary text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-primary/90 transition-transform active:scale-95 shadow-lg shadow-primary/20"
        >
            <Plus className="w-5 h-5" /> حملة جديدة
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between bg-gray-50/30">
           <div className="relative w-full md:w-96">
                <input 
                  type="text" 
                  placeholder="بحث عن حملة..." 
                  className="w-full pl-4 pr-10 py-2.5 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary shadow-sm"
                />
                 <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
           </div>
           <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-xl text-sm text-gray-600 hover:bg-gray-50 font-medium">
                    <Filter className="w-4 h-4" /> تصفية: الجميع
                </button>
           </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
            <table className="w-full text-right">
                <thead className="bg-gray-50 text-gray-500 text-sm">
                    <tr>
                        <th className="px-6 py-4 font-medium">اسم الحملة</th>
                        <th className="px-6 py-4 font-medium">الحالة</th>
                        <th className="px-6 py-4 font-medium">الجمهور المستهدف</th>
                        <th className="px-6 py-4 font-medium">نسبة القراءة</th>
                        <th className="px-6 py-4 font-medium">تاريخ الإرسال</th>
                        <th className="px-6 py-4 font-medium"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {campaigns.map((camp) => (
                        <tr key={camp.id} className="hover:bg-gray-50/50 transition-colors group">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                        camp.status === 'completed' ? 'bg-green-50 text-green-600' :
                                        camp.status === 'active' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                        <Send className="w-5 h-5 -rotate-45 mb-1 mr-0.5" />
                                    </div>
                                    <span className="font-bold text-gray-900">{camp.name}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                                    camp.status === 'completed' ? "bg-green-100 text-green-800" :
                                    camp.status === 'active' ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-600"
                                }`}>
                                    {camp.status === 'active' && <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>}
                                    {camp.status === 'completed' ? 'مكتملة' :
                                     camp.status === 'active' ? 'جارية' : 'مجدولة'}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-gray-600 flex items-center gap-2">
                                <Users className="w-4 h-4 text-gray-400" />
                                {camp.audience}
                            </td>
                            <td className="px-6 py-4">
                                {camp.status === 'scheduled' ? (
                                    <span className="text-gray-400 text-sm">-</span>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500 rounded-full" style={{ width: `${(camp.read / camp.delivered) * 100}%` }}></div>
                                        </div>
                                        <span className="text-xs font-bold text-gray-700">{Math.round((camp.read / camp.delivered) * 100)}%</span>
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4 text-gray-500 text-sm">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    {camp.date}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors" title="التقرير">
                                        <BarChart2 className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </>
  );
}
