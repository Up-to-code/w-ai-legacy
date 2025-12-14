"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4" dir="rtl">
      <div className="bg-white p-8 rounded-3xl border border-red-100 text-center max-w-md w-full shadow-xl shadow-red-50">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">حدث خطأ غير متوقع!</h2>
        <p className="text-gray-500 mb-8 text-sm">
            نعتذر عن هذا الخلل. فريقنا يعمل على إصلاحه. يرجى المحاولة مرة أخرى.
        </p>
        
        <button
          onClick={reset}
          className="w-full inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> إعادة المحاولة
        </button>
      </div>
    </div>
  );
}
