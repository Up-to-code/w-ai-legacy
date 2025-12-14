"use client";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

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
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-gray-50" dir="rtl" id="faq">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            الأسئلة الشائعة
          </h2>
          <p className="text-gray-500">
            أجوبة على أكثر الأسئلة تكراراً حول منصة W-AI.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-right hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900">{faq.question}</span>
                {openIndex === index ? (
                  <Minus className="w-5 h-5 text-green-600 flex-shrink-0" />
                ) : (
                  <Plus className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openIndex === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="px-6 pb-6 text-gray-600 leading-relaxed">
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
