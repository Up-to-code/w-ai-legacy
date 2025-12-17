"use client";

import { Header } from "@/components/dashboard/header";
import { Search, Download, Upload, Plus, Edit2, Trash2, Phone, Mail, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { getContacts, createContact, updateContact, deleteContact, exportContacts } from "@/app/actions/contacts";
import { useTags } from "@/lib/hooks/use-tags";
import { TagSelector } from "@/components/tags/tag-selector";
import { useToast } from "@/lib/hooks/use-toast";
import { useConfirmDialog, ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { Contact, CreateContactData } from "@/types/contact";

const TAG_COLOR_CLASSES: Record<string, string> = {
  blue: "bg-blue-50 text-blue-700 border-blue-100",
  green: "bg-green-50 text-green-700 border-green-100",
  red: "bg-red-50 text-red-700 border-red-100",
  yellow: "bg-yellow-50 text-yellow-700 border-yellow-100",
  purple: "bg-purple-50 text-purple-700 border-purple-100",
  pink: "bg-pink-50 text-pink-700 border-pink-100",
  orange: "bg-orange-50 text-orange-700 border-orange-100",
  gray: "bg-gray-50 text-gray-700 border-gray-100",
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  
  const { tags } = useTags();
  const toast = useToast();
  const { confirm, dialogProps } = useConfirmDialog();

  // Fetch contacts with debouncing
  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getContacts({
        page: currentPage,
        limit: 10,
        search: searchQuery,
      });

      if (result.success && result.data) {
        setContacts(result.data);
        if (result.pagination) {
          setTotalPages(result.pagination.totalPages);
          setTotalCount(result.pagination.total);
        }
      } else {
        toast.error(result.error || "حدث خطأ أثناء جلب جهات الاتصال");
      }
    } catch (error: any) {
      toast.error("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, toast]);

  // Fetch on mount and when dependencies change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchContacts();
    }, 300); // Debounce search

    return () => clearTimeout(timer);
  }, [fetchContacts]);

  // Form state
  const [formData, setFormData] = useState<CreateContactData>({
    name: "",
    phone: "",
    email: "",
    tags: [],
    notes: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      tags: [],
      notes: "",
    });
    setEditingContact(null);
  };

  const handleOpenAddDrawer = () => {
    resetForm();
    setIsAddDrawerOpen(true);
  };

  const handleOpenEditDrawer = (contact: Contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      phone: contact.phone || "",
      email: contact.email || "",
      tags: contact.tags || [],
      notes: contact.notes || "",
    });
    setIsAddDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsAddDrawerOpen(false);
    resetForm();
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("يرجى إدخال اسم جهة الاتصال");
      return;
    }

    try {
      let result;
      
      if (editingContact) {
        // Update existing contact
        result = await updateContact(editingContact.id, formData);
      } else {
        // Create new contact
        result = await createContact(formData);
      }

      if (result.success) {
        toast.success(result.message || "تمت العملية بنجاح");
        handleCloseDrawer();
        fetchContacts();
      } else {
        toast.error(result.error || "حدث خطأ أثناء حفظ جهة الاتصال");
      }
    } catch (error: any) {
      toast.error("حدث خطأ غير متوقع");
    }
  };

  const handleDelete = (contact: Contact) => {
    confirm(
      "حذف جهة الاتصال",
      `هل أنت متأكد من حذف "${contact.name}"؟ لا يمكن التراجع عن هذا الإجراء.`,
      async () => {
        const result = await deleteContact(contact.id);
        if (result.success) {
          toast.success("تم حذف جهة الاتصال بنجاح");
          fetchContacts();
        } else {
          toast.error(result.error || "حدث خطأ أثناء الحذف");
        }
      }
    );
  };

  const handleExport = async () => {
    try {
      const result = await exportContacts();
      if (result.success && result.data) {
        // Create CSV download
        const blob = new Blob([result.data], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = result.filename || "contacts.csv";
        link.click();
        toast.success("تم تصدير جهات الاتصال بنجاح");
      } else {
        toast.error(result.error || "حدث خطأ أثناء التصدير");
      }
    } catch (error: any) {
      toast.error("حدث خطأ غير متوقع");
    }
  };

  const getTagColor = (tagId: string) => {
    const tag = tags.find((t) => t.id === tagId);
    return TAG_COLOR_CLASSES[tag?.color || "gray"];
  };

  const getTagName = (tagId: string) => {
    const tag = tags.find((t) => t.id === tagId);
    return tag?.name || tagId;
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "-";
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 24) return `قبل ${hours} ساعة`;
    const days = Math.floor(hours / 24);
    return `قبل ${days} يوم`;
  };

  return (
    <>
      <Header />
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">جهات الاتصال</h1>
           <p className="text-gray-500 text-sm mt-1">
             إجمالي {totalCount} جهة اتصال
           </p>
        </div>
        <div className="flex items-center gap-3">
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-all"
              disabled
            >
                <Upload className="w-4 h-4" /> استيراد
            </button>
            <button 
              onClick={handleExport}
              disabled={contacts.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Download className="w-4 h-4" /> تصدير
            </button>
            <button 
                onClick={handleOpenAddDrawer}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all"
            >
                <Plus className="w-4 h-4" /> إضافة عميل جديد
            </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden relative">
        {/* Search Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between bg-white">
           <div className="relative w-full md:w-96">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="بحث بالاسم، الرقم، أو البريد..." 
                  className="w-full pl-4 pr-10 py-2.5 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                />
                 <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
           </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
            {loading ? (
              // Loading state
              <table className="w-full text-right">
                <thead className="bg-[#fcfcfc] text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 font-medium">العميل</th>
                    <th className="px-6 py-4 font-medium">معلومات الاتصال</th>
                    <th className="px-6 py-4 font-medium">الوسوم</th>
                    <th className="px-6 py-4 font-medium">عدد الطلبات</th>
                    <th className="px-6 py-4 font-medium">آخر نشاط</th>
                    <th className="px-6 py-4 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-40"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : contacts.length === 0 ? (
              // Empty state
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {searchQuery ? "لا توجد نتائج" : "لا توجد جهات اتصال"}
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  {searchQuery 
                    ? "لم يتم العثور على جهات اتصال تطابق البحث" 
                    : "ابدأ بإضافة أول جهة اتصال لك"}
                </p>
                {!searchQuery && (
                  <button
                    onClick={handleOpenAddDrawer}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors"
                  >
                    <Plus className="w-5 h-5" /> إضافة عميل جديد
                  </button>
                )}
              </div>
            ) : (
              // Data table
              <table className="w-full text-right">
                <thead className="bg-[#fcfcfc] text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                    <tr>
                        <th className="px-6 py-4 font-medium">العميل</th>
                        <th className="px-6 py-4 font-medium">معلومات الاتصال</th>
                        <th className="px-6 py-4 font-medium">الوسوم (Tags)</th>
                        <th className="px-6 py-4 font-medium">عدد الطلبات</th>
                        <th className="px-6 py-4 font-medium">آخر نشاط</th>
                        <th className="px-6 py-4 font-medium"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {contacts.map((contact) => (
                        <tr key={contact.id} className="hover:bg-blue-50/30 transition-colors group">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm border border-primary/20">
                                        {contact.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">{contact.name}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-col gap-1">
                                    {contact.phone && (
                                      <span className="text-sm text-gray-700 font-medium flex items-center gap-1" dir="ltr">
                                        <Phone className="w-3 h-3" /> {contact.phone}
                                      </span>
                                    )}
                                    {contact.email && (
                                      <span className="text-xs text-gray-400 flex items-center gap-1">
                                        <Mail className="w-3 h-3" /> {contact.email}
                                      </span>
                                    )}
                                    {!contact.phone && !contact.email && <span className="text-xs text-gray-400">-</span>}
                                </div>
                            </td>
                             <td className="px-6 py-4">
                                <div className="flex gap-1 flex-wrap">
                                  {contact.tags && contact.tags.length > 0 ? (
                                    contact.tags.map((tagId) => (
                                      <span
                                        key={tagId}
                                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${getTagColor(tagId)}`}
                                      >
                                        {getTagName(tagId)}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="text-xs text-gray-400">-</span>
                                  )}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                {contact.orderCount || 0} طلبات
                            </td>
                            <td className="px-6 py-4 text-gray-500 text-xs">
                              {formatDate(contact.lastActivityAt)}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button 
                                    onClick={() => handleOpenEditDrawer(contact)}
                                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                                    title="تعديل"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleDelete(contact)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                    title="حذف"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
              </table>
            )}
        </div>
        
         {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 bg-gray-50/50">
              <span>عرض {contacts.length} من أصل {totalCount} عميل</span>
              <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 border border-gray-200 rounded-md hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    السابق
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1.5 border rounded-md transition-colors ${
                        currentPage === page
                          ? "border-primary bg-white shadow-sm font-bold text-primary"
                          : "border-gray-200 hover:bg-white"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  {totalPages > 5 && <span>...</span>}
                  <button 
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 border border-gray-200 rounded-md hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    التالي
                  </button>
              </div>
          </div>
        )}

        {/* Add/Edit Contact Drawer */}
        {isAddDrawerOpen && (
             <div className="fixed inset-0 z-50 flex justify-end">
                <div 
                    className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
                    onClick={handleCloseDrawer}
                ></div>
                <div className="relative w-full max-w-md bg-white h-full shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col">
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-lg font-bold">
                          {editingContact ? "تعديل جهة الاتصال" : "إضافة عميل جديد"}
                        </h2>
                        <button onClick={handleCloseDrawer} className="text-gray-400 hover:text-gray-600">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="p-6 space-y-4 overflow-y-auto flex-1">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              اسم العميل <span className="text-red-500">*</span>
                            </label>
                            <input 
                              type="text"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                              placeholder="الاسم الأول والأخير" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف (واتساب)</label>
                            <input 
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none text-left" 
                              placeholder="+966..." 
                              dir="ltr" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                            <input 
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none text-left" 
                              placeholder="example@mail.com" 
                            />
                        </div>
                         <div>
                            <TagSelector
                              selectedTags={formData.tags || []}
                              onChange={(tags) => setFormData({ ...formData, tags })}
                              label="الوسوم (Tags)"
                              placeholder="اختر الوسوم"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظات</label>
                            <textarea
                              value={formData.notes}
                              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
                              rows={4}
                              placeholder="أضف أي ملاحظات إضافية..."
                            ></textarea>
                        </div>
                    </div>
                    <div className="p-5 border-t border-gray-100 bg-gray-50 flex gap-3">
                         <button 
                           onClick={handleSubmit}
                           className="flex-1 bg-primary text-white py-2.5 rounded-lg font-bold hover:bg-primary/90 transition-colors"
                         >
                           {editingContact ? "حفظ التغييرات" : "حفظ العميل"}
                         </button>
                         <button 
                           onClick={handleCloseDrawer} 
                           className="flex-1 bg-white border border-gray-200 text-gray-700 py-2.5 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                         >
                           إلغاء
                         </button>
                    </div>
                </div>
             </div>
        )}
      </div>

      <ConfirmDialog {...dialogProps} />
    </>
  );
}
