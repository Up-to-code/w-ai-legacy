import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
    variant?: "default" | "ghost";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, error, variant = "default", ...props }, ref) => {
        return (
            <input
                ref={ref}
                className={cn(
                    "w-full px-4 py-3 border rounded-lg font-mono text-sm text-gray-900",
                    "focus:outline-none focus:ring-2 focus:ring-[#105D3B]/20 focus:border-[#105D3B]",
                    "placeholder:text-gray-400 transition-all",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    variant === "default" && "bg-white border-gray-200",
                    variant === "ghost" && "bg-gray-50/50 border-gray-200",
                    error && "border-red-500 focus:ring-red-500/20 focus:border-red-500",
                    className
                )}
                {...props}
            />
        );
    }
);

Input.displayName = "Input";
