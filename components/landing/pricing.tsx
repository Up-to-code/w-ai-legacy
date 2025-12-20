import { Check, Sparkles } from "lucide-react";

const plans = [
  {
    name: "البداية",
    price: "0",
    currency: "ر.س",
    period: "/شهرياً",
    description: "للأفراد والشركات الصغيرة التي تبدأ رحلتها.",
    features: [
      "100 محادثة شهرياً",
      "ردود آلية أساسية",
      "دعم فني عبر البريد الإلكتروني",
      "قالب واحد للردود",
      "علامة W-AI المائية",
    ],
    cta: "ابدأ مجاناً",
    highlighted: false,
    buttonVariant: "outline"
  },
  {
    name: "المحترفين",
    price: "199",
    currency: "ر.س",
    period: "/شهرياً",
    description: "للشركات التي تحتاج إلى نمو سريع وأدوات متقدمة.",
    features: [
      "10,000 محادثة شهرياً",
      "ردود ذكية بالذكاء الاصطناعي",
      "دعم فني متقدم 24/7",
      "تحليلات وتقارير مفصلة",
      "5 قوالب للردود",
      "إزالة علامة W-AI",
    ],
    cta: "اشترك الآن",
    highlighted: true,
    buttonVariant: "primary"
  },
  {
    name: "الشركات",
    price: "مخصص",
    currency: "",
    period: "",
    description: "حلول مخصصة للشركات الكبيرة والمؤسسات.",
    features: [
      "محادثات غير محدودة",
      "تدريب خاص للذكاء الاصطناعي",
      "مدير حساب مخصص",
      "ربط مع أنظمة CRM مخصصة",
      "SLA ضمان مستوى الخدمة",
      "نشر على سيرفرات خاصة",
    ],
    cta: "تواصل معنا",
    highlighted: false,
    buttonVariant: "outline"
  },
];

export function Pricing() {
  return (
    <section className="py-24 relative overflow-hidden" dir="rtl" id="pricing">
      {/* Background Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-50/50 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold mb-4 border border-green-100 uppercase tracking-wider">
            باقات مرنة
          </div>
          <h3 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            استثمار ذكي <span className="text-green-600">لنمو أعمالك</span>
          </h3>
          <p className="text-gray-500 text-lg leading-relaxed">
            اختر الخطة المناسبة لحجم أعمالك. ابدأ مجاناً وقم بالترقية مع نمو مبيعاتك.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-[32px] p-8 transition-all duration-300 group ${plan.highlighted
                  ? "bg-gray-900 text-white shadow-2xl shadow-green-900/20 md:-mt-4 md:mb-4 z-10 hover:-translate-y-2"
                  : "bg-white border border-gray-100 hover:border-green-200 hover:shadow-xl hover:shadow-green-900/5 hover:-translate-y-1"
                }`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                  <Sparkles className="w-3 h-3 fill-current" /> الأكثر طلباً
                </div>
              )}

              <div className="mb-6">
                <h4 className={`text-xl font-bold mb-2 ${plan.highlighted ? "text-white" : "text-gray-900"}`}>{plan.name}</h4>
                <p className={`text-sm leading-relaxed min-h-[40px] ${plan.highlighted ? "text-gray-400" : "text-gray-500"}`}>{plan.description}</p>
              </div>

              <div className="mb-8 flex items-baseline gap-1">
                <span className={`text-5xl font-extrabold tracking-tight ${plan.highlighted ? "text-white" : "text-gray-900"}`}>{plan.price}</span>
                {plan.currency && <span className={`text-xl font-semibold ${plan.highlighted ? "text-gray-300" : "text-gray-900"}`}>{plan.currency}</span>}
                {plan.period && <span className={`text-sm font-medium ${plan.highlighted ? "text-gray-500" : "text-gray-500"}`}>{plan.period}</span>}
              </div>

              <ul className="space-y-4 mb-10">
                {plan.features.map((feature, i) => (
                  <li key={i} className={`flex items-start gap-3 text-sm ${plan.highlighted ? "text-gray-300" : "text-gray-700"}`}>
                    <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${plan.highlighted ? "bg-green-500/20 text-green-400" : "bg-green-50 text-green-600"}`}>
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </div>
                    <span className="leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 rounded-2xl font-bold text-base transition-all duration-200 ${plan.highlighted
                  ? "bg-green-600 text-white hover:bg-green-500 shadow-lg shadow-green-900/30 active:scale-95"
                  : "bg-gray-50 text-gray-900 hover:bg-green-50 hover:text-green-700 border border-transparent hover:border-green-200 active:scale-95"
                }`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
