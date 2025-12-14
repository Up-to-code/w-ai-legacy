import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4" dir="rtl">
      <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 text-center max-w-lg w-full shadow-xl shadow-gray-100/50">
        <h1 className="text-9xl font-black text-primary/10 mb-4 select-none">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">عذراً، الصفحة غير موجودة</h2>
        <p className="text-gray-500 mb-8">
            يبدو أن الرابط الذي تحاول الوصول إليه غير صحيح أو تم نقله.
        </p>
        
        <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-transform active:scale-95 shadow-lg shadow-primary/20"
        >
            <Home className="w-5 h-5" /> العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
