"use client";

import { Copy, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyableInputProps {
    label: string;
    value: string;
    onCopy: () => void;
    onRefresh?: () => void;
    loading?: boolean;
    className?: string;
}

export function CopyableInput({
    label,
    value,
    onCopy,
    onRefresh,
    loading = false,
    className,
}: CopyableInputProps) {
    return (
        <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
                {label}
            </label>
            <div className="relative">
                <input
                    type="text"
                    readOnly
                    value={value}
                    dir="ltr"
                    className={cn(
                        "w-full px-4 py-3 pr-20 border border-gray-200 rounded-lg font-mono text-sm text-gray-700 bg-gray-50",
                        className
                    )}
                />
                <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                    <button
                        type="button"
                        onClick={onCopy}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-[#105D3B] hover:border-[#105D3B]/30 transition-all"
                    >
                        <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                        <span className="hidden sm:inline">نسخ</span>
                    </button>
                    {onRefresh && (
                        <button
                            type="button"
                            onClick={onRefresh}
                            disabled={loading}
                            className="p-1.5 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-[#105D3B] hover:border-[#105D3B]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <RefreshCw
                                className={cn("w-3.5 h-3.5", loading && "animate-spin")}
                                aria-hidden="true"
                            />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
