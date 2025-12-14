import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div className="flex items-center justify-between py-4 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
           <Link href="/" className="w-10 h-10 rounded-full border-2 border-[#105D3B] flex items-center justify-center text-[#105D3B] font-bold text-xl hover:bg-green-50 transition-colors">
              W
          </Link>
          <span className="text-xl font-extrabold text-gray-900 tracking-tight">W-AI</span>
        </div>
  
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link href="#features" className="hover:text-[#105D3B] transition-colors">المميزات</Link>
          <Link href="#testimonials" className="hover:text-[#105D3B] transition-colors">آراء العملاء</Link>
          <Link href="#pricing" className="hover:text-[#105D3B] transition-colors">الأسعار</Link>
          <Link href="#faq" className="hover:text-[#105D3B] transition-colors">الأسئلة الشائعة</Link>
        </div>
  
        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden md:block text-sm font-semibold text-gray-600 hover:text-[#105D3B] transition-colors">
            تسجيل الدخول
          </Link>
          <Link href="/register" className="bg-[#105D3B] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#0d4f32] shadow-lg shadow-green-900/10 hover:shadow-green-900/20 transition-all flex items-center gap-2">
            ابدأ الآن <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
