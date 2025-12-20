import Link from "next/link";
import { ArrowLeft, Rocket } from "lucide-react";

export function CTA() {
  return (
    <section className="py-20 px-6 md:px-12 bg-white" dir="rtl">
      <div className="max-w-7xl mx-auto rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden group">

        {/* Animated Background */}
        <div className="absolute inset-0 bg-[#105D3B] z-0"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-white/15 transition-colors duration-700"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-black/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

        {/* Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white border border-white/20 px-4 py-1.5 rounded-full text-sm font-semibold mb-8 backdrop-blur-sm shadow-xl">
            <Rocket className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>ابدأ رحلتك اليوم</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight tracking-tight">
            حول محادثاتك إلى <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-200 to-white">أرباح مستدامة</span>
          </h2>

          <p className="text-green-100 text-xl md:text-2xl mb-12 leading-relaxed max-w-2xl mx-auto font-light">
            أكثر من 1000 شركة تستخدم W-AI لأتمتة خدمة عملائها. انضم إليهم اليوم ولا تترك أموالاً على الطاولة.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto bg-white text-[#105D3B] px-10 py-5 rounded-2xl text-xl font-bold hover:bg-green-50 transition-all shadow-xl shadow-black/20 hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-3">
              أنشئ حسابك مجاناً <ArrowLeft className="w-6 h-6" />
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center gap-6 text-sm text-green-200/80 font-medium">
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-400"></div> تجربة مجانية 14 يوم</span>
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-400"></div> بدون بطاقة ائتمان</span>
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-400"></div> دعم فني عربي</span>
          </div>
        </div>
      </div>
    </section>
  );
}
