import { MessageSquare, Clock, Zap, BarChart, Shield, Smartphone } from "lucide-react";

const features = [
  {
    icon: <Clock className="w-8 h-8 text-green-600" />,
    title: "متاح 24/7",
    description: "رد فوري على عملائك في أي وقت، حتى خارج ساعات العمل الرسمية.",
  },
  {
    icon: <Zap className="w-8 h-8 text-green-600" />,
    title: "سرعة استجابة فائقة",
    description: "لا تدع عملائك ينتظرون. W-AI يجيب على استفساراتهم في ثوانٍ.",
  },
  {
    icon: <MessageSquare className="w-8 h-8 text-green-600" />,
    title: "ردود ذكية وطبيعية",
    description: "تفاعل مع العملاء بأسلوب بشري سلس يفهم لهجاتهم واحتياجاتهم.",
  },
  {
    icon: <BarChart className="w-8 h-8 text-green-600" />,
    title: "تحليلات متقدمة",
    description: "احصل على رؤى دقيقة حول أداء المساعد الذكي وسلوك العملاء.",
  },
  {
    icon: <Smartphone className="w-8 h-8 text-green-600" />,
    title: "يعمل على الواتساب",
    description: "تواصل مع عملائك على التطبيق الذي يستخدمونه يومياً وبدون تحميل تطبيقات إضافية.",
  },
  {
    icon: <Shield className="w-8 h-8 text-green-600" />,
    title: "أمان وخصوصية",
    description: "بياناتك وبيانات عملائك مشفرة ومحمية وفق أعلى المعايير العالمية.",
  },
];

export function Features() {
  return (
    <section className="py-24 bg-white" dir="rtl" id="features">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-sm font-bold text-green-600 mb-2 tracking-wide uppercase">لماذا W-AI؟</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            كل ما تحتاجه لإدارة محادثاتك بذكاء
          </h3>
          <p className="text-gray-500 text-lg">
            نقدم لك أدوات قوية لتحويل الواتساب إلى قناة مبيعات ودعم فني متكاملة تعمل من أجلك تلقائياً.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-green-200 hover:shadow-lg hover:shadow-green-900/5 transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h4>
              <p className="text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
