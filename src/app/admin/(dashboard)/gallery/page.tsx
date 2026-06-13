import GalleryListClient from "@/components/admin/GalleryListClient";
import { getGalleryItemModel } from "@/lib/gallery-prisma";

export default async function GalleryListPage() {
  let initialItems: {
    id: string;
    title: string;
    imageUrl: string;
    sortOrder: number;
    status: "published" | "draft";
    updatedAt: string;
  }[] = [];
  let loadError = false;

  try {
    const galleryItem = getGalleryItemModel();

    const galleryItems = (await galleryItem.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        title: true,
        imageUrl: true,
        sortOrder: true,
        status: true,
        updatedAt: true,
      },
    })) as {
      id: string;
      title: string;
      imageUrl: string;
      sortOrder: number;
      status: string;
      updatedAt: Date;
    }[];

    initialItems = galleryItems.map((item) => ({
      ...item,
      status: item.status === "draft" ? "draft" : "published",
      updatedAt: item.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error("Failed to load admin gallery items:", error);
    loadError = true;
  }

  return <GalleryListClient initialItems={initialItems} loadError={loadError} />;
}
