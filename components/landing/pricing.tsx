import { Check, X } from "lucide-react";

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
    cta: "اطلب عرض سعر",
    highlighted: false,
    buttonVariant: "outline"
  },
];

export function Pricing() {
  return (
    <section className="py-24 bg-gray-50/50" dir="rtl" id="pricing">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-sm font-bold text-green-600 mb-2 tracking-wide uppercase">الأسعار</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            خطط مرنة تناسب طموحك
          </h3>
          <p className="text-gray-500 text-lg leading-relaxed">
            ابدأ مجاناً اليوم، وقم بالترقية عندما تحتاج إلى المزيد. لا توجد رسوم خفية أو عقود طويلة الأجل.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative rounded-3xl p-8 transition-all duration-300 ${
                plan.highlighted 
                  ? "bg-white shadow-[0_20px_40px_-15px_rgba(16,93,59,0.2)] border-2 border-[#105D3B] md:-mt-8 md:mb-8 z-10 scale-105" 
                  : "bg-white border border-gray-100 hover:border-green-100 hover:shadow-lg"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#105D3B] text-white text-sm font-bold px-6 py-2 rounded-full shadow-lg">
                  الأكثر طلباً 🔥
                </div>
              )}
              
              <div className="mb-8">
                <h4 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h4>
                <p className="text-gray-500 text-sm leading-relaxed min-h-[40px]">{plan.description}</p>
              </div>
              
              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-5xl font-extrabold text-gray-900 tracking-tight">{plan.price}</span>
                {plan.currency && <span className="text-xl font-semibold text-gray-900">{plan.currency}</span>}
                {plan.period && <span className="text-gray-500 text-sm font-medium">{plan.period}</span>}
              </div>
              
              <ul className="space-y-4 mb-10">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                    <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${plan.highlighted ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        <Check className="w-3 h-3" strokeWidth={3} />
                    </div>
                    <span className="leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-200 ${
                plan.highlighted 
                  ? "bg-[#105D3B] text-white hover:bg-[#0d4f32] shadow-lg shadow-green-900/10 hover:shadow-green-900/20 active:scale-95" 
                  : "bg-white text-gray-900 border-2 border-gray-100 hover:border-[#105D3B] hover:text-[#105D3B] active:scale-95"
              }`}>
                {plan.cta}
              </button>
              
              {plan.price === "0" && (
                <p className="text-xs text-center text-gray-400 mt-4">لا تحتاج لبطاقة ائتمانية</p>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
            <p className="text-gray-500 text-sm">
                هل لديك متطلبات خاصة؟ <a href="mailto:sales@w-ai.com" className="text-[#105D3B] font-semibold hover:underline">تواصل مع فريق المبيعات</a>
            </p>
        </div>
      </div>
    </section>
  );
}
