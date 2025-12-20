"use client";

import { Search, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useTransition } from "react";
import { useDebounce } from "use-debounce";

export default function SearchInput() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [text, setText] = useState(searchParams.get("keyword") || "");
    const [query] = useDebounce(text, 500);

    useEffect(() => {
        const params = new URLSearchParams(searchParams);

        // Only update if the query actually changed from what's in the URL
        const currentKeyword = searchParams.get("keyword") || "";
        if (query === currentKeyword) return;

        if (query) {
            params.set("keyword", query);
            // Verify if we are already on page 1 before setting it to avoid redundant marking
            if (params.get("page") !== "1") {
                params.set("page", "1");
            }
        } else {
            params.delete("keyword");
        }

        startTransition(() => {
            router.replace(`?${params.toString()}`);
        });
    }, [query, router, searchParams]);

    return (
        <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                {isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin text-[#105D3B]" />
                ) : (
                    <Search className="h-5 w-5" />
                )}
            </div>
            <input
                type="text"
                className="block w-full pr-10 pl-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#105D3B] focus:ring-1 focus:ring-[#105D3B] transition-all shadow-sm"
                placeholder="بحث عن منتج..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
        </div>
    );
}
