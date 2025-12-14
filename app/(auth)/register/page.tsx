"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { translateAuthError, logAuthError } from "@/lib/error-utils";
import { PublicGuard } from "@/components/auth/public-guard";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    await authClient.signUp.email({
        email,
        password,
        name,
    }, {
        onSuccess: () => {
             setSuccess(true);
             router.push("/dashboard");
        },
        onError: (ctx) => {
             // Translate error to user-friendly Arabic message
             const translatedError = translateAuthError(ctx.error.message);
             setError(translatedError);
             
             // Log error with context for debugging
             logAuthError('Registration', ctx.error, { email, name });
             
             setLoading(false);
        }
    });
  };

  return (
    <PublicGuard>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8" dir="rtl">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
         <div className="flex justify-center mb-6">
            <Link href="/" className="w-12 h-12 rounded-full border-2 border-[#105D3B] flex items-center justify-center text-[#105D3B] font-bold text-2xl hover:bg-green-50 transition-colors">
             W
           </Link>
         </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          إنشاء حساب جديد
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          لديك حساب بالفعل؟{" "}
          <Link href="/login" className="font-medium text-[#105D3B] hover:text-[#105D3B]/90">
            تسجيل الدخول
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleRegister}>
             <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                الاسم أو اسم الشركة
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#105D3B] focus:border-[#105D3B] sm:text-sm"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                البريد الإلكتروني
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#105D3B] focus:border-[#105D3B] sm:text-sm"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                كلمة المرور
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#105D3B] focus:border-[#105D3B] sm:text-sm"
                  dir="ltr"
                />
              </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {success && (
                 <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>تم إنشاء الحساب بنجاح! جاري التوجيه...</span>
                </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#105D3B] hover:bg-[#0d4f32] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#105D3B] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                 {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "تسجيل الحساب"}
              </button>
            </div>

            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                         أو تابع باستخدام
                    </span>
                    </div>
                </div>

                <div className="mt-6">
                    <button 
                        type="button" 
                        onClick={() => authClient.signIn.social({ provider: "google", callbackURL: "/dashboard" })}
                        className="w-full inline-flex justify-center items-center gap-3 py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                     <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                     </svg>
                     المتابعة باستخدام Google
                    </button>
                </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    </PublicGuard>
  );
}
