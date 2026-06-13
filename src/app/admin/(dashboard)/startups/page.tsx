"use client";

import { useState, useMemo, useEffect } from "react";
import DataTable from "@/components/DataTable";
import { Search, Rocket, Mail, Phone, Filter, X, ExternalLink, Globe, Target, Cpu, TrendingUp, Wallet, Coins, User } from "lucide-react";
import { ColDef } from "ag-grid-community";

export default function AdminStartupsPage() {
  const [searchText, setSearchText] = useState("");
  const [rowData, setRowData] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, today: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStartup, setSelectedStartup] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [startupsRes, statsRes] = await Promise.all([
        fetch("/api/startups"),
        fetch("/api/admin/stats")
      ]);
      
      const startupsData = await startupsRes.json();
      const statsData = await statsRes.json();

      if (Array.isArray(startupsData)) {
        setRowData(startupsData);
      }

      if (statsData.sections?.startups) {
        setStats(statsData.sections.startups);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/startups", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        fetchData();
        if (selectedStartup?.id === id) {
          setSelectedStartup(null);
        }
      }

    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const columnDefs = useMemo<ColDef[]>(() => [
    {
      field: "startupName",
      headerName: "Startup",
      flex: 1.5,
      minWidth: 200,
      cellRenderer: (params: any) => (
        <div className="flex flex-col py-1">
          <span className="font-bold text-slate-900">{params.value}</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-tighter">{params.data.category}</span>
        </div>
      )
    },
    { field: "founderName", headerName: "Founder", flex: 1 },
    {
      field: "progress",
      headerName: "Stage",
      flex: 0.8,
      cellRenderer: (params: any) => (
        <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase border border-indigo-100">
          {params.value}
        </span>
      )
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.8,
      cellRenderer: (params: any) => {
        const colors = {
          pending: "bg-amber-50 text-amber-600 border-amber-100",
          approved: "bg-emerald-50 text-emerald-600 border-emerald-100",
          rejected: "bg-red-50 text-red-600 border-red-100",
        };
        const status = params.value as keyof typeof colors;
        return (
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${colors[status] || colors.pending}`}>
            {status}
          </span>
        );
      }
    },
    {
      headerName: "Actions",
      width: 150,
      cellRenderer: (params: any) => (
        <div className="flex gap-2 items-center h-full">
          <button
            onClick={() => setSelectedStartup(params.data)}
            className="text-indigo-600 hover:text-indigo-800 text-xs font-bold"
          >
            Details
          </button>
          <div className="w-px h-4 bg-slate-200 mx-1" />
          <button
            onClick={() => updateStatus(params.data.id, "approved")}
            className="text-emerald-600 hover:text-emerald-800 text-[10px] font-bold"
          >
            Approve
          </button>
        </div>
      )
    }
  ], [rowData]);

  return (
    <div className="flex flex-col h-full space-y-6 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Startups</h1>
          <p className="text-slate-500 mt-1">Review deep-dive applications and funding requests.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search startups..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Rocket className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total</p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.total}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Pending</p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.pending}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Rocket className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Approved</p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.approved}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Today</p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.today}</h3>
          </div>
        </div>
      </div>


      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col">
        <DataTable
          rowData={rowData}
          columnDefs={columnDefs}
          quickFilterText={searchText}
          paginationPageSize={20}
        />
      </div>

      {/* Details Modal */}
      {selectedStartup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedStartup(null)} />
          <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-full">
            {/* Modal Header */}
            <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-indigo-900 text-white">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl md:text-3xl font-bold">{selectedStartup.startupName}</h2>
                  <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
                    {selectedStartup.category}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-white/80 text-sm">
                  <span className="flex items-center gap-1.5"><User size={14} /> {selectedStartup.founderName}</span>
                  <span className="flex items-center gap-1.5"><Mail size={14} /> {selectedStartup.email}</span>
                  <span className="flex items-center gap-1.5"><Phone size={14} /> {selectedStartup.phone}</span>
                </div>
              </div>
              <button onClick={() => setSelectedStartup(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-10">
              {/* Product Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Target className="text-indigo-600" size={20} /> The Problem
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-sm bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    {selectedStartup.problem}
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Cpu className="text-indigo-600" size={20} /> The Solution
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-sm bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    {selectedStartup.solution}
                  </p>
                </div>
              </div>

              {/* Stats & Links */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100">
                  <p className="text-[10px] font-bold text-indigo-400 uppercase mb-1">Current Progress</p>
                  <p className="font-bold text-indigo-900 capitalize">{selectedStartup.progress}</p>
                </div>
                <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100">
                  <p className="text-[10px] font-bold text-emerald-400 uppercase mb-1">Revenue Stage</p>
                  <p className="font-bold text-emerald-900 capitalize">{selectedStartup.revenueStage}</p>
                </div>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Demo Link</p>
                  {selectedStartup.demoLink ? (
                    <a href={selectedStartup.demoLink} target="_blank" className="font-bold text-indigo-600 hover:underline flex items-center gap-1">
                      View Demo <ExternalLink size={12} />
                    </a>
                  ) : (
                    <p className="text-slate-400 italic">No link provided</p>
                  )}
                </div>
              </div>

              {/* Funding Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Coins className="text-indigo-600" size={20} /> Funding & Round Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 border border-slate-100 rounded-xl">
                    <p className="text-xs text-slate-400 mb-1">Monthly Burn</p>
                    <p className="font-bold text-slate-900">₹ {selectedStartup.burnRate || "N/A"}</p>
                  </div>
                  <div className="p-4 border border-slate-100 rounded-xl">
                    <p className="text-xs text-slate-400 mb-1">Current Round</p>
                    <p className="font-bold text-slate-900">₹ {selectedStartup.roundSize || "N/A"}</p>
                  </div>
                  <div className="p-4 border border-slate-100 rounded-xl">
                    <p className="text-xs text-slate-400 mb-1">Valuation</p>
                    <p className="font-bold text-slate-900">₹ {selectedStartup.valuation || "N/A"}</p>
                  </div>
                  <div className="p-4 border border-slate-100 rounded-xl">
                    <p className="text-xs text-slate-400 mb-1">Funding Raised</p>
                    <p className="font-bold text-slate-900 truncate" title={selectedStartup.funding}>{selectedStartup.funding || "None"}</p>
                  </div>
                </div>
                {selectedStartup.roundStructure && (
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">Round Structure</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{selectedStartup.roundStructure}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 md:p-8 border-t border-slate-100 bg-slate-50 flex justify-end gap-4">
              <button
                onClick={() => updateStatus(selectedStartup.id, "rejected")}
                className="px-6 py-2.5 rounded-xl border border-red-200 text-red-600 font-bold hover:bg-red-50 transition-colors"
              >
                Reject Application
              </button>
              <button
                onClick={() => updateStatus(selectedStartup.id, "approved")}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
              >
                Approve Startup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
