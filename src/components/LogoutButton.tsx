"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton({ hideText }: { hideText?: boolean }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/admin/logout", { method: "POST" });
      if (response.ok) {
        router.push("/admin/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button 
      onClick={handleLogout}
      title={hideText ? "Logout" : ""}
      className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full ${hideText ? "justify-center" : ""}`}
    >
      <LogOut className="w-5 h-5 shrink-0" />
      {!hideText && <span>Logout</span>}
    </button>
  );
}
