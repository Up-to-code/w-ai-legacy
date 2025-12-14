"use client";

import { Header } from "@/components/dashboard/header";
import { Search, Filter, Download, Upload, Plus, MoreHorizontal, MessageSquare, Phone, Mail, User, X, Clock, Send, Globe } from "lucide-react";
import { useState } from "react";

export default function ContactsPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);

  return (
    <>
      <Header />
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">جهات الاتصال</h1>
           <p className="text-gray-500 text-sm mt-1">قائمة بجميع العملاء والمستخدمين المسجلين في المتجر.</p>
        </div>
        <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-all">
                <Upload className="w-4 h-4" /> استيراد
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-all">
                <Download className="w-4 h-4" /> تصدير
            </button>
            <button 
                onClick={() => setIsAddDrawerOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all"
            >
                <Plus className="w-4 h-4" /> إضافة عميل جديد
            </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden relative">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between bg-white">
           <div className="relative w-full md:w-96">
                <input 
                  type="text" 
                  placeholder="بحث بالاسم، الرقم، أو البريد..." 
                  className="w-full pl-4 pr-10 py-2.5 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                />
                 <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
           </div>
           <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">
                    <Filter className="w-4 h-4" /> تصفية
                </button>
           </div>
        </div>

        {/* Salla-Style Table */}
        <div className="overflow-x-auto">
            <table className="w-full text-right">
                <thead className="bg-[#fcfcfc] text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                    <tr>
                        <th className="px-6 py-4 font-medium w-12 text-center">
                            <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                        </th>
                        <th className="px-6 py-4 font-medium">العميل</th>
                        <th className="px-6 py-4 font-medium">معلومات الاتصال</th>
                        <th className="px-6 py-4 font-medium">الوسوم (Tags)</th>
                        <th className="px-6 py-4 font-medium">عدد الطلبات</th>
                        <th className="px-6 py-4 font-medium">آخر نشاط</th>
                        <th className="px-6 py-4 font-medium"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <tr key={i} className="hover:bg-blue-50/30 transition-colors group">
                             <td className="px-6 py-4 text-center">
                                <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-sm border border-gray-200">
                                        {'ABCD'[i%4]}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">محمد أحمد {i}</p>
                                        <p className="text-xs text-gray-400">عميل جديد</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm text-gray-700 font-medium" dir="ltr">+966 50 123 45{i}</span>
                                    <span className="text-xs text-gray-400">test{i}@example.com</span>
                                </div>
                            </td>
                             <td className="px-6 py-4">
                                <div className="flex gap-1 flex-wrap">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                        VIP
                                    </span>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-green-50 text-green-700 border border-green-100">
                                        واتساب
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                {i * 3} طلبات
                            </td>
                            <td className="px-6 py-4 text-gray-500 text-xs">قبل {i} ساعات</td>
                            <td className="px-6 py-4">
                                <button 
                                    onClick={() => setSelectedCustomer(i)}
                                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                >
                                    عرض
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        
         {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 bg-gray-50/50">
            <span>عرض 1 إلى 6 من أصل 128 عميل</span>
            <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 border border-gray-200 rounded-md hover:bg-white disabled:opacity-50 transition-colors" disabled>السابق</button>
                <button className="px-3 py-1.5 border border-gray-200 bg-white shadow-sm rounded-md font-bold text-primary">1</button>
                <button className="px-3 py-1.5 border border-gray-200 rounded-md hover:bg-white transition-colors">2</button>
                <button className="px-3 py-1.5 border border-gray-200 rounded-md hover:bg-white transition-colors">3</button>
                <span>...</span>
                <button className="px-3 py-1.5 border border-gray-200 rounded-md hover:bg-white transition-colors">التالي</button>
            </div>
        </div>

        {/* Add Customer Drawer (Slide-over) */}
        {isAddDrawerOpen && (
             <div className="fixed inset-0 z-50 flex justify-end">
                <div 
                    className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
                    onClick={() => setIsAddDrawerOpen(false)}
                ></div>
                <div className="relative w-full max-w-md bg-white h-full shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col">
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-lg font-bold">إضافة عميل جديد</h2>
                        <button onClick={() => setIsAddDrawerOpen(false)} className="text-gray-400 hover:text-gray-600">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="p-6 space-y-4 overflow-y-auto flex-1">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">اسم العميل</label>
                            <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="الاسم الأول والأخير" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف (واتساب)</label>
                            <input type="tel" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none text-left" placeholder="+966..." dir="ltr" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                            <input type="email" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none text-left" placeholder="example@mail.com" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">الوسوم (Tags)</label>
                            <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                                <option>عميل VIP</option>
                                <option>عميل جديد</option>
                                <option>استفسار عام</option>
                            </select>
                        </div>
                    </div>
                    <div className="p-5 border-t border-gray-100 bg-gray-50 flex gap-3">
                         <button className="flex-1 bg-primary text-white py-2.5 rounded-lg font-bold hover:bg-primary/90 transition-colors">حفظ العميل</button>
                         <button onClick={() => setIsAddDrawerOpen(false)} className="flex-1 bg-white border border-gray-200 text-gray-700 py-2.5 rounded-lg font-bold hover:bg-gray-50 transition-colors">إلغاء</button>
                    </div>
                </div>
             </div>
        )}

        {/* Existing View Customer Drawer */}
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
                            تفاصيل العميل - محمد أحمد {selectedCustomer}
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
                                    {'ABCD'[selectedCustomer%4]}
                                </div>
                                <h3 className="font-bold text-gray-900">محمد أحمد {selectedCustomer}</h3>
                                <p className="text-sm text-gray-500">عميل نشط</p>
                            </div>

                            <div className="space-y-4 text-sm">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Phone className="w-4 h-4" />
                                    <span dir="ltr">+966 50 123 45{selectedCustomer}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Mail className="w-4 h-4" />
                                    <span>test{selectedCustomer}@example.com</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Globe className="w-4 h-4" />
                                    <span>-</span>
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
                                    عميل مهتم بمنتجات التجميل.
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
                                        <p className="text-gray-800">مرحباً، تفاصيل الطلب؟</p>
                                        <div className="text-[10px] text-gray-400 mt-1 text-right">09:15 AM</div>
                                    </div>
                                </div>

                                {/* Bot Message */}
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                                        <span className="text-white text-xs">AI</span>
                                    </div>
                                    <div className="flex-1 bg-primary/5 p-3 rounded-2xl rounded-tl-none text-sm text-gray-800">
                                        <p>أهلاً بك! طلبك قيد التحضير.</p>
                                        <div className="text-[10px] text-gray-400 mt-1">09:15 AM</div>
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
