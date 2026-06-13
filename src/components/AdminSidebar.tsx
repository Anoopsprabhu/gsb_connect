"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  MessageSquare,
  Rocket,
  Images,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Globe,
  User,
  ExternalLink,
} from "lucide-react";
import LogoutButton from "./LogoutButton";

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [adminInfo, setAdminInfo] = useState<{
    name: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const res = await fetch("/api/admin/me");
        if (res.ok) {
          const data = await res.json();
          setAdminInfo(data);
        }
      } catch (error) {
        console.error("Failed to fetch admin info:", error);
      }
    };
    fetchAdminInfo();

    // Check if user previously collapsed the sidebar
    const savedState = localStorage.getItem("admin_sidebar_collapsed");
    if (savedState === "true") {
      setIsCollapsed(true);
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("admin_sidebar_collapsed", newState.toString());
  };

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Events", href: "/admin/events", icon: Calendar },
    { name: "Gallery", href: "/admin/gallery", icon: Images },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Registrations", href: "/admin/registrations", icon: CheckCircle },
    { name: "Startups", href: "/admin/startups", icon: Rocket },
    { name: "Enquiries", href: "/admin/enquiries", icon: MessageSquare },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } bg-white border-r border-slate-200 flex flex-col hidden md:flex h-full transition-all duration-300 ease-in-out relative`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 bg-white border border-slate-200 rounded-full p-1 shadow-sm hover:bg-slate-50 transition-colors z-10"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-slate-600" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-slate-600" />
        )}
      </button>

      {/* Header */}
      <div
        className={`p-6 border-b border-slate-100 ${isCollapsed ? "flex justify-center px-2" : ""}`}
      >
        <Link href="/admin" className="block">
          {isCollapsed ? (
            <span className="text-xl font-black text-indigo-600 tracking-tighter">
              G
            </span>
          ) : (
            <span className="text-2xl font-bold text-slate-800 tracking-tight whitespace-nowrap">
              GSB<span className="text-indigo-600">Admin</span>
            </span>
          )}
        </Link>
      </div>

      {/* Admin Info */}
      <div
        className={`p-4 border-b border-slate-100 bg-slate-50/50 ${isCollapsed ? "flex justify-center" : ""}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <User className="w-4 h-4" />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-900 truncate">
                {adminInfo?.name || "Loading..."}
              </p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">
                {adminInfo?.role || "Administrator"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              title={isCollapsed ? item.name : ""}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors group ${
                isActive
                  ? "bg-indigo-50 text-indigo-700 shadow-sm"
                  : "text-slate-600 hover:text-indigo-600 hover:bg-indigo-50"
              } ${isCollapsed ? "justify-center" : ""}`}
            >
              <item.icon
                className={`w-5 h-5 shrink-0 ${isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-indigo-600"}`}
              />
              {!isCollapsed && <span className="truncate">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 space-y-3 border-t border-slate-100 bg-white">
        <Link
          href="/"
          target="_blank"
          title={isCollapsed ? "Go to Website" : ""}
          className={`flex items-center gap-3 px-3 py-2 text-xs font-bold text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors ${isCollapsed ? "justify-center" : ""}`}
        >
          <Globe className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Go to Site</span>}
          {!isCollapsed && (
            <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
          )}
        </Link>

        <div className={isCollapsed ? "flex justify-center" : ""}>
          <LogoutButton hideText={isCollapsed} />
        </div>
      </div>
    </aside>
  );
}
