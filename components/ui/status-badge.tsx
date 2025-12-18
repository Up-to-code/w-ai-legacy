import { CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
    status: "connected" | "disconnected" | "loading";
    label?: string;
    className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
    if (status === "loading") {
        return (
            <div className={cn("px-3 py-1.5 bg-gray-50 text-gray-600 text-xs font-semibold rounded-lg flex items-center gap-1.5 border border-gray-200", className)}>
                <Loader2 className="w-3 h-3 animate-spin" aria-hidden="true" />
                <span>{label || "جاري التحميل..."}</span>
            </div>
        );
    }

    if (status === "connected") {
        return (
            <div className={cn("px-3 py-1.5 bg-green-50 text-green-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 border border-green-200", className)}>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" aria-hidden="true" />
                <span>{label || "متصل"}</span>
            </div>
        );
    }

    return (
        <div className={cn("px-3 py-1.5 bg-gray-50 text-gray-600 text-xs font-semibold rounded-lg flex items-center gap-1.5 border border-gray-200", className)}>
            <span className="w-2 h-2 rounded-full bg-gray-400" aria-hidden="true" />
            <span>{label || "غير متصل"}</span>
        </div>
    );
}
