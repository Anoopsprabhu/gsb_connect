"use client";

import { useMemo, useState, useEffect } from "react";
import { Calendar, Users, TrendingUp, Clock, Plus, Rocket } from "lucide-react";
import DataTable from "@/components/DataTable";
import { ColDef } from "ag-grid-community";
import Link from "next/link";

export default function AdminDashboard() {
  const [statsData, setStatsData] = useState({ events: 0, members: 0, newEnquiries: 0, pendingStartups: 0 });
  const [rowData, setRowData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        const [statsRes, eventsRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/events?limit=5"),
        ]);
        const stats = await statsRes.json();
        const events = await eventsRes.json();
        
        setStatsData(stats);
        if (Array.isArray(events)) {
          setRowData(events);
        }
      } catch (error) {
        console.error("Dashboard data load failed:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const stats = [
    { label: "Total Events", value: statsData.events.toString(), icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Members", value: statsData.members.toString(), icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "New Enquiries", value: statsData.newEnquiries.toString(), icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "New Startups", value: statsData.pendingStartups.toString(), icon: Rocket, color: "text-rose-600", bg: "bg-rose-50" },
  ];

  const columnDefs = useMemo<ColDef[]>(() => [
    { field: "title", headerName: "Event", flex: 1.5 },
    { field: "date", headerName: "Date", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 0.8,
      cellRenderer: (params: any) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${params.value === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-500"}`}>
          {params.value}
        </span>
      )
    }
  ], []);

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back, Super Admin! Here's what's happening today.</p>
        </div>
        <Link
          href="/admin/events/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Quick Event
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+5%</span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity / Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">Recent Events</h2>
            <Link href="/admin/events" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">View All</Link>
          </div>
          <div className="w-full flex-1 rounded-xl overflow-hidden border border-slate-100">
            <DataTable
              rowData={rowData}
              columnDefs={columnDefs}
              paginationPageSize={20}
              rowHeight={48}
              headerHeight={40}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4">
            <Link href="/admin/events/new" className="p-4 text-left rounded-xl border border-slate-100 bg-slate-50/50 hover:border-indigo-500 hover:bg-indigo-50 transition-all group flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-white shadow-sm border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-colors">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">Add New Event</p>
                <p className="text-xs text-slate-500 mt-0.5">Publish a workshop or seminar</p>
              </div>
            </Link>
            <Link href="/admin/users" className="p-4 text-left rounded-xl border border-slate-100 bg-slate-50/50 hover:border-indigo-500 hover:bg-indigo-50 transition-all group flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-white shadow-sm border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-colors">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">Manage Admins</p>
                <p className="text-xs text-slate-500 mt-0.5">Control access and roles</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
