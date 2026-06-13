"use client";

import { useParams } from "next/navigation";
import GalleryForm from "@/components/admin/GalleryForm";

export default function EditGalleryPage() {
  const params = useParams();

  return <GalleryForm mode="edit" galleryId={params.id as string} />;
}
