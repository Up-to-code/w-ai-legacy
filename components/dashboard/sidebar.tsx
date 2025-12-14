"use client";

import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Bot, 
  Settings, 
  HelpCircle, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  Megaphone
} from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside 
      className={`
        bg-white h-screen flex flex-col border-l border-gray-200 fixed right-0 top-0 z-50 transition-all duration-300
        ${isCollapsed ? "w-20" : "w-64"}
      `}
    >
      {/* Header / Logo */}
      <div className="flex items-center justify-between p-6">
        <div className={`flex items-center gap-2 ${isCollapsed ? "justify-center w-full" : ""}`}>
           <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold shrink-0">
             W
           </div>
           {!isCollapsed && <span className="text-xl font-bold text-primary">W-AI</span>}
        </div>
        {!isCollapsed && (
            <button onClick={() => setIsCollapsed(true)} className="text-gray-400 hover:text-primary lg:hidden">
                <ChevronRight />
            </button>
        )}
      </div>

       {/* Toggle Button (Desktop) */}
       <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden lg:flex absolute -left-3 top-10 bg-white border border-gray-200 rounded-full p-1 text-gray-400 hover:text-primary shadow-sm"
      >
        {isCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>


      {/* Menu */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        <div>
          {!isCollapsed && <h3 className="text-xs font-semibold text-muted-foreground mb-4 px-2">القائمة الرئيسية</h3>}
          <nav className="space-y-1">
            <NavItem href="/dashboard" icon={LayoutDashboard} label="لوحة التحكم" collapsed={isCollapsed} active={pathname === '/dashboard'} />
            <NavItem href="/dashboard/companies" icon={Users} label="العملاء" collapsed={isCollapsed} active={pathname?.startsWith('/dashboard/companies')} />
            <NavItem href="/dashboard/templates" icon={MessageSquare} label="قوالب الرسائل" collapsed={isCollapsed} active={pathname?.startsWith('/dashboard/templates')} />
            <NavItem href="/dashboard/templates" icon={MessageSquare} label="قوالب الرسائل" collapsed={isCollapsed} active={pathname?.startsWith('/dashboard/templates')} />
            <NavItem href="/dashboard/campaigns" icon={Megaphone} label="الحملات" collapsed={isCollapsed} active={pathname?.startsWith('/dashboard/campaigns')} />
            <NavItem href="/dashboard/bot" icon={Bot} label="الرد الآلي AI" collapsed={isCollapsed} active={pathname?.startsWith('/dashboard/bot')} badge="جديد" />
          </nav>
        </div>

        <div>
           {!isCollapsed && <h3 className="text-xs font-semibold text-muted-foreground mb-4 px-2">الإعدادات</h3>}
          <nav className="space-y-1">
            <NavItem href="/dashboard/settings" icon={Settings} label="إعدادات المنصة" collapsed={isCollapsed} />
            <NavItem href="/dashboard/help" icon={HelpCircle} label="مركز المساعدة" collapsed={isCollapsed} />
            <NavItem href="/logout" icon={LogOut} label="تسجيل خروج" collapsed={isCollapsed} variant="danger" />
          </nav>
        </div>
      </div>
      
      {/* Upgrade Card */}
      {!isCollapsed && (
        <div className="px-4 mb-4">
            <div className="bg-gradient-to-br from-primary to-[#0d4f32] rounded-2xl p-4 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h4 className="font-bold text-sm mb-1">الترقية إلى برو</h4>
                    <p className="text-xs text-white/80 mb-3">احصل على مميزات الذكاء الاصطناعي الكاملة.</p>
                    <button className="w-full bg-white text-primary text-xs font-bold py-2 rounded-lg hover:bg-gray-50 transition-colors">
                        ترقية الآن
                    </button>
                </div>
                 {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full blur-xl -mr-8 -mt-8"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full blur-xl -ml-8 -mb-8"></div>
            </div>
        </div>
      )}

      {/* User / Plan Info */}
      <div className="p-4 border-t border-gray-100">
        <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="font-bold text-primary">A</span>
            </div>
            {!isCollapsed && (
                <div className="overflow-hidden">
                    <p className="font-semibold text-sm truncate">Ahmed User</p>
                    <p className="text-xs text-gray-500 truncate">باقة المحترفين</p>
                </div>
            )}
        </div>
      </div>
    </aside>
  );
}

function NavItem({ 
  href, 
  icon: Icon, 
  label, 
  collapsed,
  active, 
  badge,
  variant = 'default'
}: { 
  href: string; 
  icon: any; 
  label: string; 
  collapsed: boolean;
  active?: boolean; 
  badge?: string;
  variant?: 'default' | 'danger';
}) {
  return (
    <Link 
      href={href}
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative group
        ${active 
          ? "bg-primary text-white shadow-xl shadow-primary/20 font-bold" 
          : variant === 'danger' 
            ? "text-red-500 hover:bg-red-50 hover:text-red-600"
            : "text-gray-600 hover:bg-gray-100 hover:text-primary"}
         ${collapsed ? "justify-center" : ""}
      `}
      title={collapsed ? label : undefined}
    >
      <Icon className={`w-5 h-5 ${!active && variant !== 'danger' ? "group-hover:scale-110 transition-transform" : ""}`} />
      
      {!collapsed && (
          <>
            <span className="flex-1">{label}</span>
            {badge && (
                <span className="bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-md font-medium animate-pulse">
                {badge}
                </span>
            )}
          </>
      )}
    </Link>
  );
}
