import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { destroyCloudinaryImage } from "@/lib/cloudinary";

function buildEventUpdateData(body: Record<string, unknown>): Prisma.EventUpdateInput {
  const {
    title,
    description,
    about,
    date,
    startTime,
    endTime,
    location,
    mapUrl,
    type,
    topic,
    imageUrl,
    publicId,
    roadmap,
    speakers,
    featured,
    status,
    registrationOpen,
  } = body;

  const data: Prisma.EventUpdateInput = {};

  if (title !== undefined) data.title = String(title);
  if (description !== undefined) data.description = String(description);
  if (about !== undefined) data.about = about ? String(about) : null;
  if (date) data.date = new Date(String(date));
  if (startTime !== undefined) data.startTime = startTime ? String(startTime) : null;
  if (endTime !== undefined) data.endTime = endTime ? String(endTime) : null;
  if (location !== undefined) data.location = String(location);
  if (mapUrl !== undefined) data.mapUrl = mapUrl ? String(mapUrl) : null;
  if (type !== undefined) data.type = String(type);
  if (topic !== undefined) data.topic = topic ? String(topic) : null;
  if (imageUrl !== undefined) data.imageUrl = imageUrl ? String(imageUrl) : null;
  if (publicId !== undefined) data.publicId = publicId ? String(publicId) : null;
  if (roadmap !== undefined) data.roadmap = roadmap as Prisma.InputJsonValue;
  if (speakers !== undefined) data.speakers = speakers ? String(speakers) : null;
  if (featured !== undefined) data.featured = featured ? String(featured) : null;
  if (status !== undefined) data.status = String(status);
  if (registrationOpen !== undefined) data.registrationOpen = Boolean(registrationOpen);

  return data;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const limit = searchParams.get("limit");

    if (id) {
      const event = await prisma.event.findUnique({
        where: { id },
      });
      if (!event) {
        return NextResponse.json({ error: "Event not found" }, { status: 404 });
      }
      return NextResponse.json(event);
    }

    const events = await prisma.event.findMany({
      select: {
        id: true,
        title: true,
        date: true,
        location: true,
        type: true,
        status: true,
        registrationOpen: true,
        _count: {
          select: { registrations: true },
        },
      },
      orderBy: { date: "desc" },
      ...(limit ? { take: parseInt(limit) } : {}),
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const existing = await prisma.event.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    await prisma.event.delete({ where: { id } });

    if (existing.publicId) {
      await destroyCloudinaryImage(existing.publicId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete event:", error);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      about,
      date,
      startTime,
      endTime,
      location,
      mapUrl,
      type,
      topic,
      imageUrl,
      publicId,
      roadmap,
      speakers,
      featured,
      status,
      registrationOpen,
    } = body;

    if (!title || !description || !date || !location || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        about,
        date: new Date(date),
        startTime,
        endTime,
        location,
        mapUrl,
        type,
        topic,
        imageUrl: imageUrl || null,
        publicId: publicId || null,
        roadmap: roadmap || [],
        speakers,
        featured,
        status: status || "published",
        registrationOpen: registrationOpen !== false,
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error("Failed to create event:", error);
    return NextResponse.json(
      { error: "Failed to create event. Run `npx prisma db push` if the schema was recently updated." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const existing = await prisma.event.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const data = buildEventUpdateData(body);

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const event = await prisma.event.update({
      where: { id },
      data,
    });

    const nextPublicId =
      typeof body.publicId === "string" ? body.publicId : existing.publicId;

    if (existing.publicId && nextPublicId && existing.publicId !== nextPublicId) {
      await destroyCloudinaryImage(existing.publicId);
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("Failed to update event:", error);
    return NextResponse.json(
      {
        error:
          "Failed to update event. If this persists, run `npx prisma db push` to sync the database schema.",
      },
      { status: 500 },
    );
  }
}
