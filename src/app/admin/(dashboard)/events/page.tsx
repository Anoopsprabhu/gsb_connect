"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import DataTable from "@/components/DataTable";
import { Plus, Search, Calendar, MapPin, Tag } from "lucide-react";
import { ColDef } from "ag-grid-community";

export default function EventsListPage() {
  const [searchText, setSearchText] = useState("");
  const [rowData, setRowData] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, venues: 0, categories: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [eventsRes, statsRes] = await Promise.all([
        fetch("/api/admin/events"),
        fetch("/api/admin/stats"),
      ]);

      const eventsData = await eventsRes.json();
      const statsData = await statsRes.json();

      if (Array.isArray(eventsData)) {
        setRowData(eventsData);
      }

      if (statsData.sections?.events) {
        setStats(statsData.sections.events);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        await fetch(`/api/admin/events?id=${id}`, { method: "DELETE" });
        fetchData();
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  const toggleRegistration = useCallback(async (id: string, current: boolean) => {
    try {
      const res = await fetch("/api/admin/events", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, registrationOpen: !current }),
      });
      if (res.ok) {
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update registration status");
      }
    } catch (error) {
      console.error("Toggle registration failed:", error);
    }
  }, []);

  const columnDefs = useMemo<ColDef[]>(
    () => [
      { field: "title", headerName: "Event Title", flex: 2, minWidth: 250 },
      {
        field: "date",
        headerName: "Date",
        flex: 1,
        sortable: true,
        filter: true,
      },
      { field: "location", headerName: "Venue", flex: 1 },
      { field: "type", headerName: "Category", flex: 1 },
      {
        headerName: "Registrations",
        field: "_count.registrations",
        flex: 1,
        cellRenderer: (params: any) => (
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">
              {params.data._count?.registrations || 0}
            </span>
            <Link
              href={`/admin/registrations?eventId=${params.data.id}`}
              className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md hover:bg-indigo-100 transition-colors"
            >
              View List
            </Link>
          </div>
        ),
      },
      {
        headerName: "Registration",
        field: "registrationOpen",
        flex: 1,
        cellRenderer: (params: any) => {
          const isOpen = params.data.registrationOpen !== false;
          return (
            <button
              type="button"
              onClick={() => toggleRegistration(params.data.id, isOpen)}
              className={`px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${
                isOpen
                  ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  : "bg-red-50 text-red-700 hover:bg-red-100"
              }`}
              title={isOpen ? "Click to stop registrations" : "Click to open registrations"}
            >
              {isOpen ? "Open" : "Closed"}
            </button>
          );
        },
      },
      {
        field: "status",
        headerName: "Status",
        flex: 1,
        cellRenderer: (params: any) => {
          const status = params.value;
          const colorClass =
            status === "Published"
              ? "bg-emerald-50 text-emerald-700"
              : status === "Draft"
                ? "bg-slate-50 text-slate-600"
                : "bg-amber-50 text-amber-700";
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-bold ${colorClass}`}
            >
              {status}
            </span>
          );
        },
      },
      {
        headerName: "Actions",
        cellRenderer: (params: any) => (
          <div className="flex gap-2 items-center h-full">
            <Link
              href={`/admin/events/edit/${params.data.id}`}
              className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
              title="Edit Event"
            >
              Edit
            </Link>
            <button
              onClick={() => handleDelete(params.data.id)}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Delete Event"
            >
              Delete
            </button>
          </div>
        ),
        width: 130,
      },
    ],
    [toggleRegistration],
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Events</h1>
          <p className="text-slate-500 mt-1">
            Manage and organize all your upcoming and past events.
          </p>
        </div>
        <Link
          href="/admin/events/new"
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-sm shadow-indigo-200"
        >
          <Plus className="w-5 h-5" />
          Create Event
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
              Total Events
            </p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.total}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
              Active Venues
            </p>
            <h3 className="text-2xl font-bold text-slate-900">
              {stats.venues}
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
              Categories
            </p>
            <h3 className="text-2xl font-bold text-slate-900">
              {stats.categories}
            </h3>
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
              placeholder="Search events..."
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
            loading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
