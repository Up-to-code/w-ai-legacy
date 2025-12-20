"use client";

import Link from "next/link";
import { ArrowLeft, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled ? "py-2" : "py-4"
        )}
      >
        <div
          className={cn(
            "max-w-7xl mx-auto px-6 md:px-8 transition-all duration-300",
            scrolled
              ? "bg-white/80 backdrop-blur-xl border border-white/20 shadow-lg shadow-black/5 rounded-full mt-2 mx-4 md:mx-auto max-w-6xl py-3"
              : "bg-transparent border-transparent py-2"
          )}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Link href="/" className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#105D3B] to-[#158052] flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-green-900/20">
                W
              </Link>
              <span className="text-xl font-extrabold text-gray-900 tracking-tight">W-AI</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 bg-gray-50/50 px-6 py-2 rounded-full border border-gray-100/50 backdrop-blur-sm">
              <Link href="#features" className="hover:text-[#105D3B] transition-colors relative block after:block after:content-[''] after:absolute after:h-[2px] after:bg-[#105D3B] after:w-full after:scale-x-0 hover:after:scale-x-100 after:transition after:duration-300 after:origin-center">المميزات</Link>
              <Link href="#testimonials" className="hover:text-[#105D3B] transition-colors relative block after:block after:content-[''] after:absolute after:h-[2px] after:bg-[#105D3B] after:w-full after:scale-x-0 hover:after:scale-x-100 after:transition after:duration-300 after:origin-center">عملاؤنا</Link>
              <Link href="#pricing" className="hover:text-[#105D3B] transition-colors relative block after:block after:content-[''] after:absolute after:h-[2px] after:bg-[#105D3B] after:w-full after:scale-x-0 hover:after:scale-x-100 after:transition after:duration-300 after:origin-center">الأسعار</Link>
              <Link href="#faq" className="hover:text-[#105D3B] transition-colors relative block after:block after:content-[''] after:absolute after:h-[2px] after:bg-[#105D3B] after:w-full after:scale-x-0 hover:after:scale-x-100 after:transition after:duration-300 after:origin-center">الأسئلة</Link>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-4">
              {isLoading ? (
                <div className="w-24 h-10 bg-gray-100 rounded-full animate-pulse"></div>
              ) : isAuthenticated ? (
                <>
                  <Link href="/dashboard" className="bg-[#105D3B] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#0d4f32] shadow-lg shadow-green-900/10 hover:shadow-green-900/20 transition-all flex items-center gap-2 transform hover:scale-105 active:scale-95 duration-200">
                    لوحة التحكم <ArrowLeft className="w-4 h-4" />
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" className="hidden md:block text-sm font-semibold text-gray-600 hover:text-[#105D3B] transition-colors">
                    دخول
                  </Link>
                  <Link href="/register" className="bg-[#105D3B] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#0d4f32] shadow-lg shadow-green-900/10 hover:shadow-green-900/20 transition-all flex items-center gap-2 transform hover:scale-105 active:scale-95 duration-200">
                    ابدأ مجاناً
                  </Link>
                </>
              )}

              {/* Mobile Menu Toggle */}
              <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden animate-in slide-in-from-top-10 duration-300">
          <div className="flex flex-col gap-6 text-lg font-medium text-gray-800 text-center">
            <Link href="#features" onClick={() => setMobileMenuOpen(false)}>المميزات</Link>
            <Link href="#testimonials" onClick={() => setMobileMenuOpen(false)}>العملاء</Link>
            <Link href="#pricing" onClick={() => setMobileMenuOpen(false)}>الأسعار</Link>
            <Link href="#faq" onClick={() => setMobileMenuOpen(false)}>الأسئلة الشائعة</Link>
            {!isAuthenticated && (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-green-600 mt-4">تسجيل الدخول</Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
