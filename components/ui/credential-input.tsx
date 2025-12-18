"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CredentialInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    showToggle?: boolean;
    className?: string;
}

export function CredentialInput({
    label,
    value,
    onChange,
    placeholder,
    showToggle = true,
    className,
}: CredentialInputProps) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
                {label}
            </label>
            <div className="relative">
                <input
                    type={isVisible ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    dir="ltr"
                    className={cn(
                        "w-full px-4 py-3 border border-gray-200 rounded-lg font-mono text-sm text-gray-900",
                        "focus:outline-none focus:ring-2 focus:ring-[#105D3B]/20 focus:border-[#105D3B] transition-all",
                        showToggle && "pr-12",
                        className
                    )}
                />
                {showToggle && (
                    <button
                        type="button"
                        onClick={() => setIsVisible(!isVisible)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
                    >
                        {isVisible ? (
                            <EyeOff className="w-4 h-4" aria-hidden="true" />
                        ) : (
                            <Eye className="w-4 h-4" aria-hidden="true" />
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
