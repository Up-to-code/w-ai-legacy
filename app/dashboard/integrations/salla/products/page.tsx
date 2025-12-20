import { Suspense } from "react";
import { getIntegration } from "@/app/actions/integrations";
import { getSallaProducts } from "@/app/actions/salla-api";
import { ShoppingBag, AlertCircle, Package, ExternalLink, ChevronLeft } from "lucide-react";
import Link from "next/link";
import SearchInput from "./SearchInput";

export default async function SallaProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; keyword?: string }>;
}) {
    // Await searchParams for Next.js 15+
    const params = await searchParams;
    const page = parseInt(params.page || "1");
    const keyword = params.keyword || "";

    const integrationResult = await getIntegration("salla");

    if (!integrationResult.success || !integrationResult.data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-gray-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">المتجر غير متصل</h2>
                <p className="text-gray-500">يرجى ربط متجر سلة أولاً لعرض المنتجات</p>
                <Link
                    href="/dashboard/integrations/salla"
                    className="px-6 py-2 bg-[#105D3B] text-white rounded-xl hover:bg-[#158052] transition-colors"
                >
                    ربط المتجر
                </Link>
            </div>
        );
    }

    // Parse credentials
    let accessToken = "";
    try {
        const creds = typeof integrationResult.data.credentials === 'string'
            ? JSON.parse(integrationResult.data.credentials)
            : integrationResult.data.credentials;
        accessToken = creds.accessToken;
    } catch (e) {
        console.error("Failed to parse credentials", e);
    }

    if (!accessToken) {
        return (
            <div className="p-8 text-center text-red-600 bg-red-50 rounded-xl">
                <AlertCircle className="w-10 h-10 mx-auto mb-3" />
                <p>بيانات الاتصال غير صالحة. يرجى إعادة الربط.</p>
                <Link
                    href="/dashboard/integrations/salla"
                    className="inline-block mt-4 px-6 py-2 bg-white border border-red-200 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                >
                    إعدادات الربط
                </Link>
            </div>
        );
    }

    // Fetch products
    const productsResult = await getSallaProducts(accessToken, page, keyword);

    if (!productsResult.success) {
        return (
            <div className="p-8 text-center text-red-600 bg-red-50 rounded-xl">
                <AlertCircle className="w-10 h-10 mx-auto mb-3" />
                <h3 className="font-bold mb-1">فشل جلب المنتجات</h3>
                <p className="text-sm opacity-80">{productsResult.error}</p>
                {productsResult.error?.includes("scope") && (
                    <p className="text-sm mt-3 bg-red-100 p-2 rounded text-red-800">
                        يبدو أن التطبيق يحتاج لصلاحيات إضافية. يرجى إعادة ربط المتجر.
                    </p>
                )}
            </div>
        );
    }

    const products = productsResult.data || [];
    const pagination = productsResult.pagination;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" dir="rtl">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link href="/dashboard/integrations/salla" className="text-gray-400 hover:text-gray-600 transition-colors">
                            <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            منتجات المتجر
                        </h1>
                    </div>
                    <p className="text-gray-500 text-sm mr-7">
                        عرض وإدارة منتجاتك المستوردة من سلة
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <SearchInput />
                    <div className="bg-white px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 shadow-sm shrink-0 flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        {pagination?.total || 0} منتج
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {keyword ? "لا توجد نتائج" : "لا توجد منتجات"}
                    </h3>
                    <p className="text-gray-500">
                        {keyword
                            ? `لم يتم العثور على منتجات تطابق "${keyword}"`
                            : "لم يتم العثور على أي منتجات في متجرك"}
                    </p>
                    {keyword && (
                        <Link href="?" className="mt-4 inline-block text-[#105D3B] font-medium hover:underline">
                            مسح البحث
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product: any) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col"
                        >
                            <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                                {product.main_image ? (
                                    <img
                                        src={product.main_image}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-300">
                                        <Package className="w-12 h-12" />
                                    </div>
                                )}
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm">
                                    {product.price.amount} {product.price.currency}
                                </div>
                            </div>

                            <div className="p-4 flex-1 flex flex-col">
                                <h3 className="font-bold text-gray-900 line-clamp-2 mb-2 flex-1" title={product.name}>
                                    {product.name}
                                </h3>
                                <div className="flex items-center justify-between text-sm mt-auto pt-4 border-t border-gray-50">
                                    <span
                                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${product.status === "sale"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-100 text-gray-600"
                                            }`}
                                    >
                                        {product.status === "sale" ? "متوفر للبيع" : "غير متوفر"}
                                    </span>
                                    <a
                                        href={product.urls?.customer || "#"}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-gray-400 hover:text-[#105D3B] transition-colors p-1 hover:bg-green-50 rounded-lg"
                                        title="عرض في المتجر"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                    {pagination.links.previous && (
                        <Link
                            href={`?page=${pagination.currentPage - 1}${keyword ? `&keyword=${keyword}` : ''}`}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                            السابق
                        </Link>
                    )}
                    <span className="px-4 py-2 text-sm text-gray-600">
                        صفحة {pagination.currentPage} من {pagination.totalPages}
                    </span>
                    {pagination.links.next && (
                        <Link
                            href={`?page=${pagination.currentPage + 1}${keyword ? `&keyword=${keyword}` : ''}`}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                            التالي
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
