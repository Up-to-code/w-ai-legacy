import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "أحمد العتيبي",
    role: "مدير مبيعات عقارية",
    company: "عقارات المملكة",
    content: "منذ استخدامنا لـ W-AI، زادت نسبة إغلاق الصفقات لدينا بمقدار 40%. الرد الفوري على العملاء يصنع فرقاً هائلاً في مجال العقارات حيث السرعة هي كل شيء.",
    image: "https://ui-avatars.com/api/?name=Ahmed+Otibi&background=105d3b&color=fff",
  },
  {
    name: "سارة محمد",
    role: "CEO",
    company: "متجر تجميل",
    content: "أفضل استثمار لمتجري. البوت يرد على مئات الاستفسارات يومياً بدقة، مما وفر علي تكلفة توظيف فريق دعم كامل. أستطيع الآن التركيز على تطوير المنتجات.",
    image: "https://ui-avatars.com/api/?name=Sara+Mohammed&background=random&color=fff",
  },
  {
    name: "خالد الدوسري",
    role: "رئيس التسويق",
    company: "شركة تقنية",
    content: "سهولة الإعداد مدهشة. كنا نعمل في غضون دقائق، والنتائج كانت فورية. العملاء سعداء جداً بسرعة التجاوب، والتقارير ساعدتنا في فهم احتياجاتهم.",
    image: "https://ui-avatars.com/api/?name=Khalid+Dosari&background=random&color=fff",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-white relative overflow-hidden" dir="rtl" id="testimonials">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gray-50 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            قصص نجاح <span className="text-green-600">حقيقية</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            انضم إلى أكثر من 1000 شركة تستخدم W-AI لتحسين تجربة عملائها وزيادة مبيعاتها.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-gray-50 p-8 rounded-[32px] hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-xl hover:shadow-green-900/5 transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="flex gap-1 mb-8">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <div className="relative mb-8">
                <Quote className="absolute -top-4 -right-2 w-10 h-10 text-green-100 rotate-180 -z-10" />
                <p className="text-gray-600 leading-relaxed text-lg relative z-10">
                  "{t.content}"
                </p>
              </div>

              <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                />
                <div>
                  <h4 className="font-bold text-gray-900">{t.name}</h4>
                  <p className="text-xs text-green-600 font-medium">{t.role} - {t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
