"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Users, ArrowLeft, Mail, Phone, Building2 } from "lucide-react";
import { ColDef } from "ag-grid-community";
import DataTable from "@/components/DataTable";

interface WebinarRegistration {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  organization: string | null;
  interest: string | null;
  status: string;
  createdAt: string;
  webinar: {
    id: string;
    title: string;
  };
}

export default function AdminWebinarRegistrationsPage() {
  const [registrations, setRegistrations] = useState<WebinarRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const res = await fetch("/api/webinars/registrations");
        if (res.ok) {
          const data = await res.json();
          setRegistrations(data);
        }
      } catch (error) {
        console.error("Failed to fetch registrations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRegistrations();
  }, []);

  const colDefs: ColDef<WebinarRegistration>[] = [
    {
      headerName: "Registrant",
      field: "fullName",
      cellRenderer: (params: any) => (
        <div className="flex items-center gap-3 h-full">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
            {params.value?.charAt(0).toUpperCase()}
          </div>
          <span className="font-semibold text-slate-900 text-sm">
            {params.value}
          </span>
        </div>
      ),
      minWidth: 200,
    },
    {
      headerName: "Contact",
      field: "email",
      cellRenderer: (params: any) => (
        <div className="flex flex-col justify-center h-full space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Mail className="w-3 h-3 text-slate-400" />
            {params.data.email}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Phone className="w-3 h-3 text-slate-400" />
            {params.data.phone}
          </div>
        </div>
      ),
      minWidth: 220,
    },
    {
      headerName: "Organization",
      field: "organization",
      cellRenderer: (params: any) => (
        <div className="flex items-center gap-1.5 text-sm text-slate-600 h-full">
          <Building2 className="w-3 h-3 text-slate-400" />
          {params.value || "—"}
        </div>
      ),
      minWidth: 150,
    },
    {
      headerName: "Webinar",
      field: "webinar.title",
      cellRenderer: (params: any) => (
        <div className="flex items-center h-full">
          <Link
            href={`/webinars/${params.data.webinar.id}`}
            target="_blank"
            className="text-sm font-medium text-indigo-600 hover:underline truncate max-w-full"
          >
            {params.value}
          </Link>
        </div>
      ),
      minWidth: 200,
    },
    {
      headerName: "Registered At",
      field: "createdAt",
      cellRenderer: (params: any) => (
        <div className="flex items-center text-sm text-slate-500 h-full">
          {format(new Date(params.value), "MMM d, yyyy h:mm a")}
        </div>
      ),
      minWidth: 180,
    },
    {
      headerName: "Status",
      field: "status",
      cellRenderer: (params: any) => (
        <div className="flex items-center justify-center h-full w-full">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${params.value === "confirmed"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
              }`}
          >
            {params.value}
          </span>
        </div>
      ),
      width: 130,
      minWidth: 130,
    },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl w-full mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link
            href="/admin/webinars"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Webinars
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            Webinar Registrations
          </h1>
          <p className="text-slate-500 mt-1">
            {registrations.length} total registration
            {registrations.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-1">
        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            Loading registrations...
          </div>
        ) : registrations.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Users className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p className="text-lg font-medium text-slate-700">
              No registrations yet
            </p>
            <p className="text-sm mt-1">
              Registrations will appear here when users sign up for webinars.
            </p>
          </div>
        ) : (
          <DataTable
            rowData={registrations}
            columnDefs={colDefs}
            rowHeight={64}
            containerClassName="h-[600px]"
          />
        )}
      </div>
    </div>
  );
}
