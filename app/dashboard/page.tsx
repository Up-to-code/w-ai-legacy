import { Header } from "@/components/dashboard/header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Users, MessageSquare, CheckCircle, Clock, Plus } from "lucide-react";
import { TeamCollaboration } from "@/components/dashboard/team-widgets";
// Reusing some components but conceptually repurposing them
import { ProjectAnalytics } from "@/components/dashboard/project-analytics";

export default function DashboardPage() {
  return (
    <>
      <Header />
      
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
           <h1 className="text-3xl font-bold mb-2">لوحة التحكم</h1>
           <p className="text-gray-500">نظرة عامة على نشاط الرد الآلي والعملاء.</p>
        </div>
        <div className="flex gap-3">
             <button className="bg-[#105D3B] text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-[#0d4f32]">
                <Plus className="w-4 h-4" /> حملة جديدة
             </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-4 hover:shadow-lg transition-shadow">
             <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-7 h-7" />
             </div>
             <div>
                 <p className="text-sm font-medium text-gray-500 mb-1">إجمالي العملاء</p>
                 <h3 className="text-2xl font-bold text-gray-900">1,240</h3>
                 <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                    ↑ 12% <span className="text-gray-400">من الشهر الماضي</span>
                 </span>
             </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-4 hover:shadow-lg transition-shadow">
             <div className="w-14 h-14 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                <MessageSquare className="w-7 h-7" />
             </div>
             <div>
                 <p className="text-sm font-medium text-gray-500 mb-1">الرسائل المرسلة</p>
                 <h3 className="text-2xl font-bold text-gray-900">45,200</h3>
                 <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                    ↑ 5% <span className="text-gray-400">من الشهر الماضي</span>
                 </span>
             </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-4 hover:shadow-lg transition-shadow">
             <div className="w-14 h-14 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                <CheckCircle className="w-7 h-7" />
             </div>
             <div>
                 <p className="text-sm font-medium text-gray-500 mb-1">تم الرد (AI)</p>
                 <h3 className="text-2xl font-bold text-gray-900">85%</h3>
                 <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                    ↑ 2% <span className="text-gray-400">تحسن في الدقة</span>
                 </span>
             </div>
        </div>
         <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-4 hover:shadow-lg transition-shadow">
             <div className="w-14 h-14 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                <Clock className="w-7 h-7" />
             </div>
             <div>
                 <p className="text-sm font-medium text-gray-500 mb-1">قيد الانتظار</p>
                 <h3 className="text-2xl font-bold text-gray-900">12</h3>
                 <span className="text-xs text-red-500 font-medium flex items-center gap-1">
                    ↓ مساعدة مطلوبة
                 </span>
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 h-[400px]">
           <ProjectAnalytics /> {/* We might need to rename/refactor this later to "MessageAnalytics" */}
        </div>
        
        <div className="lg:col-span-1">
           <TeamCollaboration /> {/* Can represent "Support Agents" */}
        </div>
      </div>
    </>
  );
}
