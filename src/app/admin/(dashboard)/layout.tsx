import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.has("admin_auth");

  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Sidebar (Desktop) */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between md:hidden sticky top-0 z-50">
          <Link href="/admin" className="text-xl font-bold text-slate-800 tracking-tight">
            GSB<span className="text-indigo-600">Admin</span>
          </Link>
          <button className="text-slate-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </header>

        <div className="p-6 md:p-8 min-h-full flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
}
