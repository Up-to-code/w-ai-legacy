"use client";

import { Header } from "@/components/dashboard/header";
import { Send, Users, MessageSquare, Calendar, ChevronLeft, CheckCircle, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function CreateCampaignPage() {
  const [step, setStep] = useState(1);
  const [campaignType, setCampaignType] = useState('text');

  return (
    <>
      <Header />
      <div className="mb-8 flex items-center gap-4">
        <Link href="/dashboard/campaigns" className="p-2 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-primary transition-colors">
            <ChevronLeft className="w-5 h-5 rotate-180" />
        </Link>
        <div>
            <h1 className="text-3xl font-bold mb-1">حملة جديدة</h1>
            <p className="text-gray-500">أنشئ حملة رسائل جديدة في 3 خطوات بسيطة.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Steps Sidebar */}
        <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-gray-100 p-6 space-y-6">
                <StepItem step={1} currentStep={step} icon={MessageSquare} title="تفاصيل الحملة" description="الاسم والنوع" />
                <div className="w-0.5 h-6 bg-gray-100 mr-6"></div>
                <StepItem step={2} currentStep={step} icon={Users} title="الجمهور المستهدف" description="تحديد المستلمين" />
                <div className="w-0.5 h-6 bg-gray-100 mr-6"></div>
                <StepItem step={3} currentStep={step} icon={Calendar} title="المحتوى والجدولة" description="الرسالة والوقت" />
            </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-gray-100 p-8 min-h-[500px]">
                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-bottom-2">
                        <h2 className="text-xl font-bold mb-6">تفاصيل الحملة</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">اسم الحملة</label>
                                <input type="text" placeholder="مثال: عروض شهر رمضان" className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-primary focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-4">نوع الرسالة</label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <TypeCard 
                                        active={campaignType === 'text'} 
                                        onClick={() => setCampaignType('text')}
                                        icon={MessageSquare}
                                        title="نص فقط"
                                    />
                                    <TypeCard 
                                        active={campaignType === 'image'} 
                                        onClick={() => setCampaignType('image')}
                                        icon={ImageIcon}
                                        title="صورة + نص"
                                    />
                                    <TypeCard 
                                        active={campaignType === 'template'} 
                                        onClick={() => setCampaignType('template')}
                                        icon={CheckCircle}
                                        title="قالب جاهز"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-in fade-in slide-in-from-bottom-2">
                         <h2 className="text-xl font-bold mb-6">الجمهور المستهدف</h2>
                         <div className="space-y-4">
                            <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                                <input type="radio" name="audience" className="w-5 h-5 accent-primary" defaultChecked />
                                <div>
                                    <div className="font-bold text-gray-900">جميع العملاء</div>
                                    <div className="text-sm text-gray-500">إرسال لجميع جهات الاتصال المسجلة (1,240 عميل)</div>
                                </div>
                            </label>
                             <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                                <input type="radio" name="audience" className="w-5 h-5 accent-primary" />
                                <div>
                                    <div className="font-bold text-gray-900">العملاء النشطون فقط</div>
                                    <div className="text-sm text-gray-500">الذين تواصلوا معك في آخر 30 يوم (850 عميل)</div>
                                </div>
                            </label>
                             <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="font-bold text-gray-900">تصفية مخصصة</div>
                                    <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600">قريباً</span>
                                </div>
                                <p className="text-sm text-gray-500">تحديد الجمهور بناءً على الوسوم (Tags) أو المدينة.</p>
                             </div>
                         </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="animate-in fade-in slide-in-from-bottom-2">
                         <h2 className="text-xl font-bold mb-6">المحتوى والجدولة</h2>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">نص الرسالة</label>
                                <textarea 
                                    className="w-full h-40 p-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-primary focus:outline-none resize-none"
                                    placeholder="اكتب رسالتك هنا..."
                                    defaultValue={campaignType === 'template' ? "مرحباً {{name}}، يسرنا أن نعلمكم ببدء عروضنا الجديدة..." : ""}
                                ></textarea>
                                <div className="text-xs text-gray-400 mt-2 text-left">عدد الحروف: 0/1000</div>
                            </div>
                            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col justify-center">
                                <label className="block text-sm font-medium text-gray-700 mb-4">توقيت الإرسال</label>
                                <div className="space-y-3">
                                     <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="schedule" className="accent-primary" defaultChecked />
                                        <span className="text-sm">إرسال فوراً</span>
                                    </label>
                                     <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="schedule" className="accent-primary" />
                                        <span className="text-sm">جدولة لوقت لاحق</span>
                                    </label>
                                    <input type="datetime-local" className="w-full p-2 bg-white rounded-lg border border-gray-200 text-sm mt-2 focus:outline-none" disabled />
                                </div>
                            </div>
                         </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-12 pt-6 border-t border-gray-100">
                    <button 
                        onClick={() => step > 1 && setStep(step - 1)}
                        disabled={step === 1}
                        className="px-6 py-2.5 rounded-xl text-gray-500 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        السابق
                    </button>
                    
                    {step < 3 ? (
                        <button 
                            onClick={() => setStep(step + 1)}
                            className="bg-primary text-white px-8 py-2.5 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                        >
                            التالي
                        </button>
                    ) : (
                        <button 
                            className="bg-green-600 text-white px-8 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                            <Send className="w-4 h-4" /> إطلاق الحملة
                        </button>
                    )}
                </div>
            </div>
        </div>
      </div>
    </>
  );
}

function StepItem({ step, currentStep, icon: Icon, title, description }: any) {
    const isActive = step === currentStep;
    const isCompleted = step < currentStep;

    return (
        <div className={`flex items-center gap-4 ${isActive ? 'opacity-100' : isCompleted ? 'opacity-100' : 'opacity-50'}`}>
            <div className={`
                w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors
                ${isActive || isCompleted ? 'bg-primary border-primary text-white' : 'bg-white border-gray-200 text-gray-400'}
            `}>
                {isCompleted ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
            </div>
            <div>
                <h3 className={`font-bold ${isActive || isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>{title}</h3>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
        </div>
    );
}

function TypeCard({ active, onClick, icon: Icon, title }: any) {
    return (
        <div 
            onClick={onClick}
            className={`
                p-4 rounded-xl border-2 cursor-pointer transition-all text-center hover:bg-gray-50
                ${active ? 'border-primary bg-primary/5' : 'border-gray-200'}
            `}
        >
            <Icon className={`w-8 h-8 mx-auto mb-3 ${active ? 'text-primary' : 'text-gray-400'}`} />
            <span className={`font-bold text-sm ${active ? 'text-primary' : 'text-gray-600'}`}>{title}</span>
        </div>
    );
}
