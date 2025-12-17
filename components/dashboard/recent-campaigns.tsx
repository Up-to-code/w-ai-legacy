"use client";

import { Send, Clock } from "lucide-react";
import type { Campaign } from "@/types/campaign";

interface RecentCampaignsProps {
  campaigns: Campaign[];
}

export function RecentCampaigns({ campaigns }: RecentCampaignsProps) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg">آخر الحملات</h3>
      </div>
      
      <div className="space-y-4 overflow-y-auto max-h-[300px] pr-2">
        {campaigns.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">لا توجد حملات حديثة</p>
        ) : (
          campaigns.map((camp) => (
            <div key={camp.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  camp.status === 'completed' ? 'bg-green-100 text-green-600' :
                  camp.status === 'active' || camp.status === 'sending' ? 'bg-blue-100 text-blue-600' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  <Send className="w-4 h-4 -rotate-45 mb-0.5 mr-0.5" />
                </div>
                <div>
                    <h4 className="font-bold text-sm text-gray-900">{camp.name}</h4>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(camp.createdAt).toLocaleDateString("ar-EG")}
                    </span>
                </div>
              </div>
              
              <span className={`text-xs px-2 py-1 rounded-md font-medium ${
                  camp.status === 'completed' ? 'bg-green-100 text-green-700' :
                  camp.status === 'active' || camp.status === 'sending' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-600'
              }`}>
                  {camp.status === 'completed' ? 'مكتملة' :
                   camp.status === 'active' || camp.status === 'sending' ? 'جارية' : 'مسودة'}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
