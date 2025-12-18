import { cn } from "@/lib/utils";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    children: React.ReactNode;
    required?: boolean;
    size?: "sm" | "md" | "lg";
}

export function Label({
    children,
    required,
    size = "sm",
    className,
    ...props
}: LabelProps) {
    const sizeClasses = {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
    };

    return (
        <label
            className={cn(
                "block font-semibold text-gray-600 uppercase tracking-wide",
                sizeClasses[size],
                className
            )}
            {...props}
        >
            {children}
            {required && <span className="text-red-500 mr-1">*</span>}
        </label>
    );
}
