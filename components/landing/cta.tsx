import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function CTA() {
  return (
    <section className="py-20 px-6 md:px-12" dir="rtl">
      <div className="max-w-7xl mx-auto bg-[#105D3B] rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -ml-32 -mb-32"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            جاهز لتحويل الواتساب إلى آلة مبيعات؟
          </h2>
          <p className="text-green-100 text-lg md:text-xl mb-10 leading-relaxed">
            انضم الآن وابدأ في أتمتة محادثاتك وزيادة مبيعاتك في دقائق. لا تفوت الفرصة لتكون في المقدمة.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto bg-white text-[#105D3B] px-8 py-4 rounded-full text-lg font-bold hover:bg-green-50 transition-all shadow-lg flex items-center justify-center gap-2">
              ابدأ تجربتك المجانية <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
          
          <p className="mt-8 text-sm text-green-200 opacity-80">
            تجربة مجانية لمدة 14 يوم • لا يلزم بطاقة ائتمان • إلغاء في أي وقت
          </p>
        </div>
      </div>
    </section>
  );
}
