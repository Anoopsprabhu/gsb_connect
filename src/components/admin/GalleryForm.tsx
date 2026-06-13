"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlignLeft,
  ArrowLeft,
  Image as ImageIcon,
  Loader2,
  Settings2,
  TextCursorInput,
} from "lucide-react";
import { uploadImage } from "@/lib/upload-image";

type GalleryFormMode = "create" | "edit";

type GalleryFormProps = {
  mode: GalleryFormMode;
  galleryId?: string;
};

type GalleryFormState = {
  title: string;
  caption: string;
  altText: string;
  imageUrl: string;
  publicId: string;
  sortOrder: string;
  status: "published" | "draft";
};

const initialFormState: GalleryFormState = {
  title: "",
  caption: "",
  altText: "",
  imageUrl: "",
  publicId: "",
  sortOrder: "0",
  status: "published",
};

export default function GalleryForm({ mode, galleryId }: GalleryFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<GalleryFormState>(initialFormState);
  const [isLoading, setIsLoading] = useState(mode === "edit");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mode !== "edit" || !galleryId) {
      return;
    }

    const fetchGalleryItem = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/admin/gallery?id=${galleryId}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load gallery item");
        }

        setFormData({
          title: data.title || "",
          caption: data.caption || "",
          altText: data.altText || "",
          imageUrl: data.imageUrl || "",
          publicId: data.publicId || "",
          sortOrder: String(data.sortOrder ?? 0),
          status: data.status === "draft" ? "draft" : "published",
        });
      } catch (error) {
        console.error("Failed to fetch gallery item:", error);
        alert("Failed to load gallery item");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGalleryItem();
  }, [galleryId, mode]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      setIsUploading(true);
      const result = await uploadImage(file, "gallery");

      setFormData((prev) => ({
        ...prev,
        imageUrl: result.url,
        publicId: result.publicId,
        altText: prev.altText || prev.title || file.name.replace(/\.[^/.]+$/, ""),
      }));
    } catch (error) {
      console.error("Upload failed:", error);
      alert(error instanceof Error ? error.message : "Image upload failed");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (nextStatus: "published" | "draft") => {
    if (!formData.title.trim()) {
      alert("Please enter a title for this gallery image.");
      return;
    }

    if (!formData.imageUrl || !formData.publicId) {
      alert("Please upload an image before saving.");
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await fetch("/api/admin/gallery", {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(mode === "edit" ? { id: galleryId } : {}),
          ...formData,
          status: nextStatus,
          sortOrder: Number(formData.sortOrder || 0),
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to save gallery item");
      }

      router.push("/admin/gallery");
      router.refresh();
    } catch (error) {
      console.error("Submission failed:", error);
      alert(error instanceof Error ? error.message : "Failed to save gallery item");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const isEditMode = mode === "edit";

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <Link
            href="/admin/gallery"
            className="inline-flex items-center text-sm text-slate-500 hover:text-indigo-600 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Gallery
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">
            {isEditMode ? "Edit Gallery Image" : "Add Gallery Image"}
          </h1>
          <p className="text-slate-500 mt-1">
            {isEditMode
              ? "Update the image details, display text, and publish state."
              : "Upload a new image that will appear on the public gallery page."}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => handleSubmit("draft")}
            disabled={isSubmitting || isUploading}
            className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
          >
            {isEditMode ? "Save as Draft" : "Create Draft"}
          </button>
          <button
            onClick={() => handleSubmit("published")}
            disabled={isSubmitting || isUploading}
            className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEditMode ? "Update & Publish" : "Publish Image"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <AlignLeft className="w-5 h-5 text-indigo-500" />
              Gallery Details
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="e.g. Annual Cultural Night Highlights"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Caption
                </label>
                <textarea
                  name="caption"
                  value={formData.caption}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                  placeholder="Add a short description for this image..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Alt Text
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <TextCursorInput className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="altText"
                    value={formData.altText}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="Describe the image for accessibility"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-indigo-500" />
              Gallery Image
            </h2>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
              accept="image/*"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed border-slate-300 rounded-xl p-5 text-center hover:bg-slate-50 hover:border-indigo-400 transition-colors cursor-pointer group relative overflow-hidden min-h-72 ${
                formData.imageUrl ? "border-solid border-indigo-500" : ""
              }`}
            >
              {formData.imageUrl ? (
                <>
                  <Image
                    src={formData.imageUrl}
                    alt={formData.altText || formData.title || "Gallery preview"}
                    fill
                    sizes="(min-width: 1024px) 320px, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent px-4 py-4 text-left">
                    <p className="text-sm font-semibold text-white">{formData.title || "Gallery preview"}</p>
                    <p className="text-xs text-white/80 mt-1">
                      Click to replace this image
                    </p>
                  </div>
                </>
              ) : (
                <div className="min-h-60 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    {isUploading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <ImageIcon className="w-6 h-6" />
                    )}
                  </div>
                  <p className="text-sm font-medium text-slate-700">Click to upload image</p>
                  <p className="text-xs text-slate-500 mt-1">
                    PNG, JPG, WEBP, or GIF supported
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-indigo-500" />
              Publishing
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Sort Order
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  name="sortOrder"
                  value={formData.sortOrder}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all appearance-none"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
                <p className="text-xs text-slate-500 mt-2">
                  The save buttons above will also set the final status directly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
