import { Search, Book, MessageCircle, Mail } from "lucide-react";

export default function HelpPage() {
  return (
    <>
       <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl font-bold mb-4">كيف يمكننا مساعدتك؟</h1>
        <p className="text-gray-500 mb-8">ابحث في قاعدة المعرفة أو تواصل مع فريق الدعم الفني.</p>
        
        <div className="relative">
            <input 
                type="text" 
                placeholder="ابحث عن سؤالك هنا..." 
                className="w-full pl-4 pr-12 py-4 bg-white rounded-2xl border border-gray-200 shadow-sm focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-base"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
         <div className="bg-white p-6 rounded-3xl border border-gray-100 text-center hover:border-primary/30 transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Book className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">الدليل الشامل</h3>
            <p className="text-gray-500 text-sm">شرح مفصل لكافة مميزات المنصة وكيفية استخدامها.</p>
         </div>
         <div className="bg-white p-6 rounded-3xl border border-gray-100 text-center hover:border-primary/30 transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">المحادثة المباشرة</h3>
            <p className="text-gray-500 text-sm">تحدث مع أحد موظفي الدعم الفني لحل مشكلتك فوراً.</p>
         </div>
         <div className="bg-white p-6 rounded-3xl border border-gray-100 text-center hover:border-primary/30 transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">تذكرة دعم</h3>
            <p className="text-gray-500 text-sm">أرسل استفسارك عبر البريد الإلكتروني وسنرد عليك قريباً.</p>
         </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 p-8">
        <h3 className="text-xl font-bold mb-6">الأسئلة الشائعة</h3>
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                    <h4 className="font-semibold text-gray-900 mb-2 flex justify-between cursor-pointer hover:text-primary">
                        <span>كيف يمكنني ربط رقم الواتساب الخاص بي؟</span>
                        <span className="text-gray-400">+</span>
                    </h4>
                    <p className="text-gray-500 text-sm leading-relaxed hidden">
                        يمكنك ربط رقمك من خلال مسح رمز QR Code في إعدادات الربط. اذهب إلى الإعدادات &gt; التكامل &gt; واتساب.
                    </p>
                </div>
            ))}
        </div>
      </div>
    </>
  );
}
