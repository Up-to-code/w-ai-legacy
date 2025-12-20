import Link from "next/link";
import { Twitter, Facebook, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16" dir="rtl">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-16">

          {/* Brand Column */}
          <div className="col-span-2 md:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#105D3B] to-[#158052] flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-green-900/40">
                W
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">W-AI</span>
            </div>
            <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
              المنصة الأولى عربياً لأتمتة محادثات الواتساب التجارية باستخدام الذكاء الاصطناعي التوجيهي.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#105D3B] hover:text-white transition-all duration-300"><Twitter className="w-5 h-5" /></Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#105D3B] hover:text-white transition-all duration-300"><Facebook className="w-5 h-5" /></Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#105D3B] hover:text-white transition-all duration-300"><Instagram className="w-5 h-5" /></Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#105D3B] hover:text-white transition-all duration-300"><Linkedin className="w-5 h-5" /></Link>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-bold text-white mb-6">المنتج</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="#features" className="hover:text-[#105D3B] transition-colors">المميزات</Link></li>
              <li><Link href="#pricing" className="hover:text-[#105D3B] transition-colors">الأسعار</Link></li>
              <li><Link href="#" className="hover:text-[#105D3B] transition-colors">API</Link></li>
              <li><Link href="#" className="hover:text-[#105D3B] transition-colors">التكاملات</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6">المصادر</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="#" className="hover:text-[#105D3B] transition-colors">المدونة</Link></li>
              <li><Link href="#" className="hover:text-[#105D3B] transition-colors">قصص النجاح</Link></li>
              <li><Link href="#" className="hover:text-[#105D3B] transition-colors">مركز المساعدة</Link></li>
              <li><Link href="#" className="hover:text-[#105D3B] transition-colors">المطورين</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6">الشركة</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="#" className="hover:text-[#105D3B] transition-colors">عن W-AI</Link></li>
              <li><Link href="#" className="hover:text-[#105D3B] transition-colors">الوظائف</Link></li>
              <li><Link href="#" className="hover:text-[#105D3B] transition-colors">الشركاء</Link></li>
              <li><Link href="#" className="hover:text-[#105D3B] transition-colors">تواصل معنا</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6">قانوني</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="#" className="hover:text-[#105D3B] transition-colors">الخصوصية</Link></li>
              <li><Link href="#" className="hover:text-[#105D3B] transition-colors">الشروط</Link></li>
              <li><Link href="#" className="hover:text-[#105D3B] transition-colors">الأمان</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} W-AI. جميع الحقوق محفوظة.</p>
          <div className="flex gap-6 mt-4 md:mt-0 items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span>جميع الأنظمة تعمل بكفاءة</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
