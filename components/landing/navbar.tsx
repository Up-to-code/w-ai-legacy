import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function Navbar() {
  return (
    <nav className="flex items-center justify-between py-6 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="flex items-center gap-2">
         <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center text-primary font-bold">
            W
        </div>
        <span className="text-xl font-bold">W-AI</span>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
        <Link href="#" className="hover:text-primary transition-colors">المميزات</Link>
        <Link href="#" className="hover:text-primary transition-colors">الحلول</Link>
        <Link href="/pricing" className="hover:text-primary transition-colors">الأسعار</Link>
        <Link href="#" className="hover:text-primary transition-colors">عن المنصة</Link>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/login" className="hidden md:block text-sm font-semibold text-gray-600 hover:text-primary">
          تسجيل الدخول
        </Link>
        <Link href="/register" className="bg-[#105D3B] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#0d4f32] transition-colors flex items-center gap-2">
          ابدأ الآن <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>
    </nav>
  );
}
