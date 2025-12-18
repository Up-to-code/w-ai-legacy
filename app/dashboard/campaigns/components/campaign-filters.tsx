"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import type { CampaignStatus } from "@/types/campaign";

const STATUS_FILTERS = [
    { value: "", label: "الجميع" },
    { value: "draft", label: "مسودة" },
    { value: "scheduled", label: "مجدولة" },
    { value: "active", label: "نشطة" },
    { value: "completed", label: "مكتملة" },
    { value: "failed", label: "فشلت" },
];

export function CampaignFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const searchQuery = searchParams.get("search") || "";
    const statusFilter = searchParams.get("status") || "";

    function handleFilter(name: string, value: string) {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(name, value);
        } else {
            params.delete(name);
        }
        params.set("page", "1"); // Reset to page 1 on filter change

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
        });
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
                <input
                    type="text"
                    defaultValue={searchQuery}
                    onChange={(e) => {
                        const val = e.target.value;
                        // Debounce would be nice, but simple for now
                        const timer = setTimeout(() => handleFilter("search", val), 500);
                        return () => clearTimeout(timer);
                    }}
                    placeholder="بحث عن حملة..."
                    className="w-full pl-4 pr-10 py-2.5 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                />
                <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>

            <select
                value={statusFilter}
                onChange={(e) => handleFilter("status", e.target.value)}
                className="px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all min-w-[150px]"
            >
                {STATUS_FILTERS.map((filter) => (
                    <option key={filter.value} value={filter.value}>
                        {filter.label}
                    </option>
                ))}
            </select>

            {isPending && (
                <div className="flex items-center text-xs text-gray-400 animate-pulse">
                    جاري التحديث...
                </div>
            )}
        </div>
    );
}
