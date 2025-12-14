"use client";

import { Search, Mail, Bell, User, Settings, LogOut, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

export function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, isLoading, logout } = useAuth();

  // Get user initial for avatar fallback
  const getUserInitial = () => {
    if (!user?.name) return "U";
    return user.name.charAt(0).toUpperCase();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="flex items-center justify-between mb-8">
      {/* Search */}
      <div className="relative w-96 hidden md:block">
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Search className="w-4 h-4" />
        </div>
        <input 
          type="text" 
          placeholder="بحث في القائمة..." 
          className="w-full pr-10 pl-12 py-2.5 bg-white rounded-xl border border-transparent focus:border-primary/20 focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm shadow-sm"
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-gray-200 bg-gray-50 px-1.5 font-mono text-[10px] font-medium text-gray-500 opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 mr-auto md:mr-0">
        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-primary shadow-sm transition-colors relative">
          <Mail className="w-5 h-5" />
          <span className="absolute top-2 left-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-primary shadow-sm transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        
        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
            {isLoading ? (
              <div className="flex items-center gap-3 pr-2 border-r border-gray-200 mr-2 p-1">
                <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="hidden md:block">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1"></div>
                  <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ) : (
              <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 pr-2 border-r border-gray-200 mr-2 hover:bg-gray-50 rounded-lg p-1 transition-colors"
              >
                  {user?.image ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img 
                          src={user.image} 
                          alt={user.name || "User"} 
                          className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-bold text-primary">{getUserInitial()}</span>
                    </div>
                  )}
                  <div className="hidden md:block text-sm text-right">
                      <p className="font-semibold text-gray-900 leading-none mb-1">{user?.name || "مستخدم"}</p>
                      <p className="text-gray-500 text-xs text-right">{user?.email || ""}</p>
                  </div>
                   <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>
            )}

             {isProfileOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-2 border-b border-gray-50 mb-2">
                        <p className="font-semibold text-sm">حسابي</p>
                    </div>
                    <Link href="/dashboard/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary">
                        <User className="w-4 h-4" /> الملف الشخصي
                    </Link>
                    <Link href="/dashboard/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary">
                        <Settings className="w-4 h-4" /> الإعدادات
                    </Link>
                    <div className="border-t border-gray-50 my-2"></div>
                    <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        <LogOut className="w-4 h-4" /> تسجيل الخروج
                    </button>
                </div>
             )}
        </div>
      </div>
    </header>
  );
}
