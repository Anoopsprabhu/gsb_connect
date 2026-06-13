"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
  Users,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Image as ImageIcon,
  Loader2,
  ChevronRight,
  ArrowRight,
  Settings as SettingsIcon,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, GridReadyEvent } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import DataTable from "@/components/DataTable";
import { uploadImage } from "@/lib/upload-image";

type TeamMember = {
  id: string;
  name: string;
  designation: string;
  imageUrl: string | null;
  publicId: string | null;
  bio: string | null;
  sortOrder: number;
  status: string;
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"team" | "general">("team");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] =
    useState<Partial<TeamMember> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/team");
      const data = await res.json();
      setTeamMembers(data);
    } catch (error) {
      console.error("Failed to fetch team members:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const result = await uploadImage(file, "team");
      setEditingMember((prev) => ({
        ...prev,
        imageUrl: result.url,
        publicId: result.publicId,
      }));
    } catch (error) {
      console.error("Upload failed:", error);
      alert(error instanceof Error ? error.message : "Image upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember?.name || !editingMember?.designation) {
      alert("Name and designation are required");
      return;
    }

    try {
      setIsSubmitting(true);
      const isEditing = !!editingMember.id;
      const res = await fetch("/api/admin/team", {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingMember),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingMember(null);
        fetchTeamMembers();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to save team member");
      }
    } catch (error) {
      console.error("Submission failed:", error);
      alert("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteMember = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) return;

    try {
      const res = await fetch(`/api/admin/team?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchTeamMembers();
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: "imageUrl",
        headerName: "Photo",
        width: 80,
        cellRenderer: (params: any) => (
          <div className="flex items-center h-full">
            {params.value ? (
              <img
                src={params.value}
                className="w-8 h-8 rounded-full object-cover"
                alt=""
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                <Users className="w-4 h-4 text-slate-400" />
              </div>
            )}
          </div>
        ),
      },
      { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
      {
        field: "designation",
        headerName: "Designation",
        flex: 1,
        minWidth: 150,
      },
      { field: "sortOrder", headerName: "Order", width: 90, sortable: true },
      {
        field: "status",
        headerName: "Status",
        width: 120,
        cellRenderer: (params: any) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              params.value === "published"
                ? "bg-green-50 text-green-600"
                : "bg-slate-50 text-slate-600"
            }`}
          >
            {params.value}
          </span>
        ),
      },
      {
        headerName: "Actions",
        width: 120,
        cellRenderer: (params: any) => (
          <div className="flex gap-2 items-center h-full">
            <button
              onClick={() => {
                setEditingMember(params.data);
                setIsModalOpen(true);
              }}
              className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => deleteMember(params.data.id)}
              className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ),
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
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">
          Manage organization details and platform settings.
        </p>
      </div>

      <div className="flex gap-8 items-start">
        {/* Settings Navigation */}
        <div className="w-64 space-y-1 bg-white p-2 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab("team")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "team"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Users size={18} />
            Team Management
          </button>
          <button
            onClick={() => setActiveTab("general")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "general"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <SettingsIcon size={18} />
            General Settings
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-h-[600px]">
          {activeTab === "team" ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    Team Members
                  </h2>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Add and manage the people behind GSB Connect.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingMember({ status: "published", sortOrder: 0 });
                    setIsModalOpen(true);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
                >
                  <Plus size={18} /> Add Member
                </button>
              </div>

              <div className="flex-1 p-0 ag-theme-alpine w-full h-[500px]">
                <DataTable
                  rowData={teamMembers}
                  columnDefs={columnDefs}
                  defaultColDef={defaultColDef}
                  pagination
                  paginationPageSize={20}
                  loading={isLoading}
                />
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <SettingsIcon size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                General Settings Coming Soon
              </h3>
              <p className="text-slate-500 mt-1 max-w-xs mx-auto">
                This section will include site configuration, branding options,
                and metadata management.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Team Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">
                {editingMember?.id ? "Edit Team Member" : "Add New Member"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="flex justify-center mb-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-24 h-24 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-slate-50 transition-all overflow-hidden"
                >
                  {editingMember?.imageUrl ? (
                    <img
                      src={editingMember.imageUrl}
                      className="absolute inset-0 w-full h-full object-cover"
                      alt=""
                    />
                  ) : (
                    <>
                      {isUploading ? (
                        <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                      ) : (
                        <>
                          <ImageIcon size={20} className="text-slate-400" />
                          <span className="text-[10px] font-bold text-slate-500 mt-1 uppercase">
                            Photo
                          </span>
                        </>
                      )}
                    </>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingMember?.name || ""}
                    onChange={(e) =>
                      setEditingMember((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="e.g. Rajesh Prabhu"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Designation *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingMember?.designation || ""}
                    onChange={(e) =>
                      setEditingMember((prev) => ({
                        ...prev,
                        designation: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="e.g. Executive Director"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Bio (Optional)
                </label>
                <textarea
                  value={editingMember?.bio || ""}
                  onChange={(e) =>
                    setEditingMember((prev) => ({
                      ...prev,
                      bio: e.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                  placeholder="Short professional summary..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={editingMember?.sortOrder || 0}
                    onChange={(e) =>
                      setEditingMember((prev) => ({
                        ...prev,
                        sortOrder: parseInt(e.target.value),
                      }))
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Status
                  </label>
                  <select
                    value={editingMember?.status || "published"}
                    onChange={(e) =>
                      setEditingMember((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Save size={20} />
                  )}
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
