"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Tag as TagIcon } from "lucide-react";
import { useTags } from "@/lib/hooks/use-tags";
import { useToast } from "@/lib/hooks/use-toast";
import { useConfirmDialog, ConfirmDialog } from "@/components/ui/confirm-dialog";
import type {TagColor } from "@/types/tag";

const TAG_COLORS: { value: TagColor; label: string; class: string }[] = [
  { value: "blue", label: "أزرق", class: "bg-blue-100 text-blue-700 border-blue-200" },
  { value: "green", label: "أخضر", class: "bg-green-100 text-green-700 border-green-200" },
  { value: "red", label: "أحمر", class: "bg-red-100 text-red-700 border-red-200" },
  { value: "yellow", label: "أصفر", class: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  { value: "purple", label: "بنفسجي", class: "bg-purple-100 text-purple-700 border-purple-200" },
  { value: "pink", label: "وردي", class: "bg-pink-100 text-pink-700 border-pink-200" },
  { value: "orange", label: "برتقالي", class: "bg-orange-100 text-orange-700 border-orange-200" },
  { value: "gray", label: "رمادي", class: "bg-gray-100 text-gray-700 border-gray-200" },
];

export function TagManager() {
  const { tags, loading, addTag, editTag, removeTag } = useTags();
  const toast = useToast();
  const { confirm, dialogProps } = useConfirmDialog();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<{ id: string; name: string; color: string } | null>(null);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState<TagColor>("blue");

  const handleAddTag = async () => {
    if (!newTagName.trim()) {
      toast.error("يرجى إدخال اسم الوسم");
      return;
    }

    const result = await addTag({ name: newTagName, color: newTagColor });
    if (result.success) {
      toast.success("تم إضافة الوسم بنجاح");
      setIsAddModalOpen(false);
      setNewTagName("");
      setNewTagColor("blue");
    } else {
      toast.error(result.error || "حدث خطأ أثناء إضافة الوسم");
    }
  };

  const handleEditTag = async () => {
    if (!editingTag || !editingTag.name.trim()) {
      toast.error("يرجى إدخال اسم الوسم");
      return;
    }

    const result = await editTag(editingTag.id, {
      name: editingTag.name,
      color: editingTag.color as TagColor,
    });

    if (result.success) {
      toast.success("تم تحديث الوسم بنجاح");
      setEditingTag(null);
    } else {
      toast.error(result.error || "حدث خطأ أثناء تحديث الوسم");
    }
  };

  const handleDeleteTag = (id: string, name: string) => {
    confirm(
      "حذف الوسم",
      `هل أنت متأكد من حذف الوسم "${name}"؟ سيتم إزالته من جميع جهات الاتصال.`,
      async () => {
        const result = await removeTag(id);
        if (result.success) {
          toast.success("تم حذف الوسم بنجاح");
        } else {
          toast.error(result.error || "حدث خطأ أثناء حذف الوسم");
        }
      }
    );
  };

  const getColorClass = (color?: string) => {
    const tagColor = TAG_COLORS.find((c) => c.value === color);
    return tagColor?.class || TAG_COLORS[0].class;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">الوسوم (Tags)</h3>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <TagIcon className="w-5 h-5 text-primary" />
            الوسوم (Tags)
          </h3>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            إضافة
          </button>
        </div>

        {tags.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">لا توجد وسوم. قم بإضافة وسم جديد.</p>
        ) : (
          <div className="space-y-2">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getColorClass(tag.color)}`}>
                    {tag.name}
                  </span>
                  <span className="text-xs text-gray-400">{tag.contactCount || 0} جهة اتصال</span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditingTag({ id: tag.id, name: tag.name, color: tag.color || "blue" })}
                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTag(tag.id, tag.name)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Tag Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold mb-4">إضافة وسم جديد</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">اسم الوسم</label>
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  placeholder="مثال: عميل VIP"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">اللون</label>
                <div className="grid grid-cols-4 gap-2">
                  {TAG_COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setNewTagColor(color.value)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium border-2 transition-all ${
                        newTagColor === color.value
                          ? `${color.class} border-current`
                          : `${color.class} border-transparent opacity-60 hover:opacity-100`
                      }`}
                    >
                      {color.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddTag}
                className="flex-1 py-2.5 rounded-lg font-bold text-sm bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                إضافة
              </button>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setNewTagName("");
                  setNewTagColor("blue");
                }}
                className="flex-1 py-2.5 rounded-lg font-bold text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Tag Modal */}
      {editingTag && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setEditingTag(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold mb-4">تعديل الوسم</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">اسم الوسم</label>
                <input
                  type="text"
                  value={editingTag.name}
                  onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">اللون</label>
                <div className="grid grid-cols-4 gap-2">
                  {TAG_COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setEditingTag({ ...editingTag, color: color.value })}
                      className={`px-3 py-2 rounded-lg text-xs font-medium border-2 transition-all ${
                        editingTag.color === color.value
                          ? `${color.class} border-current`
                          : `${color.class} border-transparent opacity-60 hover:opacity-100`
                      }`}
                    >
                      {color.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleEditTag}
                className="flex-1 py-2.5 rounded-lg font-bold text-sm bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                حفظ
              </button>
              <button
                onClick={() => setEditingTag(null)}
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
