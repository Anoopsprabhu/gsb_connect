import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { destroyCloudinaryImage } from "@/lib/cloudinary";
import { getGalleryItemModel } from "@/lib/gallery-prisma";

function normalizeStatus(value: unknown) {
  return value === "draft" ? "draft" : "published";
}

function normalizeSortOrder(value: unknown) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0;
  }

  return Math.trunc(parsed);
}

function getGalleryErrorResponse(error: unknown, fallbackMessage: string) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2021") {
      return NextResponse.json(
        {
          error:
            "Gallery database table is missing. Run `npx prisma db push`, then restart `npm run dev`.",
        },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ error: fallbackMessage }, { status: 500 });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const limit = searchParams.get("limit");
    const status = searchParams.get("status");
    const galleryItemModel = getGalleryItemModel();

    if (id) {
      const galleryItem = await galleryItemModel.findUnique({
        where: { id },
      });

      if (!galleryItem) {
        return NextResponse.json({ error: "Gallery item not found" }, { status: 404 });
      }

      return NextResponse.json(galleryItem);
    }

    const galleryItems = await galleryItemModel.findMany({
      where: status ? { status: normalizeStatus(status) } : undefined,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      ...(limit ? { take: Number(limit) } : {}),
    });

    return NextResponse.json(galleryItems);
  } catch (error) {
    console.error("Failed to fetch gallery items:", error);
    return getGalleryErrorResponse(error, "Failed to fetch gallery items");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, caption, altText, imageUrl, publicId, sortOrder, status } = body;
    const galleryItemModel = getGalleryItemModel();

    if (!title || !imageUrl || !publicId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const galleryItem = await galleryItemModel.create({
      data: {
        title: String(title).trim(),
        caption: caption?.trim() || null,
        altText: altText?.trim() || null,
        imageUrl,
        publicId,
        sortOrder: normalizeSortOrder(sortOrder),
        status: normalizeStatus(status),
      },
    });

    return NextResponse.json(galleryItem);
  } catch (error) {
    console.error("Failed to create gallery item:", error);
    return getGalleryErrorResponse(error, "Failed to create gallery item");
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, title, caption, altText, imageUrl, publicId, sortOrder, status } = body;
    const galleryItemModel = getGalleryItemModel();

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const existing = await galleryItemModel.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Gallery item not found" }, { status: 404 });
    }

    const galleryItem = await galleryItemModel.update({
      where: { id },
      data: {
        title: title?.trim(),
        caption: caption?.trim() || null,
        altText: altText?.trim() || null,
        imageUrl,
        publicId,
        sortOrder: sortOrder === undefined ? undefined : normalizeSortOrder(sortOrder),
        status: status ? normalizeStatus(status) : undefined,
      },
    });

    if (existing.publicId && publicId && existing.publicId !== publicId) {
      await destroyCloudinaryImage(existing.publicId);
    }

    return NextResponse.json(galleryItem);
  } catch (error) {
    console.error("Failed to update gallery item:", error);
    return getGalleryErrorResponse(error, "Failed to update gallery item");
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const galleryItemModel = getGalleryItemModel();

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const existing = await galleryItemModel.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Gallery item not found" }, { status: 404 });
    }

    await galleryItemModel.delete({
      where: { id },
    });

    if (existing.publicId) {
      await destroyCloudinaryImage(existing.publicId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete gallery item:", error);
    return getGalleryErrorResponse(error, "Failed to delete gallery item");
  }
}
