import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const webinar = await prisma.webinar.findUnique({
      where: { id },
      include: {
        _count: { select: { registrations: true } },
      },
    });

    if (!webinar) {
      return NextResponse.json(
        { error: "Webinar not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(webinar);
  } catch (error) {
    console.error("Failed to fetch webinar:", error);
    return NextResponse.json(
      { error: "Failed to fetch webinar" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Extract posterUrl and posterPublicId and remove them from the rest of the body
    const { posterUrl, posterPublicId, _count, registrationOpen, ...restBody } = body;

    const dataToUpdate: any = {
      ...restBody,
      date: restBody.date ? new Date(restBody.date) : undefined,
    };

    if (posterUrl !== undefined) {
      dataToUpdate.imageUrl = posterUrl || null;
    }
    
    if (posterPublicId !== undefined) {
      dataToUpdate.publicId = posterPublicId || null;
    }

    if (registrationOpen !== undefined) {
      dataToUpdate.registrationOpen = registrationOpen;
    }

    const webinar = await prisma.webinar.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json(webinar);
  } catch (error) {
    console.error("Failed to update webinar:", error);
    return NextResponse.json(
      { error: "Failed to update webinar" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.webinar.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete webinar:", error);
    return NextResponse.json(
      { error: "Failed to delete webinar" },
      { status: 500 }
    );
  }
}
