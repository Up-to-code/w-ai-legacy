import Link from "next/link";
import { CheckCircle2, PlayCircle, Bot } from "lucide-react";

export function Hero() {
  return (
    <section className="pt-12 pb-20 px-6 md:px-12 max-w-7xl mx-auto text-center" dir="rtl">
      <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-8 border border-green-100">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        الذكاء الاصطناعي وصل إلى الواتساب 🚀
      </div>
      
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6 leading-[1.2]">
        أتمتة خدمة العملاء <br className="hidden md:block" />
        <span className="text-[#105D3B]">بذكاء وسرعة فائقة.</span>
      </h1>
      
      <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
        منصة W-AI تمكنك من بناء مساعد ذكي (Chatbot) على الواتساب للرد على استفسارات عملائك،
        جدولة المواعيد، وإغلاق المبيعات تلقائياً على مدار الساعة.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
        <Link href="/register" className="w-full sm:w-auto bg-[#105D3B] text-white px-8 py-3.5 rounded-full text-base font-semibold hover:bg-[#0d4f32] transition-all shadow-lg shadow-green-900/20 transform hover:-translate-y-1">
          اشترك مجاناً
        </Link>
        <button className="w-full sm:w-auto bg-white text-gray-700 border border-gray-200 px-8 py-3.5 rounded-full text-base font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
          <PlayCircle className="w-5 h-5 text-gray-400" /> شاهد العرض
        </button>
      </div>

      <div className="relative mx-auto max-w-4xl">
         {/* Decorative elements */}
         <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-100 rounded-full blur-3xl opacity-50"></div>
         <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
         
         {/* Simulate Chat Interface */}
         <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-6 relative overflow-hidden text-right">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-4">
                 <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Bot className="w-6 h-6 text-green-600" />
                 </div>
                 <div>
                     <h4 className="font-bold text-sm">المساعد الذكي W-AI</h4>
                     <p className="text-xs text-green-500">متصل الآن</p>
                 </div>
            </div>
            
            <div className="space-y-4 font-sans text-sm">
                 <div className="flex justify-start">
                    <div className="bg-gray-100 py-2 px-4 rounded-2xl rounded-tr-none text-gray-700 max-w-xs">
                        مرحباً! أنا مهتم بمعرفة المزيد عن خدماتكم. هل لديكم باقات للشركات الصغيرة؟
                    </div>
                </div>
                 <div className="flex justify-end">
                    <div className="bg-[#d9fdd3] py-2 px-4 rounded-2xl rounded-tl-none text-gray-800 max-w-xs shadow-sm">
                        أهلاً بك! 👋 بالتأكيد، لدينا باقة "البداية" المصممة خصيصاً للشركات الناشئة بسعر رمزي. هل تود أن أرسل لك التفاصيل؟
                    </div>
                </div>
                 <div className="flex justify-start">
                    <div className="bg-gray-100 py-2 px-4 rounded-2xl rounded-tr-none text-gray-700 max-w-xs">
                        نعم من فضلك، وهل تدعمون الربط مع الأنظمة الأخرى؟
                    </div>
                </div>
                <div className="flex justify-end">
                    <div className="bg-[#d9fdd3] py-2 px-4 rounded-2xl rounded-tl-none text-gray-800 max-w-xs shadow-sm">
                        نعم، W-AI يدعم الربط (API) مع مختلف أنظمة إدارة العملاء (CRM). 🚀
                    </div>
                </div>
            </div>
         </div>
      </div>
    </section>
  );
}
