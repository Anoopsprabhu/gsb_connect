"use client";

import { useState, useMemo, useEffect } from "react";
import DataTable from "@/components/DataTable";
import { Search, MessageSquare, Mail, Phone, Calendar } from "lucide-react";
import { ColDef } from "ag-grid-community";

export default function EnquiriesListPage() {
  const [searchText, setSearchText] = useState("");
  const [rowData, setRowData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    callback: 0,
    today: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [enquiriesRes, statsRes] = await Promise.all([
        fetch("/api/admin/enquiries"),
        fetch("/api/admin/stats"),
      ]);

      const enquiriesData = await enquiriesRes.json();
      const statsData = await statsRes.json();

      if (Array.isArray(enquiriesData)) {
        setRowData(enquiriesData);
      }

      if (statsData.sections?.enquiries) {
        setStats(statsData.sections.enquiries);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateEnquiryStatus = async (id: string, status: string) => {
    try {
      await fetch("/api/admin/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      fetchData();
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: "createdAt",
        headerName: "Date",
        flex: 0.8,
        minWidth: 120,
        sortable: true,
        valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
      },
      { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
      { field: "email", headerName: "Email", flex: 1.2, minWidth: 200 },
      { field: "subject", headerName: "Subject", flex: 1.2, minWidth: 180 },
      {
        field: "message",
        headerName: "Message Snippet",
        flex: 2,
        minWidth: 200,
        tooltipField: "message",
      },
      {
        headerName: "Actions",
        cellRenderer: (params: any) => (
          <div className="flex gap-3 items-center h-full">
            <button className="text-indigo-600 hover:text-indigo-800 text-xs font-bold">
              View
            </button>
            <button
              onClick={() => updateEnquiryStatus(params.data.id, "archived")}
              className="text-slate-400 hover:text-red-500 text-xs font-bold"
            >
              Archive
            </button>
          </div>
        ),
        width: 120,
      },
    ],
    [],
  );

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      filter: true,
    }),
    [],
  );

  return (
    <div className="flex flex-col h-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Enquiries</h1>
        <p className="text-slate-500 mt-1">
          Review and respond to messages from the community.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
              Total
            </p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.total}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
              Unread
            </p>
            <h3 className="text-2xl font-bold text-slate-900">
              {stats.unread}
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
              Callback
            </p>
            <h3 className="text-2xl font-bold text-slate-900">
              {stats.callback}
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
              Today
            </p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.today}</h3>
          </div>
        </div>
      </div>

      {/* Grid Container */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search enquiries..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        <div className="w-full flex-1">
          <DataTable
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            quickFilterText={searchText}
            paginationPageSize={20}
          />
        </div>
      </div>
    </div>
  );
}
