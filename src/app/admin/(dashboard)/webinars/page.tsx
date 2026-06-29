"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import DataTable from "@/components/DataTable";
import {
  Video,
  Plus,
  Search,
  Users,
  ExternalLink,
  Upload,
  X,
  Loader2,
  ImageIcon,
} from "lucide-react";
import { ColDef } from "ag-grid-community";
import { uploadImage } from "@/lib/upload-image";

export default function AdminWebinarsPage() {
  const [searchText, setSearchText] = useState("");
  const [rowData, setRowData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [uploadingPoster, setUploadingPoster] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    about: "",
    date: "",
    startTime: "",
    endTime: "",
    speakers: "",
    platform: "Zoom",
    webinarLink: "",
    posterUrl: "",
    posterPublicId: "",
  });

  const fetchWebinars = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/webinars?all=true");
      if (res.ok) {
        const data = await res.json();
        setRowData(data);
      }
    } catch (error) {
      console.error("Failed to fetch webinars:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWebinars();
  }, []);

  const handlePosterSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPosterFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPosterPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removePoster = () => {
    setPosterFile(null);
    setPosterPreview(null);
    setFormData((prev) => ({ ...prev, posterUrl: "", posterPublicId: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEditClick = useCallback((data: any) => {
    setEditingId(data.id);
    setFormData({
      title: data.title || "",
      description: data.description || "",
      about: data.about || "",
      date: data.date ? new Date(data.date).toISOString().slice(0, 16) : "",
      startTime: data.startTime || "",
      endTime: data.endTime || "",
      speakers: data.speakers || "",
      platform: data.platform || "Zoom",
      webinarLink: data.webinarLink || "",
      posterUrl: data.imageUrl || "",
      posterPublicId: data.publicId || "",
    });
    setPosterPreview(data.imageUrl || null);
    setPosterFile(null);
    setShowCreateForm(true);
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      let posterUrl = formData.posterUrl;
      let posterPublicId = formData.posterPublicId;

      // Upload poster to Cloudinary if a file was selected
      if (posterFile) {
        setUploadingPoster(true);
        try {
          const result = await uploadImage(posterFile, "webinars");
          posterUrl = result.url;
          posterPublicId = result.publicId;
        } catch (err) {
          console.error("Poster upload failed:", err);
          alert("Failed to upload poster image. Please try again.");
          setCreating(false);
          setUploadingPoster(false);
          return;
        }
        setUploadingPoster(false);
      }

      const url = editingId ? `/api/webinars/${editingId}` : "/api/webinars";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          posterUrl,
          posterPublicId,
        }),
      });

      if (res.ok) {
        setShowCreateForm(false);
        setEditingId(null);
        setFormData({
          title: "",
          description: "",
          about: "",
          date: "",
          startTime: "",
          endTime: "",
          speakers: "",
          platform: "Zoom",
          webinarLink: "",
          posterUrl: "",
          posterPublicId: "",
        });
        removePoster();
        fetchWebinars();
      }
    } catch (error) {
      console.error("Failed to create webinar:", error);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("Are you sure you want to delete this webinar?")) return;
    try {
      const res = await fetch(`/api/webinars/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchWebinars();
      }
    } catch (error) {
      console.error("Failed to delete webinar:", error);
    }
  }, []);

  const toggleRegistration = useCallback(
    async (id: string, currentStatus: boolean) => {
      try {
        const res = await fetch(`/api/webinars/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ registrationOpen: !currentStatus }),
        });
        if (res.ok) {
          fetchWebinars();
        }
      } catch (error) {
        console.error("Failed to toggle registration:", error);
      }
    },
    []
  );

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        headerName: "Poster",
        field: "imageUrl",
        width: 80,
        sortable: false,
        filter: false,
        cellRenderer: (params: any) => {
          const url = params.data.imageUrl;
          return url ? (
            <div className="flex items-center justify-center h-full">
              <img
                src={url}
                alt="Poster"
                className="w-10 h-10 rounded-lg object-cover border border-slate-200"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                <ImageIcon className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          );
        },
      },
      {
        field: "title",
        headerName: "Webinar Title",
        flex: 2,
        minWidth: 250,
        cellRenderer: (params: any) => (
          <div className="flex flex-col justify-center h-full">
            <span className="font-semibold text-slate-900 truncate">
              {params.value}
            </span>
            {params.data.webinarLink && (
              <a
                href={params.data.webinarLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-indigo-600 flex items-center gap-1 hover:underline"
              >
                <ExternalLink className="w-3 h-3" />
                Meeting Link
              </a>
            )}
          </div>
        ),
      },
      {
        field: "date",
        headerName: "Date & Time",
        flex: 1,
        minWidth: 160,
        cellRenderer: (params: any) => {
          const d = new Date(params.value);
          return (
            <div className="flex flex-col justify-center h-full">
              <span className="text-sm text-slate-900">
                {d.toLocaleDateString("en-IN", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="text-xs text-slate-400">
                {params.data.startTime || "TBA"}
                {params.data.endTime ? ` – ${params.data.endTime}` : ""}
              </span>
            </div>
          );
        },
      },
      {
        field: "platform",
        headerName: "Platform",
        width: 130,
        cellRenderer: (params: any) => (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
            {params.value}
          </span>
        ),
      },
      {
        field: "speakers",
        headerName: "Speakers",
        flex: 1,
        minWidth: 150,
        cellRenderer: (params: any) => (
          <span className="text-sm text-slate-600 truncate block">
            {params.value || "—"}
          </span>
        ),
      },
      {
        headerName: "Registrations",
        field: "_count.registrations",
        width: 130,
        cellRenderer: (params: any) => (
          <div className="flex items-center gap-2 h-full">
            <span className="font-bold text-slate-700">
              {params.data._count?.registrations || 0}
            </span>
            <Link
              href="/admin/webinars/registrations"
              className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md hover:bg-indigo-100 transition-colors"
            >
              View
            </Link>
          </div>
        ),
      },
      {
        headerName: "Registration",
        field: "registrationOpen",
        width: 120,
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
              title={
                isOpen
                  ? "Click to close registrations"
                  : "Click to open registrations"
              }
            >
              {isOpen ? "Open" : "Closed"}
            </button>
          );
        },
      },
      {
        field: "status",
        headerName: "Status",
        width: 110,
        cellRenderer: (params: any) => {
          const status = params.value;
          const colorClass =
            status === "published"
              ? "bg-emerald-50 text-emerald-700"
              : status === "draft"
                ? "bg-slate-50 text-slate-600"
                : "bg-amber-50 text-amber-700";
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-bold capitalize ${colorClass}`}
            >
              {status}
            </span>
          );
        },
      },
      {
        headerName: "Actions",
        width: 170,
        sortable: false,
        filter: false,
        cellRenderer: (params: any) => (
          <div className="flex gap-2 items-center h-full">
            <button
              onClick={() => handleEditClick(params.data)}
              className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors text-sm"
              title="Edit Webinar"
            >
              Edit
            </button>
            <Link
              href={`/webinars/${params.data.id}`}
              target="_blank"
              className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors text-sm"
              title="View Webinar"
            >
              View
            </Link>
            <button
              onClick={() => handleDelete(params.data.id)}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors text-sm"
              title="Delete Webinar"
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    [toggleRegistration, handleDelete, handleEditClick]
  );

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      filter: true,
    }),
    []
  );

  const stats = useMemo(() => {
    const total = rowData.length;
    const totalRegs = rowData.reduce(
      (sum, w) => sum + (w._count?.registrations || 0),
      0
    );
    const platforms = new Set(rowData.map((w) => w.platform)).size;
    return { total, totalRegs, platforms };
  }, [rowData]);

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Webinars</h1>
          <p className="text-slate-500 mt-1">
            Manage webinars, track registrations, and upload posters.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/webinars/registrations"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Users className="w-4 h-4" />
            Registrations
          </Link>
          <button
            onClick={() => {
              setEditingId(null);
              setFormData({
                title: "", description: "", about: "", date: "", startTime: "", endTime: "", speakers: "", platform: "Zoom", webinarLink: "", posterUrl: "", posterPublicId: "",
              });
              removePoster();
              setShowCreateForm(!showCreateForm);
            }}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-sm shadow-indigo-200"
          >
            <Plus className="w-5 h-5" />
            Create Webinar
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
              Total Webinars
            </p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.total}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
              Total Registrations
            </p>
            <h3 className="text-2xl font-bold text-slate-900">
              {stats.totalRegs}
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
              Platforms
            </p>
            <h3 className="text-2xl font-bold text-slate-900">
              {stats.platforms}
            </h3>
          </div>
        </div>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            {editingId ? "Edit Webinar" : "Create New Webinar"}
          </h2>
          <form onSubmit={handleCreate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  placeholder="Webinar title"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Date *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Description *
              </label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none"
                placeholder="Brief description of the webinar"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                About (Detailed)
              </label>
              <textarea
                rows={4}
                value={formData.about}
                onChange={(e) =>
                  setFormData({ ...formData, about: e.target.value })
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none"
                placeholder="Detailed description shown on the webinar detail page"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Start Time
                </label>
                <input
                  type="text"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  placeholder="e.g. 3:00 PM"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  End Time
                </label>
                <input
                  type="text"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  placeholder="e.g. 4:30 PM"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Platform
                </label>
                <select
                  value={formData.platform}
                  onChange={(e) =>
                    setFormData({ ...formData, platform: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none appearance-none"
                >
                  <option value="Zoom">Zoom</option>
                  <option value="Google Meet">Google Meet</option>
                  <option value="Microsoft Teams">Microsoft Teams</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Speakers (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.speakers}
                  onChange={(e) =>
                    setFormData({ ...formData, speakers: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  placeholder="e.g. John Doe, Jane Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Webinar Link (Zoom/Meet URL)
                </label>
                <input
                  type="url"
                  value={formData.webinarLink}
                  onChange={(e) =>
                    setFormData({ ...formData, webinarLink: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  placeholder="https://zoom.us/j/..."
                />
              </div>
            </div>

            {/* Poster Upload */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Poster Image
              </label>
              <div className="flex items-start gap-6">
                {/* Upload Area */}
                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePosterSelect}
                    className="hidden"
                    id="poster-upload"
                  />
                  <label
                    htmlFor="poster-upload"
                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all group"
                  >
                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-indigo-500 mb-2 transition-colors" />
                    <span className="text-sm font-semibold text-slate-500 group-hover:text-indigo-600 transition-colors">
                      Click to upload poster
                    </span>
                    <span className="text-xs text-slate-400 mt-1">
                      PNG, JPG up to 5MB
                    </span>
                  </label>

                  {/* OR enter URL */}
                  <div className="mt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-px flex-1 bg-slate-200" />
                      <span className="text-xs font-medium text-slate-400">
                        OR paste URL
                      </span>
                      <div className="h-px flex-1 bg-slate-200" />
                    </div>
                    <input
                      type="url"
                      value={formData.posterUrl}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          posterUrl: e.target.value,
                        });
                        if (e.target.value) {
                          setPosterPreview(e.target.value);
                          setPosterFile(null);
                        }
                      }}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                      placeholder="https://example.com/poster.jpg"
                    />
                  </div>
                </div>

                {/* Preview */}
                {posterPreview && (
                  <div className="relative w-40 h-40 rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex-shrink-0">
                    <img
                      src={posterPreview}
                      alt="Poster preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removePoster}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingId(null);
                  removePoster();
                }}
                className="px-6 py-3 text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating}
                className="px-6 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/25 disabled:opacity-50 flex items-center gap-2"
              >
                {creating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {uploadingPoster
                      ? "Uploading Poster..."
                      : editingId
                        ? "Updating..."
                        : "Creating..."}
                  </>
                ) : editingId ? (
                  "Update Webinar"
                ) : (
                  "Create Webinar"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* AG Grid Container */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search webinars..."
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
