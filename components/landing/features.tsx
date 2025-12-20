import { MessageSquare, Clock, Zap, BarChart, Shield, Smartphone, ArrowRight, LayoutDashboard } from "lucide-react";

export function Features() {
  return (
    <section className="py-24 relative overflow-hidden" dir="rtl" id="features">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-gray-50/50 -z-20"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-50/40 rounded-full blur-3xl opacity-50 -z-10 translate-x-1/2 -translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold mb-4 border border-green-100 uppercase tracking-wider">
            مزايا حصرية
          </div>
          <h3 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            كل ما تحتاجه لإدارة <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-800">محادثاتك بذكاء</span>
          </h3>
          <p className="text-gray-500 text-lg md:text-xl leading-relaxed">
            نقدم لك أدوات قوية لتحويل الواتساب إلى قناة مبيعات ودعم فني متكاملة تعمل من أجلك تلقائياً.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Bento Grid Item: 24/7 Availability (Large) */}
          <div className="md:col-span-2 bg-white rounded-[32px] p-8 md:p-12 border border-gray-100 shadow-xl shadow-green-900/5 hover:shadow-2xl hover:shadow-green-900/10 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-green-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8">
              <div className="flex-1 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500">
                  <Clock className="w-7 h-7" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900">متاح لعملائك 24/7</h4>
                <p className="text-gray-500 leading-relaxed text-lg">
                  لا تفوت أي عميل محتمل. مساعدك الذكي يعمل على مدار الساعة للرد على الاستفسارات، حجز المواعيد، وإتمام المبيعات حتى وأنت نائم.
                </p>
              </div>
              {/* Visual Representation */}
              <div className="w-full md:w-1/3 bg-gray-50 rounded-2xl p-4 border border-gray-100 shadow-inner">
                <div className="space-y-3">
                  <div className="flex justify-end">
                    <div className="bg-green-100 text-green-800 text-xs py-1 px-3 rounded-tr-none rounded-lg max-w-[90%]">مرحباً، هل المحل مفتوح الآن؟ <span className="block text-[9px] opacity-70 mt-1">02:30 AM</span></div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 text-gray-800 text-xs py-2 px-3 rounded-tl-none rounded-lg shadow-sm max-w-[90%]">
                      <span className="flex items-center gap-1 font-bold text-green-600 mb-1"><Zap className="w-3 h-3" /> رد تلقائي</span>
                      أهلاً بك! نعم، متجرنا الإلكتروني متاح 24 ساعة. تفضل الرابط...
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bento Grid Item: Instant Response */}
          <div className="md:col-span-1 bg-gradient-to-br from-[#105D3B] to-[#0A4028] rounded-[32px] p-8 md:p-10 text-white shadow-xl shadow-green-900/20 hover:-translate-y-2 transition-transform duration-300 group overflow-hidden relative">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6 text-green-300" />
                </div>
                <h4 className="text-xl font-bold mb-3">سرعة استجابة فائقة</h4>
                <p className="text-green-100/80 leading-relaxed text-sm">
                  أسرع بـ 100 مرة من البشر. استجابة فورية تزيد من رضا العملاء ومعدلات التحويل.
                </p>
              </div>
              <div className="mt-8 flex items-end justify-between border-t border-white/10 pt-6">
                <div>
                  <span className="block text-3xl font-bold text-white mb-1">0.1s</span>
                  <span className="text-xs text-green-200">زمن الاستجابة</span>
                </div>
                <BarChart className="w-10 h-10 text-green-400 opacity-50" />
              </div>
            </div>
          </div>

          {/* Bento Grid Item: Natural Language */}
          <div className="md:col-span-1 bg-white rounded-[32px] p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-green-50 text-[#105D3B] flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">يفهم اللهجات</h4>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              تخاطب مع عملائك بلهجتهم المحلية. نموذجنا مدرب لفهم والرد باللهجة السعودية، المصرية، والخليجية بدقة عالية.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-gray-50 border border-gray-100 px-2 py-1 rounded-md text-gray-600">هلا بك</span>
              <span className="text-xs bg-gray-50 border border-gray-100 px-2 py-1 rounded-md text-gray-600">يا هلا</span>
              <span className="text-xs bg-gray-50 border border-gray-100 px-2 py-1 rounded-md text-gray-600">أبشر</span>
            </div>
          </div>

          {/* Bento Grid Item: WhatsApp Integration */}
          <div className="md:col-span-1 bg-white rounded-[32px] p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
              <img src="/icons/whatsapp.svg" alt="WhatsApp" className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">تكامل واتساب رسمي</h4>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              نستخدم واجهة برمجة تطبيقات واتساب الرسمية (API) لضمان موثوقية 100%، عدم الحظر، وتوثيق حسابك بالعلامة الخضراء.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-green-600 cursor-pointer hover:underline">
              معرفة المزيد <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Bento Grid Item: Website Widget */}
          <div className="md:col-span-1 bg-white rounded-[32px] p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">ويدجت للموقع</h4>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              أضف شات بوت ذكي لموقعك الإلكتروني بسهولة. كود بسيط ويصبح لديك موظف مبيعات يرحب بزوّار موقعك.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-orange-50 text-orange-600 px-2 py-1 rounded-md border border-orange-100 font-bold">جديد 🔥</span>
            </div>
          </div>

          {/* Bento Grid Item: Security */}
          <div className="md:col-span-1 bg-white rounded-[32px] p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">أمان المؤسسات</h4>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              بياناتك مشفرة بالكامل. نحن نلتزم بأعلى معايير الأمان وخصوصية البيانات لضمان راحة بالك.
            </p>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-full bg-emerald-500 rounded-full animate-pulse"></div>
              </div>
              <span className="text-[10px] font-bold text-emerald-600">آمن 100%</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
