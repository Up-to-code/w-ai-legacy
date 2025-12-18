import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void | Promise<void>;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "info";
}

export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "تأكيد",
    cancelText = "إلغاء",
    variant = "danger",
}: ConfirmDialogProps) {
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            await onConfirm();
            onClose();
        } catch (error) {
            console.error("Confirm action error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const variantStyles = {
        danger: {
            icon: "bg-red-50 text-red-500 border-red-100",
            button: "bg-red-500 hover:bg-red-600 text-white shadow-red-100",
        },
        warning: {
            icon: "bg-amber-50 text-amber-500 border-amber-100",
            button: "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-100",
        },
        info: {
            icon: "bg-blue-50 text-blue-500 border-blue-100",
            button: "bg-blue-500 hover:bg-blue-600 text-white shadow-blue-100",
        },
    };

    const styles = variantStyles[variant];

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                onClick={onClose}
            />

            {/* Dialog */}
            <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-sm p-8 border border-gray-100 animate-in zoom-in-95 duration-300">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute left-6 top-6 text-gray-300 hover:text-gray-500 transition-colors"
                    disabled={isLoading}
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 ${styles.icon} shadow-sm`}>
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                </div>

                {/* Content */}
                <div className="text-center mb-8">
                    <h3 className="text-xl font-black text-gray-900 mb-2">{title}</h3>
                    <p className="text-sm text-gray-400 font-medium leading-relaxed">{message}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3" dir="rtl">
                    <button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className={`flex-[2] py-3.5 rounded-2xl font-black text-sm transition-all active:scale-95 shadow-lg disabled:opacity-50 ${styles.button}`}
                    >
                        {isLoading ? "جاري الحفظ..." : confirmText}
                    </button>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 py-3.5 rounded-2xl font-black text-sm bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all active:scale-95"
                    >
                        {cancelText}
                    </button>
                </div>
            </div>
        </div>
    );
}
