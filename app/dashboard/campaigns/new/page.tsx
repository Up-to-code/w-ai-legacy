"use client";

import { Header } from "@/components/dashboard/header";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/hooks/use-toast";
import { createCampaign } from "@/app/actions/campaigns";
import { getTags } from "@/app/actions/tags";
import { getTemplates } from "@/app/actions/templates";
import { Tag } from "@/types/tag";
import { Template } from "@/types/template";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon, Clock, Plus } from "lucide-react";

const STEPS = [
  { id: 1, title: "التفاصيل" },
  { id: 2, title: "الجمهور" },
  { id: 3, title: "المحتوى" },
  { id: 4, title: "التوقيت" },
];

export default function NewCampaignPage() {
  const router = useRouter();
  const toast = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    audienceType: "all", // all, tags
    includedTags: [] as string[],
    messageType: "text", // text, template
    messageContent: "",
    templateId: "",
    scheduleType: "now", // now, later
    scheduledAt: "", // datetime-local string
  });

  // Fetch initial data
  useEffect(() => {
    async function init() {
      const [tagsResult, templatesResult] = await Promise.all([
        getTags(),
        getTemplates()
      ]);

      if (tagsResult.success && tagsResult.data) {
        setTags(tagsResult.data);
      }
      if (templatesResult.success && templatesResult.data) {
        setTemplates(templatesResult.data);
      }
    }
    init();
  }, []);

  const handleNext = () => {
    // Validation
    if (currentStep === 1 && !formData.name.trim()) {
      toast.error("يرجى إدخال اسم الحملة");
      return;
    }
    if (currentStep === 2 && formData.audienceType === "tags" && formData.includedTags.length === 0) {
      toast.error("يرجى اختيار وسم واحد على الأقل");
      return;
    }
    if (currentStep === 3) {
      if (formData.messageType === "text" && !formData.messageContent.trim()) {
        toast.error("يرجى إدخال محتوى الرسالة");
        return;
      }
      if (formData.messageType === "template" && !formData.templateId) {
        toast.error("يرجى اختيار قالب");
        return;
      }
    }

    if (currentStep < 4) {
      setCurrentStep(curr => curr + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(curr => curr - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
        const payload: any = {
            name: formData.name,
            audienceType: formData.audienceType as any,
            includedTags: formData.includedTags,
            messageType: formData.messageType as any,
            messageContent: formData.messageContent,
            templateId: formData.templateId || undefined
        };

        if (formData.scheduleType === "later" && formData.scheduledAt) {
            payload.status = "scheduled";
            payload.scheduledAt = new Date(formData.scheduledAt);
        } else {
            payload.status = "draft";
        }

        const result = await createCampaign(payload);

        if (result.success) {
            toast.success(result.message || "تم إنشاء الحملة بنجاح");
            router.push("/dashboard/campaigns");
        } else {
             toast.error(result.error || "حدث خطأ");
        }
    } catch (error) {
        toast.error("حدث خطأ غير متوقع");
    } finally {
        setLoading(false);
    }
  };

  const toggleTag = (tagId: string) => {
    setFormData(prev => {
      const exists = prev.includedTags.includes(tagId);
      if (exists) {
        return { ...prev, includedTags: prev.includedTags.filter(id => id !== tagId) };
      } else {
        return { ...prev, includedTags: [...prev.includedTags, tagId] };
      }
    });
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setFormData((prev) => ({
        ...prev,
        templateId: templateId,
        messageContent: template.content,
      }));
    }
  };

  const insertVariable = (variable: string) => {
    setFormData((prev) => ({
      ...prev,
      messageContent: prev.messageContent + ` {{${variable}}} `,
    }));
  };

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto pb-20">
        <h1 className="text-2xl font-bold mb-6">إنشاء حملة جديدة</h1>

        {/* Stepper */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
            <div className="flex items-center justify-between relative px-10">
                {/* Progress Bar Background */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-0"></div>
                {/* Active Progress Bar */}
                <div 
                    className="absolute top-1/2 right-0 h-1 bg-primary transition-all duration-300 -z-0"
                    style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                ></div>

                {STEPS.map((step) => (
                    <div key={step.id} className="relative z-10 flex flex-col items-center bg-white px-2">
                        <div 
                            className={`
                                w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300
                                ${currentStep >= step.id 
                                    ? "bg-primary text-white scale-110 shadow-lg shadow-primary/30" 
                                    : "bg-gray-100 text-gray-400"}
                            `}
                        >
                            {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                        </div>
                        <span className={`text-xs mt-2 font-medium ${currentStep >= step.id ? "text-primary" : "text-gray-400"}`}>
                            {step.title}
                        </span>
                    </div>
                ))}
            </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 min-h-[400px]">
            {currentStep === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">اسم الحملة</label>
                        <input 
                            type="text" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            placeholder="مثال: خصومات الجمعة البيضاء"
                            autoFocus
                        />
                        <p className="text-gray-400 text-xs mt-2">اسم الحملة للرجوع إليه لاحقاً، لن يظهر للعملاء.</p>
                    </div>
                </div>
            )}

            {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setFormData({...formData, audienceType: "all"})}
                            className={`p-6 rounded-xl border-2 text-center transition-all ${formData.audienceType === "all" ? "border-primary bg-primary/5 text-primary" : "border-gray-100 hover:border-gray-200"}`}
                        >
                            <div className="font-bold text-lg mb-2">كل جهات الاتصال</div>
                            <p className="text-sm opacity-80">إرسال لجميع العملاء المسجلين</p>
                        </button>
                        <button
                            onClick={() => setFormData({...formData, audienceType: "tags"})}
                            className={`p-6 rounded-xl border-2 text-center transition-all ${formData.audienceType === "tags" ? "border-primary bg-primary/5 text-primary" : "border-gray-100 hover:border-gray-200"}`}
                        >
                            <div className="font-bold text-lg mb-2">حسب الوسوم Tag</div>
                            <p className="text-sm opacity-80">استهداف مجموعة محددة</p>
                        </button>
                    </div>

                    {formData.audienceType === "tags" && (
                        <div className="mt-6">
                            <label className="block text-sm font-bold text-gray-700 mb-4">اختر الوسوم</label>
                            {tags.length === 0 ? (
                                <div className="text-center p-8 bg-gray-50 rounded-xl text-gray-500">
                                    لا توجد وسوم متاحة. قم بإضافة وسوم لجهات الاتصال أولاً.
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {tags.map(tag => (
                                        <button
                                            key={tag.id}
                                            onClick={() => toggleTag(tag.id)}
                                            className={`
                                                px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2
                                                ${formData.includedTags.includes(tag.id) 
                                                    ? "bg-primary text-white shadow-md shadow-primary/20" 
                                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"}
                                            `}
                                        >
                                            {tag.name}
                                            {formData.includedTags.includes(tag.id) && <Check className="w-3 h-3" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {currentStep === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="flex gap-4 border-b border-gray-100 pb-4">
                         <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="radio" 
                                name="msgType"
                                checked={formData.messageType === "text"}
                                onChange={() => setFormData({...formData, messageType: "text"})}
                                className="w-4 h-4 text-primary"
                            />
                            <span className="font-medium">نص مخصص</span>
                         </label>
                         <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="radio" 
                                name="msgType"
                                checked={formData.messageType === "template"}
                                onChange={() => setFormData({...formData, messageType: "template"})}
                                className="w-4 h-4 text-primary"
                            />
                            <span className="font-medium">قالب جاهز</span>
                         </label>
                    </div>

                    {formData.messageType === "text" ? (
                        <div>
                             {/* Variable Buttons */}
                            <div className="flex flex-wrap gap-2 mb-3">
                                <span className="text-xs font-medium text-gray-500 py-1.5 ">إدراج متغير:</span>
                                {["name", "phone", "email", "company"].map((v) => (
                                    <button
                                        key={v}
                                        onClick={() => insertVariable(v)}
                                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1.5 rounded-md transition-colors flex items-center gap-1 border border-gray-200"
                                        title={`إدراج {{${v}}}`}
                                    >
                                        <Plus className="w-3 h-3" /> {v === "name" ? "الاسم" : v === "phone" ? "الجوال" : v === "email" ? "البريد" : "الشركة"}
                                    </button>
                                ))}
                            </div>

                            <textarea
                                value={formData.messageContent}
                                onChange={(e) => setFormData({...formData, messageContent: e.target.value})}
                                rows={6}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                                placeholder="اكتب نص الرسالة هنا..."
                            ></textarea>
                            <div className="text-xs text-gray-400 mt-2 text-left">{formData.messageContent.length} حرف</div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <select
                                value={formData.templateId}
                                onChange={(e) => handleTemplateSelect(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            >
                                <option value="">اختر قالباً...</option>
                                {templates.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>

                            {formData.messageContent && (
                                <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                                    <div className="text-xs font-bold text-green-700 mb-2">معاينة المحتوى:</div>
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{formData.messageContent}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {currentStep === 4 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="space-y-4">
                         <label className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer ${formData.scheduleType === "now" ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"}`}>
                            <input 
                                type="radio" 
                                name="schedule"
                                checked={formData.scheduleType === "now"}
                                onChange={() => setFormData({...formData, scheduleType: "now"})}
                                className="w-5 h-5 text-primary"
                            />
                            <div>
                                <div className="font-bold">حفظ كمسودة</div>
                                <div className="text-sm text-gray-500">سيتم حفظ الحملة ويمكنك إرسالها يدوياً لاحقاً</div>
                            </div>
                         </label>

                         <label className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer ${formData.scheduleType === "later" ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"}`}>
                            <input 
                                type="radio" 
                                name="schedule"
                                checked={formData.scheduleType === "later"}
                                onChange={() => setFormData({...formData, scheduleType: "later"})}
                                className="w-5 h-5 text-primary"
                            />
                            <div>
                                <div className="font-bold">جدولة للإرسال لاحقاً</div>
                                <div className="text-sm text-gray-500">سيتم إرسال الحملة تلقائياً في الوقت المحدد</div>
                            </div>
                         </label>

                          {formData.scheduleType === "later" && (
                             <div className="mr-8 animate-in slide-in-from-top-2 space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">التاريخ</label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal h-12 rounded-xl border-gray-200",
                                                    !formData.scheduledAt && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="ml-2 h-4 w-4" />
                                                {formData.scheduledAt && !isNaN(Date.parse(formData.scheduledAt)) ? (
                                                    format(new Date(formData.scheduledAt), "PPP", { locale: ar })
                                                ) : (
                                                    <span>اختر تاريخ الإرسال</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={formData.scheduledAt ? new Date(formData.scheduledAt) : undefined}
                                                onSelect={(date) => {
                                                    if (date) {
                                                        const current = formData.scheduledAt ? new Date(formData.scheduledAt) : new Date();
                                                        date.setHours(current.getHours());
                                                        date.setMinutes(current.getMinutes());
                                                        setFormData({...formData, scheduledAt: date.toISOString()});
                                                    }
                                                }}
                                                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">الوقت</label>
                                    <div className="relative">
                                        <input
                                            type="time"
                                            value={formData.scheduledAt ? format(new Date(formData.scheduledAt), "HH:mm") : ""}
                                            onChange={(e) => {
                                                const [hours, minutes] = e.target.value.split(":").map(Number);
                                                const date = formData.scheduledAt ? new Date(formData.scheduledAt) : new Date();
                                                date.setHours(hours);
                                                date.setMinutes(minutes);
                                                setFormData({...formData, scheduledAt: date.toISOString()});
                                            }}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all pl-10 block"
                                        />
                                        <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    </div>
                                </div>
                             </div>
                         )}
                    </div>

                    {/* Final Summary */}
                    <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
                        <h3 className="font-bold mb-4 text-gray-800">ملخص الحملة</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">الاسم:</span>
                                <span className="font-semibold">{formData.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">الجمهور:</span>
                                <span className="font-semibold">{formData.audienceType === "all" ? "الجميع" : `${formData.includedTags.length} وسوم`}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">نوع الرسالة:</span>
                                <span className="font-semibold">{formData.messageType === "text" ? "نص" : "قالب"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between mt-8">
            <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className={`
                    px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all
                    ${currentStep === 1 
                        ? "text-gray-300 cursor-not-allowed" 
                        : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm border border-gray-200"}
                `}
            >
                <ChevronRight className="w-5 h-5" /> السابق
            </button>

            <button
                onClick={handleNext}
                disabled={loading}
                className="px-8 py-3 bg-primary text-white rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all disabled:opacity-70"
            >
                {loading ? "جاري الحفظ..." : currentStep === 4 ? "إنهاء وحفظ" : "التالي"}
                {!loading && currentStep < 4 && <ChevronLeft className="w-5 h-5" />}
            </button>
        </div>
      </div>
    </>
  );
}
