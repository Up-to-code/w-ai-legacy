import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function Integrations() {
    return (
        <section className="py-24 bg-gray-50 relative overflow-hidden" id="integrations">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Content */}
                    <div className="order-2 lg:order-1">
                        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold mb-6 border border-green-100">
                            تكامل شامل
                        </div>
                        <h3 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                            اربط متجرك المفضل <br />
                            <span className="text-[#105D3B]">بضغطة زر واحدة</span>
                        </h3>
                        <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                            W-AI متكامل بشكل مباشر مع منصات التجارة الإلكترونية الرائدة في المنطقة. استورد منتجاتك، عملائك، وطلباتك تلقائياً وبدون أي تعقيد تقني.
                        </p>

                        <ul className="space-y-4 mb-10">
                            <li className="flex items-center gap-3 text-gray-700">
                                <CheckCircle2 className="w-5 h-5 text-[#105D3B]" />
                                <span>مزامنة المخزون والأسعار لحظياً</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-700">
                                <CheckCircle2 className="w-5 h-5 text-[#105D3B]" />
                                <span>تحديث حالات الطلب وإرسال التنبيهات</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-700">
                                <CheckCircle2 className="w-5 h-5 text-[#105D3B]" />
                                <span>الرد على استفسارات المنتجات بذكاء</span>
                            </li>
                        </ul>

                        <div className="flex flex-wrap gap-4">
                            <Link href="/register" className="bg-[#105D3B] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#0d4f32] transition-colors flex items-center gap-2 shadow-lg shadow-green-900/20">
                                اربط متجرك الآن <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Visuals */}
                    <div className="order-1 lg:order-2 relative">
                        <div className="absolute inset-0 bg-green-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>

                        <div className="relative bg-white rounded-[32px] p-8 md:p-12 shadow-2xl border border-gray-100 text-center">
                            <p className="text-gray-400 text-sm mb-8 font-medium">شركاء النجاح</p>

                            <div className="grid grid-cols-2 gap-8 items-center justify-items-center">
                                {/* Salla and WhatsApp Logos */}
                                <div className="col-span-2 flex justify-center gap-6 w-full">
                                    {/* Salla */}
                                    <div className="flex-1 max-w-[160px] grayscale-0 transition-all duration-300 hover:scale-105 p-6 bg-gray-50 rounded-2xl border border-gray-100 group cursor-pointer flex flex-col items-center">
                                        <img
                                            src="/icons/salla.svg"
                                            alt="Salla"
                                            className="w-16 h-16 group-hover:drop-shadow-md transition-all"
                                        />
                                        <span className="block mt-4 text-xs font-bold text-green-600 opacity-0 group-hover:opacity-100 transition-opacity">شريك استراتيجي</span>
                                    </div>

                                    {/* WhatsApp */}
                                    <div className="flex-1 max-w-[160px] grayscale-0 transition-all duration-300 hover:scale-105 p-6 bg-gray-50 rounded-2xl border border-gray-100 group cursor-pointer flex flex-col items-center">
                                        <img
                                            src="/icons/whatsapp.svg"
                                            alt="WhatsApp"
                                            className="w-16 h-16 group-hover:drop-shadow-md transition-all"
                                        />
                                        <span className="block mt-4 text-xs font-bold text-[#25D366] opacity-0 group-hover:opacity-100 transition-opacity">تكامل رسمي</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
