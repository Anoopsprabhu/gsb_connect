import prisma from "@/lib/prisma";

type GalleryDelegate = {
  findMany: (...args: unknown[]) => Promise<unknown>;
  findUnique: (...args: unknown[]) => Promise<unknown>;
  create: (...args: unknown[]) => Promise<unknown>;
  update: (...args: unknown[]) => Promise<unknown>;
  delete: (...args: unknown[]) => Promise<unknown>;
};

export function getGalleryItemModel() {
  const galleryItem = (prisma as typeof prisma & {
    galleryItem?: GalleryDelegate;
  }).galleryItem;

  if (!galleryItem) {
    throw new Error("Prisma gallery model is not available yet. Refresh the Prisma client.");
  }

  return galleryItem;
}
