import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { destroyCloudinaryImage } from "@/lib/cloudinary";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const team = await prisma.teamMember.findMany({
      where: status ? { status } : {},
      select: {
        id: true,
        name: true,
        designation: true,
        imageUrl: true,
        sortOrder: true,
        status: true,
        createdAt: true,
      },
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(team);
  } catch (error) {
    console.error("Failed to fetch team members:", error);
    return NextResponse.json({ error: "Failed to fetch team members" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, designation, imageUrl, publicId, bio, sortOrder, status } = body;

    if (!name || !designation) {
      return NextResponse.json({ error: "Name and designation are required" }, { status: 400 });
    }

    const member = await prisma.teamMember.create({
      data: {
        name,
        designation,
        imageUrl,
        publicId,
        bio,
        sortOrder: Number(sortOrder || 0),
        status: status || "published",
      },
    });

    return NextResponse.json(member);
  } catch (error) {
    console.error("Failed to create team member:", error);
    return NextResponse.json({ error: "Failed to create team member" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, name, designation, imageUrl, publicId, bio, sortOrder, status } = body;

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const existing = await prisma.teamMember.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 });
    }

    const member = await prisma.teamMember.update({
      where: { id },
      data: {
        name,
        designation,
        imageUrl,
        publicId,
        bio,
        sortOrder: sortOrder !== undefined ? Number(sortOrder) : undefined,
        status,
      },
    });

    if (existing.publicId && publicId && existing.publicId !== publicId) {
      await destroyCloudinaryImage(existing.publicId);
    }

    return NextResponse.json(member);
  } catch (error) {
    console.error("Failed to update team member:", error);
    return NextResponse.json({ error: "Failed to update team member" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const existing = await prisma.teamMember.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 });
    }

    await prisma.teamMember.delete({
      where: { id },
    });

    if (existing.publicId) {
      await destroyCloudinaryImage(existing.publicId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete team member:", error);
    return NextResponse.json({ error: "Failed to delete team member" }, { status: 500 });
  }
}
