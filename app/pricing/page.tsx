import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Check } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      
      <section className="py-20 px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl font-bold mb-4">خطط تناسب جميع الاحتياجات</h1>
            <p className="text-gray-500 text-lg">
                اختر الباقة المناسبة لعملك وابدأ في أتمتة محادثات الواتساب اليوم مع W-AI.
            </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="border border-gray-200 rounded-3xl p-8 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold mb-2">البداية</h3>
                <p className="text-gray-500 mb-6 text-sm">أفضل خيار للأفراد والشركات الناشئة.</p>
                <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-4xl font-bold text-gray-900">0</span>
                    <span className="text-gray-500">ر.س / شهر</span>
                </div>
                <button className="w-full py-3 px-4 bg-gray-50 text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-colors mb-8 border border-gray-200">
                    ابدأ مجاناً
                </button>
                <ul className="space-y-4 text-sm text-gray-600">
                    <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500" /> 100 محادثة شهرياً</li>
                    <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500" /> رد آلي أساسي</li>
                    <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500" /> قالب واحد فقط</li>
                    <li className="flex items-center gap-3 text-gray-400"><Check className="w-5 h-5" /> دعم فني</li>
                </ul>
            </div>

             {/* Pro Plan */}
            <div className="border-2 border-primary rounded-3xl p-8 shadow-xl relative transform md:-translate-y-4 bg-white">
                <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-bold">الأكثر طلباً</div>
                <h3 className="text-xl font-bold mb-2 text-primary">المحترفين</h3>
                <p className="text-gray-500 mb-6 text-sm">للشركات التي تحتاج إلى نمو وتوسع.</p>
                <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-4xl font-bold text-gray-900">199</span>
                    <span className="text-gray-500">ر.س / شهر</span>
                </div>
                <button className="w-full py-3 px-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors mb-8 shadow-lg shadow-primary/20">
                    اشترك الآن
                </button>
                <ul className="space-y-4 text-sm text-gray-600">
                    <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500" /> محادثات غير محدودة</li>
                    <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500" /> رد آلي ذكي (AI)</li>
                    <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500" /> قوالب غير محدودة</li>
                    <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500" /> ربط مع CRM</li>
                    <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500" /> دعم فني 24/7</li>
                </ul>
            </div>

             {/* Enterprise Plan */}
            <div className="border border-gray-200 rounded-3xl p-8 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold mb-2">المؤسسات</h3>
                <p className="text-gray-500 mb-6 text-sm">حلول مخصصة للشركات الكبرى.</p>
                <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-4xl font-bold text-gray-900">499</span>
                    <span className="text-gray-500">ر.س / شهر</span>
                </div>
                <button className="w-full py-3 px-4 bg-white border border-gray-200 text-gray-900 font-semibold rounded-xl hover:bg-gray-50 transition-colors mb-8">
                    تواصل معنا
                </button>
                <ul className="space-y-4 text-sm text-gray-600">
                    <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500" /> كل مميزات المحترفين</li>
                    <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500" /> تدريب نموذج AI خاص</li>
                    <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500" /> مدير حساب خاص</li>
                    <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500" /> API مخصص</li>
                </ul>
            </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
