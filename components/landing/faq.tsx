"use client";
import { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "هل أحتاج لمهارات برمجية لاستخدام W-AI؟",
    answer: "لا، تم تصميم W-AI ليكون سهل الاستخدام للجميع. يمكنك إعداد المساعد الذكي الخاص بك في دقائق معدودة دون كتابة أي كود.",
  },
  {
    question: "هل يمكنني تجربة الخدمة قبل الاشتراك؟",
    answer: "نعم، نقدم باقة مجانية تتيح لك تجربة الميزات الأساسية والتأكد من فعاليتها لنشاطك التجاري.",
  },
  {
    question: "هل يدعم W-AI اللغة العربية؟",
    answer: "بالطبع! W-AI مصمم خصيصاً لدعم اللغة العربية بدقة عالية، بما في ذلك اللهجات المحلية المختلفة.",
  },
  {
    question: "كيف يتم التعامل مع خصوصية البيانات؟",
    answer: "نحن نولي أمان البيانات أولوية قصوى. جميع المحادثات والبيانات مشفرة ولا يتم مشاركتها مع أي طرف ثالث.",
  },
  {
    question: "هل يمكنني إلغاء اشتراكي في أي وقت؟",
    answer: "نعم، يمكنك إلغاء اشتراكي أو تغييره في أي وقت من خلال لوحة التحكم الخاصة بك دون أي قيود.",
  },
  {
    question: "هل يمكنني ربط W-AI مع متجر سلة وزد؟",
    answer: "نعم، نوفر تكاملاً مباشراً وسلساً مع منصات التجارة الإلكترونية مثل سلة وزد وشوبيفاي لادارة طلباتك وتحديثات المخزون.",
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-white relative overflow-hidden" dir="rtl" id="faq">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_10%_20%,rgba(16,93,59,0.03),rgba(255,255,255,0))]" />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-green-50 rounded-2xl mb-6">
            <HelpCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            الأسئلة الشائعة
          </h2>
          <p className="text-gray-500 text-lg">
            إليك إجابات على أكثر الأسئلة تكراراً التي تصلنا. لم تجد إجابتك؟ تواصل معنا.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${openIndex === index
                  ? "border-green-200 shadow-lg shadow-green-900/5 ring-1 ring-green-100"
                  : "border-gray-100 hover:border-green-100 hover:bg-gray-50/50"
                }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-right"
              >
                <span className={`font-bold text-lg transition-colors ${openIndex === index ? "text-green-700" : "text-gray-900"}`}>
                  {faq.question}
                </span>
                <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${openIndex === index ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                  {openIndex === index ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </span>
              </button>

              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${openIndex === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                  }`}
              >
                <p className="px-6 pb-6 text-gray-600 leading-relaxed text-lg border-t border-gray-50 pt-4">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
