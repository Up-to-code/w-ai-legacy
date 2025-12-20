"use client";

import Link from "next/link";
import { PlayCircle, Bot, ArrowLeft, MoreVertical, Plus, Mic, Camera, Smile, Sparkles, Zap, Shield, MessageCircle, BarChart3, Users, Settings, Search, Bell, Home, PieChart } from "lucide-react";
import { useState, useEffect } from "react";

const words = [
    "أقوى موظف مبيعات",
    "نظام حجز آلي",
    "مركز خدمة عملاء",
    "سكرتير ذكي"
];

export function Hero() {
    const [index, setIndex] = useState(0);
    const [fade, setFade] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(true); // Start fade out
            setTimeout(() => {
                setIndex((prev) => (prev + 1) % words.length);
                setFade(false); // Start fade in
            }, 500); // Wait for fade out
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="pt-32 pb-40 px-6 md:px-12 relative z-10 overflow-hidden" dir="rtl">

            {/* Background Spotlights */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] -z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[500px] bg-[#105D3B]/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-7xl mx-auto flex flex-col items-center text-center">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border border-green-100 px-4 py-2 rounded-full text-sm font-semibold text-green-800 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700 mb-8">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    الذكاء الاصطناعي وصل إلى الواتساب 🚀
                </div>

                {/* Main Heading */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-gray-900 leading-[1.1] mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 max-w-5xl">
                    حوّل واتسابك إلى <br />
                    <span className="relative inline-block text-[#105D3B]">
                        <span className={`absolute left-0 right-0 transition-all duration-500 ${fade ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                            {words[index]}
                        </span>
                        <span className="opacity-0">{words[0]}</span> {/* Spacer */}
                    </span>
                </h1>

                {/* Subheading */}
                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                    أتمتة كاملة لمحادثاتك التجارية. دع الذكاء الاصطناعي يتولى المبيعات، الحجوزات، وخدمة العملاء 24/7 بينما تركز أنت على النمو.
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-24 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300 relative z-20">
                    <Link href="/register" className="w-full sm:w-auto bg-[#105D3B] text-white px-10 py-5 rounded-2xl text-xl font-bold hover:bg-[#0d4f32] transition-all shadow-xl shadow-green-900/20 transform hover:-translate-y-1 flex items-center justify-center gap-3">
                        <Zap className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                        ابدأ تجربتك المجانية
                    </Link>
                    <button className="w-full sm:w-auto bg-white text-gray-700 border border-gray-200 px-10 py-5 rounded-2xl text-xl font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
                        <PlayCircle className="w-6 h-6 text-gray-400" /> مشاهدة الديمو
                    </button>
                </div>


                {/* HERO VISUAL COMPOSITION */}
                <div className="relative w-full max-w-[1100px] h-[600px] perspective-1000 animate-in fade-in zoom-in-50 duration-1000 delay-500">

                    {/* 1. LAYER ONE: DASHBOARD BACKDROP */}
                    <div className="absolute top-10 left-0 right-0 bottom-0 bg-white rounded-t-[40px] shadow-2xl border border-gray-200/60 overflow-hidden transform rotate-x-12 opacity-90 scale-95 origin-bottom translate-y-6">
                        {/* Fake Dashboard Header */}
                        <div className="h-16 border-b border-gray-100 flex items-center justify-between px-6 bg-white/50 backdrop-blur-sm">
                            <div className="flex items-center gap-2 text-gray-400">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            </div>
                            <div className="w-1/3 h-8 bg-gray-50 rounded-full flex items-center px-4 gap-2">
                                <Search className="w-4 h-4 text-gray-300" />
                            </div>
                            <div className="flex items-center gap-4">
                                <Bell className="w-5 h-5 text-gray-400" />
                                <div className="w-8 h-8 rounded-full bg-green-100"></div>
                            </div>
                        </div>

                        <div className="flex h-full">
                            {/* Fake Sidebar */}
                            <div className="w-20 md:w-64 border-l border-gray-100 p-6 space-y-4 bg-gray-50/30">
                                <div className="flex items-center gap-3 text-[#105D3B] bg-green-50 p-3 rounded-xl font-bold">
                                    <Home className="w-5 h-5" /> <span className="hidden md:inline">الرئيسية</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-500 p-3 rounded-xl">
                                    <MessageCircle className="w-5 h-5" /> <span className="hidden md:inline">المحادثات</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-500 p-3 rounded-xl">
                                    <Users className="w-5 h-5" /> <span className="hidden md:inline">العملاء</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-500 p-3 rounded-xl">
                                    <BarChart3 className="w-5 h-5" /> <span className="hidden md:inline">التقارير</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-500 p-3 rounded-xl">
                                    <Settings className="w-5 h-5" /> <span className="hidden md:inline">الإعدادات</span>
                                </div>
                            </div>

                            {/* Fake Main Content */}
                            <div className="flex-1 p-8 bg-[#F9FAFB]/50">
                                <div className="grid grid-cols-3 gap-6 mb-8">
                                    <div className="h-32 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                                        <div className="w-8 h-8 bg-green-100 rounded-lg mb-4"></div>
                                        <div className="h-2 w-16 bg-gray-100 rounded mb-2"></div>
                                        <div className="h-6 w-24 bg-gray-200 rounded"></div>
                                    </div>
                                    <div className="h-32 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg mb-4"></div>
                                        <div className="h-2 w-16 bg-gray-100 rounded mb-2"></div>
                                        <div className="h-6 w-24 bg-gray-200 rounded"></div>
                                    </div>
                                    <div className="h-32 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                                        <div className="w-8 h-8 bg-orange-100 rounded-lg mb-4"></div>
                                        <div className="h-2 w-16 bg-gray-100 rounded mb-2"></div>
                                        <div className="h-6 w-24 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                                <div className="h-64 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
                                    <div className="h-4 w-1/4 bg-gray-100 rounded"></div>
                                    <div className="flex-1 bg-gray-50/50 rounded-xl relative flex items-end justify-between p-4 gap-2">
                                        <div className="w-full bg-green-200/50 rounded-t-lg h-[40%]"></div>
                                        <div className="w-full bg-green-200/50 rounded-t-lg h-[60%]"></div>
                                        <div className="w-full bg-green-200/50 rounded-t-lg h-[30%]"></div>
                                        <div className="w-full bg-green-200/50 rounded-t-lg h-[80%]"></div>
                                        <div className="w-full bg-[#105D3B] rounded-t-lg h-[90%] shadow-lg shadow-green-900/20"></div>
                                        <div className="w-full bg-green-200/50 rounded-t-lg h-[50%]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Overlay Gradient to fade bottom */}
                        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white to-transparent"></div>
                    </div>


                    {/* 2. LAYER TWO: PHONE MOCKUP (Floating Center) */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 w-[320px] md:w-[360px] transform hover:-translate-y-4 hover:scale-105 transition-all duration-700">

                        {/* Floating Badges (Relative to Phone) */}
                        <div className="absolute top-[20%] -right-16 z-30 bg-white p-4 rounded-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1)] border border-gray-100 hidden md:block animate-bounce delay-700 duration-[3000ms]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                    <MessageCircle className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">تم الرد</p>
                                    <p className="font-bold text-gray-900">0.1 ثانية ⚡️</p>
                                </div>
                            </div>
                        </div>

                        <div className="absolute bottom-[20%] -left-16 z-30 bg-white p-4 rounded-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1)] border border-gray-100 hidden md:block animate-bounce delay-1000 duration-[4000ms]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">حالة النظام</p>
                                    <p className="font-bold text-gray-900">نشط 24/7</p>
                                </div>
                            </div>
                        </div>


                        {/* Actual Phone */}
                        <div className="relative bg-gray-900 rounded-[55px] p-4 shadow-[0_50px_100px_-20px_rgba(16,93,59,0.4)] border-4 border-gray-800 ring-1 ring-gray-900/50">
                            {/* STATUS BAR & NOTCH */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-30"></div>

                            {/* SCREEN */}
                            <div className="w-full h-[650px] bg-[#EFEAE2] rounded-[45px] overflow-hidden relative flex flex-col">

                                {/* Header */}
                                <div className="bg-[#008069] text-white pt-12 pb-3 px-4 flex items-center justify-between shadow-sm relative z-10">
                                    <div className="flex items-center gap-3">
                                        <ArrowLeft className="w-5 h-5" />
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                                            <Bot className="w-6 h-6 text-[#008069]" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-base">مساعد المبيعات 🤖</h4>
                                            <p className="text-[11px] text-green-100">يرد عادة في الحال</p>
                                        </div>
                                    </div>
                                    <MoreVertical className="w-5 h-5" />
                                </div>

                                {/* Chat Area */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-6 font-sans text-sm relative" style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", backgroundBlendMode: "overlay" }}>

                                    <div className="flex justify-center my-2">
                                        <span className="bg-[#FFF]/90 shadow-sm px-3 py-1 rounded-lg text-[10px] text-gray-500 font-medium">اليوم</span>
                                    </div>

                                    {/* User Msg */}
                                    <div className="flex justify-end animate-in slide-in-from-right-4 fade-in duration-500">
                                        <div className="bg-[#E7FFDB] p-3 rounded-2xl rounded-tr-none shadow-sm max-w-[85%] text-gray-900">
                                            <p>مرحباً، أبي أعرف أسعار الاشتراكات عندكم؟ 📋</p>
                                            <div className="flex justify-end gap-1 mt-1 opacity-60">
                                                <span className="text-[10px]">10:00 AM</span>
                                                <span className="text-[#34B7F1]">✓✓</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bot Msg */}
                                    <div className="flex justify-start animate-in slide-in-from-left-4 fade-in duration-500 delay-300">
                                        <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[90%] text-gray-900">
                                            <p className="mb-2">أهلاً بك يا غالي! 👋 <br /> عندنا باقات تناسب الجميع، وتفضل هذه العروض الحصرية لك:</p>

                                            <div className="space-y-2">
                                                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 hover:border-green-200 transition-colors cursor-pointer">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="font-bold text-[#105D3B]">الباقة الأساسية</span>
                                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">شائع</span>
                                                    </div>
                                                    <p className="text-xs text-gray-500">محادثات لا محدودة + دعم فني</p>
                                                    <div className="mt-2 text-[#105D3B] font-bold text-sm">99 ر.س / شهر</div>
                                                </div>

                                                <div className="bg-[#105D3B]/5 p-3 rounded-xl border border-[#105D3B]/20 cursor-pointer">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="font-bold text-[#105D3B]">الباقة الاحترافية</span>
                                                        <Sparkles className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                                    </div>
                                                    <p className="text-xs text-gray-600">كل مميزات الأساسية + متجر إلكتروني</p>
                                                    <div className="mt-2 text-[#105D3B] font-bold text-sm">199 ر.س / شهر</div>
                                                </div>
                                            </div>

                                            <div className="flex justify-start gap-1 mt-2 opacity-60">
                                                <span className="text-[10px]">10:00 AM</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* User Msg */}
                                    <div className="flex justify-end animate-in slide-in-from-right-4 fade-in duration-500 delay-1000">
                                        <div className="bg-[#E7FFDB] p-3 rounded-2xl rounded-tr-none shadow-sm max-w-[85%] text-gray-900">
                                            <p>ممتاز، بشترك في الاحترافية! 🚀</p>
                                            <div className="flex justify-end gap-1 mt-1 opacity-60">
                                                <span className="text-[10px]">10:02 AM</span>
                                                <span className="text-[#34B7F1]">✓✓</span>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                {/* Footer Input */}
                                <div className="p-2 bg-[#f0f2f5] flex items-center gap-2">
                                    <Plus className="w-6 h-6 text-[#008069]" />
                                    <div className="flex-1 bg-white rounded-full h-9 px-4 flex items-center justify-between border border-white focus-within:border-[#008069]/50 transition-colors">
                                        <span className="text-gray-400 text-xs">اكتب رسالة...</span>
                                        <div className="flex gap-2 text-gray-400">
                                            <Smile className="w-4 h-4 cursor-pointer hover:text-gray-600" />
                                            <Camera className="w-4 h-4 cursor-pointer hover:text-gray-600" />
                                        </div>
                                    </div>
                                    <div className="w-9 h-9 rounded-full bg-[#008069] flex items-center justify-center text-white shadow-sm cursor-pointer hover:scale-105 transition-transform">
                                        <Mic className="w-4 h-4" />
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
