"use client";

import { Header } from "@/components/dashboard/header";
import { Copy, Plus, Edit2, Trash2, Search, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { getTemplates, createTemplate, updateTemplate, deleteTemplate, duplicateTemplate } from "@/app/actions/templates";
import { useToast } from "@/lib/hooks/use-toast";
import { useConfirmDialog, ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { Template, CreateTemplateData, TemplateCategory } from "@/types/template";

const CATEGORIES = [
  { value: "", label: "الجميع" },
  { value: "welcome", label: "ترحيب" },
  { value: "general", label: "عام" },
  { value: "marketing", label: "تسويق" },
  { value: "support", label: "دعم فني" },
];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

  const toast = useToast();
  const { confirm, dialogProps } = useConfirmDialog();

  // Form state
  const [formData, setFormData] = useState<CreateTemplateData>({
    name: "",
    content: "",
    category: "general",
  });

  // Fetch templates
  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getTemplates({
        search: searchQuery,
        category: selectedCategory || undefined,
        limit: 100,
      });

      if (result.success && result.data) {
        setTemplates(result.data);
      } else {
        toast.error(result.error || "حدث خطأ أثناء جلب القوالب");
      }
    } catch (error: any) {
      toast.error("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, toast]);

  // Fetch on mount and when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTemplates();
    }, 300); // Debounce

    return () => clearTimeout(timer);
  }, [fetchTemplates]);

  const resetForm = () => {
    setFormData({
      name: "",
      content: "",
      category: "general",
    });
    setEditingTemplate(null);
  };

  const handleOpenModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (template: Template) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      content: template.content,
      category: template.category || "general",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("يرجى إدخال اسم القالب");
      return;
    }

    if (!formData.content.trim()) {
      toast.error("يرجى إدخال محتوى القالب");
      return;
    }

    try {
      let result;

      if (editingTemplate) {
        result = await updateTemplate(editingTemplate.id, formData);
      } else {
        result = await createTemplate(formData);
      }

      if (result.success) {
        toast.success(result.message || "تمت العملية بنجاح");
        handleCloseModal();
        fetchTemplates();
      } else {
        toast.error(result.error || "حدث خطأ أثناء حفظ القالب");
      }
    } catch (error: any) {
      toast.error("حدث خطأ غير متوقع");
    }
  };

  const handleDelete = (template: Template) => {
    confirm(
      "حذف القالب",
      `هل أنت متأكد من حذف القالب "${template.name}"؟ لا يمكن التراجع عن هذا الإجراء.`,
      async () => {
        const result = await deleteTemplate(template.id);
        if (result.success) {
          toast.success("تم حذف القالب بنجاح");
          fetchTemplates();
        } else {
          toast.error(result.error || "حدث خطأ أثناء الحذف");
        }
      }
    );
  };

  const handleDuplicate = async (template: Template) => {
    try {
      const result = await duplicateTemplate(template.id);
      if (result.success) {
        toast.success("تم نسخ القالب بنجاح");
        fetchTemplates();
      } else {
        toast.error(result.error || "حدث خطأ أثناء النسخ");
      }
    } catch (error: any) {
      toast.error("حدث خطأ غير متوقع");
    }
  };

  const getCategoryLabel = (category?: string) => {
    const cat = CATEGORIES.find((c) => c.value === category);
    return cat?.label || "عام";
  };

  return (
    <>
      <Header />
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">قوالب الرسائل</h1>
          <p className="text-gray-500">إدارة القوالب الجاهزة للرد الآلي. ({templates.length} قالب)</p>
        </div>
        <button
          onClick={handleOpenModal}
          className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all"
        >
          <Plus className="w-4 h-4" /> قالب جديد
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث عن قالب..."
            className="w-full pl-4 pr-10 py-2.5 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
          />
          <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Templates Grid */}
      {loading ? (
        // Loading state
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-20 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : templates.length === 0 ? (
        // Empty state
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Copy className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            {searchQuery || selectedCategory ? "لا توجد نتائج" : "لا توجد قوالب"}
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            {searchQuery || selectedCategory
              ? "لم يتم العثور على قوالب تطابق البحث"
              : "ابدأ بإنشاء أول قالب رسالة لك"}
          </p>
          {!searchQuery && !selectedCategory && (
            <button
              onClick={handleOpenModal}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-5 h-5" /> إنشاء قالب جديد
            </button>
          )}
        </div>
      ) : (
        // Templates grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-primary/50 transition-all group cursor-pointer relative"
            >
              {/* Actions */}
              <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <button
                  onClick={() => handleDuplicate(template)}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-primary hover:text-white transition-colors"
                  title="نسخ"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleOpenEditModal(template)}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-primary hover:text-white transition-colors"
                  title="تعديل"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(template)}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                  title="حذف"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <h3 className="font-bold text-lg mb-3 pr-20">{template.name}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4 bg-gray-50 p-3 rounded-lg line-clamp-3">
                {template.content}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 pt-3">
                <span>التصنيف: {getCategoryLabel(template.category)}</span>
                <span>استخدم {template.usageCount || 0} مرة</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleCloseModal} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {editingTemplate ? "تعديل القالب" : "إنشاء قالب جديد"}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  اسم القالب <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  placeholder="مثال: ترحيب بالعميل الجديد"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">التصنيف</label>
                <select
                  value={formData.category || "general"}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as TemplateCategory })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                >
                  {CATEGORIES.filter((c) => c.value).map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  محتوى الرسالة <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
                  rows={8}
                  placeholder="اكتب محتوى الرسالة هنا..."
                ></textarea>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-400">{formData.content.length} حرف</span>
                  <span className="text-xs text-gray-400">نصيحة: استخدم {'{{name}}'} للإشارة إلى اسم العميل</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSubmit}
                className="flex-1 py-2.5 rounded-lg font-bold text-sm bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                {editingTemplate ? "حفظ التغييرات" : "إنشاء القالب"}
              </button>
              <button
                onClick={handleCloseModal}
                className="flex-1 py-2.5 rounded-lg font-bold text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog {...dialogProps} />
    </>
  );
}
