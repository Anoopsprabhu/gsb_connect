import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const registrations = await prisma.webinarRegistration.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        webinar: {
          select: { id: true, title: true },
        },
      },
    });

    return NextResponse.json(registrations);
  } catch (error) {
    console.error("Failed to fetch webinar registrations:", error);
    return NextResponse.json(
      { error: "Failed to fetch registrations" },
      { status: 500 }
    );
  }
}
