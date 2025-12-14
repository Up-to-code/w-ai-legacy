import Link from "next/link";
import { Twitter, Facebook, Instagram, Linkedin, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8" dir="rtl">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2">
             <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full border-2 border-[#105D3B] flex items-center justify-center text-[#105D3B] font-bold">
                  W
                </div>
                <span className="text-xl font-bold text-gray-900">W-AI</span>
            </div>
            <p className="text-gray-500 text-sm max-w-xs mb-6 leading-relaxed">
              منصة متكاملة لأتمتة خدمة العملاء والمبيعات عبر الواتساب باستخدام الذكاء الاصطناعي.
            </p>
            <div className="flex items-center gap-4 text-gray-400">
              <Link href="#" className="hover:text-[#105D3B] transition-colors"><Twitter className="w-5 h-5" /></Link>
              <Link href="#" className="hover:text-[#105D3B] transition-colors"><Facebook className="w-5 h-5" /></Link>
              <Link href="#" className="hover:text-[#105D3B] transition-colors"><Instagram className="w-5 h-5" /></Link>
              <Link href="#" className="hover:text-[#105D3B] transition-colors"><Linkedin className="w-5 h-5" /></Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-gray-900 mb-4">المنتج</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="#features" className="hover:text-[#105D3B] transition-colors">المميزات</Link></li>
              <li><Link href="#pricing" className="hover:text-[#105D3B] transition-colors">الأسعار</Link></li>
              <li><Link href="#" className="hover:text-[#105D3B] transition-colors">التحديثات</Link></li>
              <li><Link href="#" className="hover:text-[#105D3B] transition-colors">دليل الاستخدام</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-gray-900 mb-4">الشركة</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="#" className="hover:text-[#105D3B] transition-colors">عن W-AI</Link></li>
              <li><Link href="#" className="hover:text-[#105D3B] transition-colors">الوظائف</Link></li>
              <li><Link href="#" className="hover:text-[#105D3B] transition-colors">المدونة</Link></li>
              <li><Link href="#" className="hover:text-[#105D3B] transition-colors">تواصل معنا</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-gray-900 mb-4">قانوني</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="#" className="hover:text-[#105D3B] transition-colors">سياسة الخصوصية</Link></li>
              <li><Link href="#" className="hover:text-[#105D3B] transition-colors">الشروط والأحكام</Link></li>
              <li><Link href="#" className="hover:text-[#105D3B] transition-colors">سياسة الكوكيز</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} W-AI. جميع الحقوق محفوظة.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
             <span className="flex items-center gap-1">صنع بـ ❤️ في السعودية</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
