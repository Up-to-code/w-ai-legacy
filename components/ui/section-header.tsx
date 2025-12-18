import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
    icon: LucideIcon;
    iconBgColor?: string;
    iconColor?: string;
    title: string;
    description?: string;
    className?: string;
}

export function SectionHeader({
    icon: Icon,
    iconBgColor = "bg-[#105D3B]/10",
    iconColor = "text-[#105D3B]",
    title,
    description,
    className,
}: SectionHeaderProps) {
    return (
        <div className={cn("flex items-center gap-3", className)}>
            <div
                className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    iconBgColor
                )}
            >
                <Icon className={cn("w-5 h-5", iconColor)} />
            </div>
            <div>
                <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                {description && (
                    <p className="text-sm text-gray-500">{description}</p>
                )}
            </div>
        </div>
    );
}
