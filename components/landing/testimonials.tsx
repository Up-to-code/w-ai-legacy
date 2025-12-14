import { Star } from "lucide-react";

const testimonials = [
  {
    name: "أحمد العتيبي",
    role: "مدير مبيعات عقارية",
    content: "منذ استخدامنا لـ W-AI، زادت نسبة إغلاق الصفقات لدينا بمقدار 40%. الرد الفوري على العملاء يصنع فرقاً هائلاً.",
    image: "A",
  },
  {
    name: "سارة محمد",
    role: "صاحبة متجر إلكتروني",
    content: "أفضل استثمار لمتجري. البوت يرد على مئات الاستفسارات يومياً بدقة، مما وفر علي تكلفة توظيف فريق دعم كامل.",
    image: "S",
  },
  {
    name: "خالد الدوسري",
    role: "رئيس قسم التسويق",
    content: "سهولة الإعداد مدهشة. كنا نعمل في غضون دقائق، والنتائج كانت فورية. العملاء سعداء جداً بسرعة التجاوب.",
    image: "K",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-gray-50" dir="rtl" id="testimonials">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            ماذا يقول عملاؤنا؟
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            انضم إلى مئات الشركات التي تثق في W-AI لتحسين تجربة عملائها وزيادة مبيعاتها.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                "{t.content}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-lg">
                  {t.image}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{t.name}</h4>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
