"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/hooks/use-toast";
import { createCampaign } from "@/app/actions/campaigns";
import { getContactCount } from "@/app/actions/contacts";
import { getTags } from "@/app/actions/tags";
import { getTemplates } from "@/app/actions/templates";
import { Tag } from "@/types/tag";
import { Template } from "@/types/template";
import { ChevronLeft, ChevronRight, Check, Users, Hash, Clock, Filter } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon, Plus, Send, Loader2 } from "lucide-react";

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
    const [estimatedCount, setEstimatedCount] = useState<number>(0);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        audienceType: "all" as "all" | "tags" | "count" | "recent",
        includedTags: [] as string[],
        contactLimit: 100,
        recentDays: 7,
        messageType: "text",
        messageContent: "",
        templateId: "",
        scheduleType: "now" as "now" | "later" | "send",
        scheduledAt: "",
    });

    // Fetch initial data
    useEffect(() => {
        async function init() {
            const [tagsResult, templatesResult, countResult] = await Promise.all([
                getTags(),
                getTemplates(),
                getContactCount()
            ]);

            if (tagsResult.success && tagsResult.data) {
                setTags(tagsResult.data);
            }
            if (templatesResult.success && templatesResult.data) {
                setTemplates(templatesResult.data);
            }
            if (countResult.success && countResult.count !== undefined) {
                setEstimatedCount(countResult.count);
            }
        }
        init();
    }, []);

    // Update estimated count when audience type changes
    useEffect(() => {
        async function updateCount() {
            let count = 0;
            const result = await getContactCount({
                tags: formData.audienceType === "tags" ? formData.includedTags : undefined
            });

            if (result.success && result.count !== undefined) {
                count = result.count;

                // Apply filters for count/recent types
                if (formData.audienceType === "count") {
                    count = Math.min(count, formData.contactLimit);
                }
                // For recent, we can't estimate precisely without backend, use full count
            }

            setEstimatedCount(count);
        }
        updateCount();
    }, [formData.audienceType, formData.includedTags, formData.contactLimit]);

    const handleNext = () => {
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
        if (currentStep > 1) setCurrentStep(curr => curr - 1);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const payload: any = {
                name: formData.name,
                audienceType: formData.audienceType,
                includedTags: formData.includedTags,
                contactLimit: formData.audienceType === "count" ? formData.contactLimit : undefined,
                recentDays: formData.audienceType === "recent" ? formData.recentDays : undefined,
                messageType: formData.messageType,
                messageContent: formData.messageContent,
                templateId: formData.templateId || undefined
            };

            if (formData.scheduleType === "send") {
                payload.sendNow = true;
                payload.status = "sending";
            } else if (formData.scheduleType === "later" && formData.scheduledAt) {
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
        } catch {
            toast.error("حدث خطأ غير متوقع");
        } finally {
            setLoading(false);
        }
    };

    const toggleTag = (tagId: string) => {
        setFormData(prev => {
            const exists = prev.includedTags.includes(tagId);
            return {
                ...prev,
                includedTags: exists
                    ? prev.includedTags.filter(id => id !== tagId)
                    : [...prev.includedTags, tagId]
            };
        });
    };

    const handleTemplateSelect = (templateId: string) => {
        const template = templates.find((t) => t.id === templateId);
        if (template) {
            setFormData((prev) => ({
                ...prev,
                templateId,
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
        <div className="max-w-4xl mx-auto pb-20">
            <h1 className="text-2xl font-bold mb-6">إنشاء حملة جديدة</h1>

            {/* Stepper */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
                <div className="flex items-center justify-between relative px-10">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-0" />
                    <div
                        className="absolute top-1/2 right-0 h-1 bg-primary transition-all duration-300 -z-0"
                        style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                    />
                    {STEPS.map((step) => (
                        <div key={step.id} className="relative z-10 flex flex-col items-center bg-white px-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${currentStep >= step.id ? "bg-primary text-white scale-110 shadow-lg shadow-primary/30" : "bg-gray-100 text-gray-400"}`}>
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

                {/* Step 1: Details */}
                {currentStep === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">اسم الحملة</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                placeholder="مثال: خصومات الجمعة البيضاء"
                                autoFocus
                            />
                            <p className="text-gray-400 text-xs mt-2">اسم الحملة للرجوع إليه لاحقاً، لن يظهر للعملاء.</p>
                        </div>
                    </div>
                )}

                {/* Step 2: Audience */}
                {currentStep === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setFormData({ ...formData, audienceType: "all" })}
                                className={`p-5 rounded-xl border-2 text-right transition-all ${formData.audienceType === "all" ? "border-primary bg-primary/5" : "border-gray-100 hover:border-gray-200"}`}
                            >
                                <Users className={`w-6 h-6 mb-2 ${formData.audienceType === "all" ? "text-primary" : "text-gray-400"}`} />
                                <div className="font-bold mb-1">كل جهات الاتصال</div>
                                <p className="text-sm text-gray-500">إرسال لجميع العملاء</p>
                            </button>

                            <button
                                onClick={() => setFormData({ ...formData, audienceType: "tags" })}
                                className={`p-5 rounded-xl border-2 text-right transition-all ${formData.audienceType === "tags" ? "border-primary bg-primary/5" : "border-gray-100 hover:border-gray-200"}`}
                            >
                                <Filter className={`w-6 h-6 mb-2 ${formData.audienceType === "tags" ? "text-primary" : "text-gray-400"}`} />
                                <div className="font-bold mb-1">حسب الوسوم</div>
                                <p className="text-sm text-gray-500">استهداف وسوم محددة</p>
                            </button>

                            <button
                                onClick={() => setFormData({ ...formData, audienceType: "count" })}
                                className={`p-5 rounded-xl border-2 text-right transition-all ${formData.audienceType === "count" ? "border-primary bg-primary/5" : "border-gray-100 hover:border-gray-200"}`}
                            >
                                <Hash className={`w-6 h-6 mb-2 ${formData.audienceType === "count" ? "text-primary" : "text-gray-400"}`} />
                                <div className="font-bold mb-1">عدد محدد</div>
                                <p className="text-sm text-gray-500">أول X جهة اتصال</p>
                            </button>

                            <button
                                onClick={() => setFormData({ ...formData, audienceType: "recent" })}
                                className={`p-5 rounded-xl border-2 text-right transition-all ${formData.audienceType === "recent" ? "border-primary bg-primary/5" : "border-gray-100 hover:border-gray-200"}`}
                            >
                                <Clock className={`w-6 h-6 mb-2 ${formData.audienceType === "recent" ? "text-primary" : "text-gray-400"}`} />
                                <div className="font-bold mb-1">الجدد</div>
                                <p className="text-sm text-gray-500">جهات آخر X أيام</p>
                            </button>
                        </div>

                        {/* Tags Selection */}
                        {formData.audienceType === "tags" && (
                            <div className="mt-6 animate-in slide-in-from-top-2">
                                <label className="block text-sm font-bold text-gray-700 mb-4">اختر الوسوم</label>
                                {tags.length === 0 ? (
                                    <div className="text-center p-8 bg-gray-50 rounded-xl text-gray-500">
                                        لا توجد وسوم متاحة.
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {tags.map(tag => (
                                            <button
                                                key={tag.id}
                                                onClick={() => toggleTag(tag.id)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${formData.includedTags.includes(tag.id) ? "bg-primary text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                                            >
                                                {tag.name}
                                                {formData.includedTags.includes(tag.id) && <Check className="w-3 h-3" />}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Count Input */}
                        {formData.audienceType === "count" && (
                            <div className="mt-6 animate-in slide-in-from-top-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">عدد جهات الاتصال</label>
                                <input
                                    type="number"
                                    min={1}
                                    max={10000}
                                    value={formData.contactLimit}
                                    onChange={(e) => setFormData({ ...formData, contactLimit: parseInt(e.target.value) || 100 })}
                                    className="w-full max-w-xs px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    placeholder="100"
                                />
                                <p className="text-gray-400 text-xs mt-2">سيتم إرسال الرسالة لأول {formData.contactLimit} جهة اتصال</p>
                            </div>
                        )}

                        {/* Recent Days Input */}
                        {formData.audienceType === "recent" && (
                            <div className="mt-6 animate-in slide-in-from-top-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">جهات الاتصال من آخر</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="number"
                                        min={1}
                                        max={365}
                                        value={formData.recentDays}
                                        onChange={(e) => setFormData({ ...formData, recentDays: parseInt(e.target.value) || 7 })}
                                        className="w-24 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-center"
                                    />
                                    <span className="text-gray-600 font-medium">يوم</span>
                                </div>
                                <p className="text-gray-400 text-xs mt-2">جهات الاتصال المضافة خلال آخر {formData.recentDays} يوم</p>
                            </div>
                        )}

                        {/* Estimated Count */}
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center gap-3">
                            <Users className="w-5 h-5 text-blue-600" />
                            <div>
                                <span className="font-bold text-blue-900">{estimatedCount}</span>
                                <span className="text-blue-700 text-sm mr-2">جهة اتصال مستهدفة (تقريباً)</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Content */}
                {currentStep === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="flex gap-4 border-b border-gray-100 pb-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="msgType"
                                    checked={formData.messageType === "text"}
                                    onChange={() => setFormData({ ...formData, messageType: "text" })}
                                    className="w-4 h-4 text-primary"
                                />
                                <span className="font-medium">نص مخصص</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="msgType"
                                    checked={formData.messageType === "template"}
                                    onChange={() => setFormData({ ...formData, messageType: "template" })}
                                    className="w-4 h-4 text-primary"
                                />
                                <span className="font-medium">قالب جاهز</span>
                            </label>
                        </div>

                        {formData.messageType === "text" ? (
                            <div>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    <span className="text-xs font-medium text-gray-500 py-1.5">إدراج متغير:</span>
                                    {["name", "phone", "email"].map((v) => (
                                        <button
                                            key={v}
                                            onClick={() => insertVariable(v)}
                                            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1.5 rounded-md transition-colors flex items-center gap-1 border border-gray-200"
                                        >
                                            <Plus className="w-3 h-3" />
                                            {v === "name" ? "الاسم" : v === "phone" ? "الجوال" : "البريد"}
                                        </button>
                                    ))}
                                </div>

                                <textarea
                                    value={formData.messageContent}
                                    onChange={(e) => setFormData({ ...formData, messageContent: e.target.value })}
                                    rows={6}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                                    placeholder="اكتب نص الرسالة هنا..."
                                />
                                <div className="text-xs text-gray-400 mt-2 text-left">{formData.messageContent.length} حرف</div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <select
                                    value={formData.templateId}
                                    onChange={(e) => handleTemplateSelect(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                >
                                    <option value="">اختر قالباً...</option>
                                    {templates.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>

                                {formData.messageContent && (
                                    <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                                        <div className="text-xs font-bold text-green-700 mb-2">معاينة:</div>
                                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{formData.messageContent}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Step 4: Timing */}
                {currentStep === 4 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="space-y-4">
                            {/* Send Now */}
                            <label className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${formData.scheduleType === "send" ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"}`}>
                                <input
                                    type="radio"
                                    name="schedule"
                                    checked={formData.scheduleType === "send"}
                                    onChange={() => setFormData({ ...formData, scheduleType: "send" })}
                                    className="w-5 h-5 text-primary"
                                />
                                <Send className={`w-5 h-5 ${formData.scheduleType === "send" ? "text-primary" : "text-gray-400"}`} />
                                <div>
                                    <div className="font-bold">إرسال الآن</div>
                                    <div className="text-sm text-gray-500">سيتم إرسال الحملة فوراً لجميع المستهدفين</div>
                                </div>
                            </label>

                            {/* Save as Draft */}
                            <label className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${formData.scheduleType === "now" ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"}`}>
                                <input
                                    type="radio"
                                    name="schedule"
                                    checked={formData.scheduleType === "now"}
                                    onChange={() => setFormData({ ...formData, scheduleType: "now" })}
                                    className="w-5 h-5 text-primary"
                                />
                                <div>
                                    <div className="font-bold">حفظ كمسودة</div>
                                    <div className="text-sm text-gray-500">سيتم حفظ الحملة ويمكنك إرسالها يدوياً لاحقاً</div>
                                </div>
                            </label>

                            {/* Schedule Later */}
                            <label className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${formData.scheduleType === "later" ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"}`}>
                                <input
                                    type="radio"
                                    name="schedule"
                                    checked={formData.scheduleType === "later"}
                                    onChange={() => setFormData({ ...formData, scheduleType: "later" })}
                                    className="w-5 h-5 text-primary"
                                />
                                <CalendarIcon className={`w-5 h-5 ${formData.scheduleType === "later" ? "text-primary" : "text-gray-400"}`} />
                                <div>
                                    <div className="font-bold">جدولة للإرسال لاحقاً</div>
                                    <div className="text-sm text-gray-500">سيتم إرسال الحملة تلقائياً في الوقت المحدد</div>
                                </div>
                            </label>

                            {formData.scheduleType === "later" && (
                                <div className="mr-8 animate-in slide-in-from-top-2 space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">التاريخ والوقت</label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal h-12 rounded-xl border-gray-200",
                                                        !formData.scheduledAt && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="ml-2 h-4 w-4" />
                                                    {formData.scheduledAt && !isNaN(Date.parse(formData.scheduledAt))
                                                        ? format(new Date(formData.scheduledAt), "PPP p", { locale: ar })
                                                        : <span>اختر تاريخ الإرسال</span>}
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
                                                            setFormData({ ...formData, scheduledAt: date.toISOString() });
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
                                        <input
                                            type="time"
                                            value={formData.scheduledAt ? format(new Date(formData.scheduledAt), "HH:mm") : ""}
                                            onChange={(e) => {
                                                const [hours, minutes] = e.target.value.split(":").map(Number);
                                                const date = formData.scheduledAt ? new Date(formData.scheduledAt) : new Date();
                                                date.setHours(hours);
                                                date.setMinutes(minutes);
                                                setFormData({ ...formData, scheduledAt: date.toISOString() });
                                            }}
                                            className="w-full max-w-xs px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Summary */}
                        <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
                            <h3 className="font-bold mb-4 text-gray-800">ملخص الحملة</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">الاسم:</span>
                                    <span className="font-semibold">{formData.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">الجمهور:</span>
                                    <span className="font-semibold">
                                        {formData.audienceType === "all" ? "الجميع" :
                                            formData.audienceType === "tags" ? `${formData.includedTags.length} وسوم` :
                                                formData.audienceType === "count" ? `أول ${formData.contactLimit} جهة` :
                                                    `آخر ${formData.recentDays} يوم`}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">المستهدفين:</span>
                                    <span className="font-semibold text-primary">{estimatedCount} جهة</span>
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
                    className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${currentStep === 1 ? "text-gray-300 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm border border-gray-200"}`}
                >
                    <ChevronRight className="w-5 h-5" /> السابق
                </button>

                <button
                    onClick={handleNext}
                    disabled={loading}
                    className={cn(
                        "px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all disabled:opacity-70",
                        currentStep === 4 && formData.scheduleType === "send"
                            ? "bg-green-600 text-white hover:bg-green-700 shadow-green-600/25"
                            : "bg-primary text-white hover:bg-primary/90 shadow-primary/25"
                    )}
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            جاري الحفظ...
                        </>
                    ) : currentStep === 4 ? (
                        formData.scheduleType === "send" ? (
                            <>
                                <Send className="w-5 h-5" />
                                إرسال الحملة الآن
                            </>
                        ) : (
                            "إنهاء وحفظ"
                        )
                    ) : (
                        <>
                            التالي
                            <ChevronLeft className="w-5 h-5" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
