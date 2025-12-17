"use client";

import { MessageSquare, ArrowUpRight, ArrowDownLeft } from "lucide-react";

interface ActivityItem {
  id: string;
  content: string;
  direction: string;
  status: string;
  createdAt: Date;
  contactName: string | null;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg">النشاط الأخير</h3>
      </div>
      
      <div className="space-y-6">
        {activities.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">لا يوجد نشاط حديث</p>
        ) : (
          activities.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                item.direction === 'inbound' ? 'bg-purple-50 text-purple-600' : 'bg-orange-50 text-orange-600'
              }`}>
                 {item.direction === 'inbound' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {item.contactName || "مستخدم غير معروف"}
                    </p>
                    <span className="text-[10px] text-gray-400 shrink-0">
                      {new Date(item.createdAt).toLocaleTimeString("ar-EG", { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">
                    {item.content}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                     <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        item.direction === 'inbound' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
                     }`}>
                       {item.direction === 'inbound' ? 'وارد' : 'صادر'}
                     </span>
                  </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
