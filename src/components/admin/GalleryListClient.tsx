"use client";

import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { ColDef } from "ag-grid-community";
import { Eye, ImagePlus, Images, Search } from "lucide-react";
import DataTable from "@/components/DataTable";

type GalleryRow = {
  id: string;
  title: string;
  imageUrl: string;
  sortOrder: number;
  status: "published" | "draft";
  updatedAt: string;
};

type GalleryListClientProps = {
  initialItems: GalleryRow[];
  loadError?: boolean;
};

export default function GalleryListClient({
  initialItems,
  loadError = false,
}: GalleryListClientProps) {
  const [searchText, setSearchText] = useState("");
  const [rowData, setRowData] = useState<GalleryRow[]>(initialItems);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchGalleryItems = useCallback(async () => {
    try {
      setIsRefreshing(true);

      const res = await fetch("/api/admin/gallery");
      const data = await res.json();

      if (res.ok && Array.isArray(data)) {
        setRowData(data);
        return;
      }

      throw new Error(data.error || "Failed to load gallery items");
    } catch (error) {
      console.error("Failed to refresh gallery items:", error);
      alert("Failed to refresh gallery items");
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Are you sure you want to delete this gallery image?")) {
        return;
      }

      try {
        const res = await fetch(`/api/admin/gallery?id=${id}`, { method: "DELETE" });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Delete failed");
        }

        await fetchGalleryItems();
      } catch (error) {
        console.error("Delete failed:", error);
        alert("Failed to delete gallery image");
      }
    },
    [fetchGalleryItems]
  );

  const publishedCount = rowData.filter((item) => item.status === "published").length;
  const draftCount = rowData.filter((item) => item.status === "draft").length;

  const columnDefs = useMemo<ColDef<GalleryRow>[]>(
    () => [
      {
        field: "imageUrl",
        headerName: "Preview",
        width: 120,
        filter: false,
        sortable: false,
        cellRenderer: (params: { value: string; data: GalleryRow }) => (
          <div className="flex items-center h-full py-2">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-200">
              <Image
                src={params.value}
                alt={params.data.title}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
          </div>
        ),
      },
      { field: "title", headerName: "Title", flex: 2, minWidth: 220 },
      { field: "sortOrder", headerName: "Order", width: 110 },
      {
        field: "status",
        headerName: "Status",
        width: 130,
        cellRenderer: (params: { value: GalleryRow["status"] }) => {
          const isPublished = params.value === "published";
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-bold ${
                isPublished
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {isPublished ? "Published" : "Draft"}
            </span>
          );
        },
      },
      {
        field: "updatedAt",
        headerName: "Updated",
        width: 140,
        cellRenderer: (params: { value: string }) =>
          new Date(params.value).toLocaleDateString(),
      },
      {
        headerName: "Actions",
        width: 130,
        filter: false,
        sortable: false,
        cellRenderer: (params: { data: GalleryRow }) => (
          <div className="flex gap-2 items-center h-full">
            <Link
              href={`/admin/gallery/edit/${params.data.id}`}
              className="text-indigo-600 hover:text-indigo-800 text-xs font-bold"
            >
              Edit
            </Link>
            <button
              onClick={() => handleDelete(params.data.id)}
              className="text-red-600 hover:text-red-800 text-xs font-bold"
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    [handleDelete]
  );

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      filter: true,
    }),
    []
  );

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Gallery</h1>
          <p className="text-slate-500 mt-1">
            Manage the images shown on the public gallery page.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/gallery"
            className="px-5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors inline-flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Preview Page
          </Link>
          <Link
            href="/admin/gallery/new"
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-sm shadow-indigo-200"
          >
            <ImagePlus className="w-5 h-5" />
            Add Image
          </Link>
        </div>
      </div>

      {loadError && (
        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-sm">
          Gallery items could not be loaded from the database yet. Once the new
          Prisma schema is pushed, this page will populate normally.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Images className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
              Total Images
            </p>
            <h3 className="text-2xl font-bold text-slate-900">{rowData.length}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Images className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
              Published
            </p>
            <h3 className="text-2xl font-bold text-slate-900">{publishedCount}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-slate-100 text-slate-600 rounded-xl">
            <Images className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
              Drafts
            </p>
            <h3 className="text-2xl font-bold text-slate-900">{draftCount}</h3>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search gallery images..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <button
            onClick={() => void fetchGalleryItems()}
            disabled={isRefreshing}
            className="ml-4 shrink-0 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
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
