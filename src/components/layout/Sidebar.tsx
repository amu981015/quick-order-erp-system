
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  BarChart3,
  ClipboardList,
  DollarSign,
  Package,
  Users,
  Settings,
  Menu,
  X,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";

type SidebarProps = {
  className?: string;
};

const menuItems = [
  {
    icon: Home,
    label: "主頁",
    href: "/",
  },
  {
    icon: ClipboardList,
    label: "訂單管理",
    href: "/orders",
  },
  {
    icon: DollarSign,
    label: "財務管理",
    href: "/finance",
  },
  {
    icon: Package,
    label: "庫存管理",
    href: "/inventory",
  },
  {
    icon: Users,
    label: "員工管理",
    href: "/staff",
  },
  {
    icon: BarChart3,
    label: "報表分析",
    href: "/reports",
  },
  {
    icon: Settings,
    label: "系統設置",
    href: "/settings",
  }
];

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 md:hidden z-50"
        onClick={toggleMobileSidebar}
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>

      {/* Mobile Menu Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleMobileSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-sidebar fixed top-0 left-0 z-40 h-full transition-all duration-300 border-r",
          isCollapsed ? "w-[70px]" : "w-[240px]",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          className
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4">
            {!isCollapsed && (
              <div className="text-xl font-bold">快速點餐</div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
              onClick={toggleSidebar}
            >
              <Menu size={20} />
            </Button>
          </div>

          <div className="flex-1 py-4 overflow-y-auto">
            <nav className="px-2 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center py-2 px-3 rounded-md transition-colors",
                    location.pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isCollapsed ? "justify-center" : "justify-start"
                  )}
                >
                  <item.icon size={20} />
                  {!isCollapsed && <span className="ml-3">{item.label}</span>}
                </Link>
              ))}
            </nav>
          </div>

          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className={cn(
                "flex items-center w-full py-2 text-sidebar-foreground hover:bg-sidebar-accent",
                isCollapsed ? "justify-center px-0" : "justify-start px-3"
              )}
            >
              <LogOut size={20} />
              {!isCollapsed && <span className="ml-3">登出</span>}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
