import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all");

    const webinars = await prisma.webinar.findMany({
      where: all === "true" ? {} : { status: "published" },
      orderBy: { date: "desc" },
      include: {
        _count: { select: { registrations: true } },
      },
    });

    return NextResponse.json(webinars);
  } catch (error) {
    console.error("Failed to fetch webinars:", error);
    return NextResponse.json(
      { error: "Failed to fetch webinars" },
      { status: 500 }
    );
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
      speakers,
      imageUrl,
      publicId,
      webinarLink,
      platform,
      posterUrl,
      posterPublicId,
      userId,
    } = body;

    if (!title || !description || !date) {
      return NextResponse.json(
        { error: "Title, description, and date are required" },
        { status: 400 }
      );
    }

    const webinar = await prisma.webinar.create({
      data: {
        title,
        description,
        about: about || null,
        date: new Date(date),
        startTime: startTime || null,
        endTime: endTime || null,
        speakers: speakers || null,
        imageUrl: posterUrl || null,
        publicId: posterPublicId || null,
        webinarLink: webinarLink || null,
        platform: platform || "Zoom",
        // posterUrl: posterUrl || null,
        // posterPublicId: posterPublicId || null,
        // userId: userId || null,
      },
    });

    return NextResponse.json(webinar, { status: 201 });
  } catch (error) {
    console.error("Failed to create webinar:", error);
    return NextResponse.json(
      { error: "Failed to create webinar" },
      { status: 500 }
    );
  }
}

