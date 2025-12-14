"use client";

import { Header } from "@/components/dashboard/header";
import { Search, Filter, Download, X, MessageSquare, Phone, Mail, Globe, Clock, User, Send } from "lucide-react";
import { useState } from "react";

export default function CompaniesPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);

  return (
    <>
      <Header />
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">العملاء</h1>
        <p className="text-gray-500">إدارة قائمة العملاء وحالات التواصل.</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden relative">
        {/* Toolbar */}
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between">
           <div className="relative w-full md:w-96">
                <input 
                  type="text" 
                  placeholder="بحث عن عميل..." 
                  className="w-full pl-4 pr-10 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary"
                />
                 <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
           </div>
           <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                    <Filter className="w-4 h-4" /> تصفية
                </button>
                 <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                    <Download className="w-4 h-4" /> تصدير
                </button>
           </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
            <table className="w-full text-right">
                <thead className="bg-gray-50 text-gray-500 text-sm">
                    <tr>
                        <th className="px-6 py-4 font-medium">العميل</th>
                        <th className="px-6 py-4 font-medium">رقم الهاتف</th>
                        <th className="px-6 py-4 font-medium">الحالة</th>
                        <th className="px-6 py-4 font-medium">آخر تفاعل</th>
                        <th className="px-6 py-4 font-medium"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                        {'ABC'[i%3]}
                                    </div>
                                    <span className="font-medium text-gray-900">شركة المثال {i}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-gray-600" dir="ltr text-right">+966 50 123 4567</td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    نشط
                                </span>
                            </td>
                            <td className="px-6 py-4 text-gray-500 text-sm">منذ ساعتين</td>
                            <td className="px-6 py-4">
                                <button 
                                    onClick={() => setSelectedCustomer(i)}
                                    className="text-primary hover:text-primary/80 font-medium text-sm"
                                >
                                    عرض التفاصيل
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        
         {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            <span>عرض 1 إلى 5 من أصل 24 عميل</span>
            <div className="flex items-center gap-2">
                <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>السابق</button>
                <button className="px-3 py-1 bg-primary text-white rounded-lg">1</button>
                <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50">2</button>
                <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50">3</button>
                <span>...</span>
                <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50">التالي</button>
            </div>
        </div>

        {/* Customer Drawer Overlay */}
        {selectedCustomer && (
            <div className="fixed inset-0 z-50 flex justify-end">
                {/* Backdrop */}
                <div 
                    className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
                    onClick={() => setSelectedCustomer(null)}
                ></div>
                
                {/* Drawer Content */}
                <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col">
                    {/* Drawer Header */}
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <User className="w-5 h-5 text-gray-500" />
                            تفاصيل العميل - شركة المثال {selectedCustomer}
                        </h2>
                        <button 
                            onClick={() => setSelectedCustomer(null)}
                            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Drawer Body - Split View */}
                    <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                        {/* Profile Info (Left Side in RTL) */}
                        <div className="w-full md:w-1/3 border-l border-gray-100 p-6 overflow-y-auto bg-gray-50/30">
                            <div className="text-center mb-6">
                                <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3">
                                    {'ABC'[selectedCustomer%3]}
                                </div>
                                <h3 className="font-bold text-gray-900">شركة المثال {selectedCustomer}</h3>
                                <p className="text-sm text-gray-500">عميل نشط</p>
                            </div>

                            <div className="space-y-4 text-sm">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Phone className="w-4 h-4" />
                                    <span dir="ltr">+966 50 123 4567</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Mail className="w-4 h-4" />
                                    <span>info@example.com</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Globe className="w-4 h-4" />
                                    <span>www.website.com</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Clock className="w-4 h-4" />
                                    <span>توقيت الرياض (GMT+3)</span>
                                </div>
                            </div>
                            
                            <hr className="my-6 border-gray-200"/>
                            
                            <div className="space-y-2">
                                <h4 className="font-semibold text-xs text-gray-400 uppercase">الملاحظات</h4>
                                <p className="text-sm text-gray-600 leading-relaxed bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                                    عميل مهتم جداً بخدمة الرد الآلي، يفضل التواصل في الفترة الصباحية.
                                </p>
                            </div>
                        </div>

                        {/* Chat History (Right Side) */}
                        <div className="flex-1 flex flex-col bg-white">
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
                                <h3 className="font-bold flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4 text-primary" />
                                    سجل المحادثات
                                </h3>
                                <div className="text-xs text-gray-400">آخر تحديث: الآن</div>
                            </div>
                            
                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                                <div className="flex justify-center my-4">
                                    <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">اليوم</span>
                                </div>
                                
                                {/* User Message */}
                                <div className="flex gap-3 flex-row-reverse">
                                    <div className="flex-1 bg-white p-3 rounded-2xl rounded-tr-none shadow-sm border border-gray-100 text-sm">
                                        <p className="text-gray-800">مرحباً، هل يمكنني معرفة أوقات العمل؟</p>
                                        <div className="text-[10px] text-gray-400 mt-1 text-right">09:15 AM</div>
                                    </div>
                                </div>

                                {/* Bot Message */}
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                                        <span className="text-white text-xs">AI</span>
                                    </div>
                                    <div className="flex-1 bg-primary/5 p-3 rounded-2xl rounded-tl-none text-sm text-gray-800">
                                        <p>أهلاً بك! نحن نعمل يومياً من الساعة 9 صباحاً حتى 5 مساءً بتوقيت الرياض. كيف يمكنني مساعدتك أيضاً؟</p>
                                        <div className="text-[10px] text-gray-400 mt-1">09:15 AM</div>
                                    </div>
                                </div>

                                {/* User Message */}
                                <div className="flex gap-3 flex-row-reverse">
                                    <div className="flex-1 bg-white p-3 rounded-2xl rounded-tr-none shadow-sm border border-gray-100 text-sm">
                                        <p className="text-gray-800">شكراً لك، هذا كل شيء.</p>
                                        <div className="text-[10px] text-gray-400 mt-1 text-right">09:16 AM</div>
                                    </div>
                                </div>
                            </div>

                            {/* Manual Reply Input (Optional) */}
                            <div className="p-4 border-t border-gray-100 bg-white">
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        placeholder="إرسال رد يدوي (تدخل بشري)..." 
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-primary text-sm"
                                    />
                                    <button className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </>
  );
}
