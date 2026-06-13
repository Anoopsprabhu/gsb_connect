"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import DataTable from "@/components/DataTable";
import {
  Search,
  Download,
  Trash2,
  User,
  Mail,
  Phone,
  Calendar as CalendarIcon,
  MapPin,
  Briefcase,
  GraduationCap,
  Info,
} from "lucide-react";
import { ColDef } from "ag-grid-community";
import { format } from "date-fns";

export default function RegistrationsPage() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId");
  const [rowData, setRowData] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, today: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedReg, setSelectedReg] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, [eventId]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const url = eventId 
        ? `/api/admin/registrations?eventId=${eventId}`
        : "/api/admin/registrations";
        
      const [regRes, statsRes] = await Promise.all([
        fetch(url),
        fetch("/api/admin/stats")
      ]);
      
      const regData = await regRes.json();
      const statsData = await statsRes.json();

      if (Array.isArray(regData)) {
        setRowData(regData);
      }

      if (statsData.sections?.registrations) {
        setStats(statsData.sections.registrations);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRegistration = async (id: string) => {
    if (confirm("Are you sure you want to delete this registration?")) {
      try {
        await fetch(`/api/admin/registrations?id=${id}`, { method: "DELETE" });
        fetchData();
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: "fullName",
        headerName: "Full Name",
        flex: 1.5,
        minWidth: 180,
        cellRenderer: (params: any) => (
          <div className="flex flex-col py-1">
            <span className="font-bold text-slate-900 leading-tight">
              {params.value}
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">
              {params.data.category}
            </span>
          </div>
        ),
      },
      {
        field: "event.title",
        headerName: "Event",
        flex: 1.5,
        minWidth: 200,
        cellRenderer: (params: any) => (
          <span className="font-medium text-indigo-600">{params.value}</span>
        ),
      },
      { field: "email", headerName: "Email", flex: 1.2, minWidth: 200 },
      { field: "phone", headerName: "Phone", flex: 1, minWidth: 140 },
      {
        field: "age",
        headerName: "Age",
        width: 80,
        cellRenderer: (params: any) => (
          <div className="flex flex-col items-center justify-center h-full">
            <span className="font-bold text-slate-700">{params.value}</span>
          </div>
        ),
      },
      {
        field: "createdAt",
        headerName: "Registered On",
        flex: 1,
        minWidth: 150,
        valueFormatter: (params: any) => {
          if (!params.value) return "N/A";
          try {
            return format(new Date(params.value), "MMM d, yyyy HH:mm");
          } catch (e) {
            return "Invalid Date";
          }
        },
      },
      {
        headerName: "Actions",
        cellRenderer: (params: any) => (
          <div className="flex gap-2 items-center h-full">
            <button
              onClick={() => setSelectedReg(params.data)}
              className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
              title="View Details"
            >
              <Info className="w-4 h-4" />
            </button>
            <button
              onClick={() => deleteRegistration(params.data.id)}
              className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ),
        width: 100,
        pinned: "right",
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {eventId && rowData.length > 0 
              ? `Registrations: ${rowData[0].event.title}` 
              : "Event Registrations"}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-slate-500">
              {eventId 
                ? "Showing participants for this specific event." 
                : "Review and manage registrations for all events."}
            </p>
            {eventId && (
              <Link 
                href="/admin/registrations"
                className="text-indigo-600 hover:text-indigo-800 text-sm font-bold flex items-center gap-1 ml-2"
              >
                View All Registrations →
              </Link>
            )}
          </div>
        </div>
        <button
          onClick={() => {
            // CSV Export Logic
            const headers = [
              "Name",
              "Email",
              "Phone",
              "DOB",
              "Age",
              "Event",
              "Address",
              "City",
              "State",
              "Country",
              "Pincode",
              "Profession",
              "Category",
              "Interest",
              "Date",
            ];
            const csvData = rowData
              .map((r) => {
                let dobStr = "N/A";
                let createdStr = "N/A";
                try {
                  if (r.dob) dobStr = format(new Date(r.dob), "yyyy-MM-dd");
                  if (r.createdAt) createdStr = format(new Date(r.createdAt), "yyyy-MM-dd HH:mm");
                } catch (e) {}

                return [
                  `"${r.fullName}"`,
                  r.email,
                  `"${r.phone}"`,
                  dobStr,
                  r.age,
                  `"${r.event.title}"`,
                  `"${r.address}"`,
                  r.city,
                  r.state,
                  r.country,
                  r.pincode,
                  `"${r.profession}"`,
                  r.category,
                  `"${r.interest.replace(/"/g, '""')}"`,
                  createdStr,
                ].join(",");
              })
              .join("\n");

            const blob = new Blob([headers.join(",") + "\n" + csvData], {
              type: "text/csv",
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.setAttribute("href", url);
            a.setAttribute(
              "download",
              `registrations_${format(new Date(), "yyyy-MM-dd")}.csv`,
            );
            a.click();
          }}
          className="bg-white text-slate-700 border border-slate-300 px-5 py-2.5 rounded-lg font-bold hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <User className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total</p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.total}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Pending</p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.pending}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <User className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Confirmed</p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.confirmed}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Today</p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.today}</h3>
          </div>
        </div>
      </div>


      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search registrations..."
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
            loading={isLoading}
          />
        </div>
      </div>

      {/* Details Modal */}
      {selectedReg && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Registration Details
                </h2>
                <p className="text-sm text-indigo-600 font-medium mt-1">
                  {selectedReg.event.title}
                </p>
              </div>
              <button
                onClick={() => setSelectedReg(null)}
                className="text-slate-400 hover:text-slate-600 p-2 hover:bg-white rounded-full transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <DetailItem
                    icon={<User />}
                    label="Full Name"
                    value={selectedReg.fullName}
                  />
                  <DetailItem
                    icon={<Mail />}
                    label="Email Address"
                    value={selectedReg.email}
                  />
                  <DetailItem
                    icon={<Phone />}
                    label="Phone Number"
                    value={selectedReg.phone}
                  />
                  <DetailItem
                    icon={<CalendarIcon />}
                    label="Date of Birth / Age"
                    value={(() => {
                      if (!selectedReg.dob) return `N/A (${selectedReg.age} years)`;
                      try {
                        return `${format(new Date(selectedReg.dob), "MMM d, yyyy")} (${selectedReg.age} years)`;
                      } catch (e) {
                        return `Invalid Date (${selectedReg.age} years)`;
                      }
                    })()}
                  />
                </div>
                <div className="space-y-6">
                  <DetailItem
                    icon={<MapPin />}
                    label="Location"
                    value={`${selectedReg.address}, ${selectedReg.city}, ${selectedReg.state}, ${selectedReg.country} - ${selectedReg.pincode}`}
                  />
                  <DetailItem
                    icon={<Briefcase />}
                    label="Profession"
                    value={selectedReg.profession}
                  />
                  <DetailItem
                    icon={<GraduationCap />}
                    label="Category"
                    value={selectedReg.category}
                  />
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Info className="w-3.5 h-3.5" />
                  Motivation / Interest
                </h4>
                <p className="text-slate-700 bg-slate-50 p-4 rounded-xl text-sm leading-relaxed border border-slate-100 italic">
                  "{selectedReg.interest}"
                </p>
              </div>
            </div>

            <div className="p-6 bg-slate-50/80 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedReg(null)}
                className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-100 transition-all shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {label}
        </p>
        <p className="font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function X(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
