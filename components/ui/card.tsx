import { cn } from "@/lib/utils";

interface CardProps {
    children: React.ReactNode;
    className?: string;
    padding?: "none" | "sm" | "md" | "lg";
}

const paddingMap = {
    none: "",
    sm: "p-4",
    md: "p-6 sm:p-8",
    lg: "p-8 sm:p-10 lg:p-12",
};

export function Card({ children, className, padding = "md" }: CardProps) {
    return (
        <div
            className={cn(
                "bg-white rounded-3xl border border-gray-100 shadow-sm",
                paddingMap[padding],
                className
            )}
        >
            {children}
        </div>
    );
}
