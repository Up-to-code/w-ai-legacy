import { Header } from "@/components/dashboard/header";
import { Copy, Plus } from "lucide-react";

export default function TemplatesPage() {
  return (
    <>
      <Header />
      <div className="mb-8 flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold mb-2">قوالب الرسائل</h1>
            <p className="text-gray-500">إدارة القوالب الجاهزة للرد الآلي.</p>
        </div>
         <button className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-primary/90">
            <Plus className="w-4 h-4" /> قالب جديد
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-primary/50 transition-colors group cursor-pointer relative">
                <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 bg-gray-100 rounded-lg hover:text-primary"><Copy className="w-4 h-4" /></button>
                </div>
                <h3 className="font-bold text-lg mb-3">ترحيب بالعميل الجديد {i}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4 bg-gray-50 p-3 rounded-lg">
                    مرحباً بك في شركتنا! نحن سعداء بانضمامك إلينا. كيف يمكننا مساعدتك اليوم؟
                </p>
                <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 pt-3">
                    <span>التصنيف: ترحيب</span>
                    <span>استخدم 1.2k مرة</span>
                </div>
            </div>
        ))}
      </div>
    </>
  );
}
