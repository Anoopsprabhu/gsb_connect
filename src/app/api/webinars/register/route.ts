import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendWebinarConfirmation } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { webinarId, fullName, email, phone, organization, interest } = body;

    if (!webinarId || !fullName || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, phone, and webinar ID are required" },
        { status: 400 }
      );
    }

    // Fetch the webinar
    const webinar = await prisma.webinar.findUnique({
      where: { id: webinarId },
    });

    if (!webinar) {
      return NextResponse.json(
        { error: "Webinar not found" },
        { status: 404 }
      );
    }

    if (!webinar.registrationOpen) {
      return NextResponse.json(
        { error: "Registration is closed for this webinar." },
        { status: 403 }
      );
    }

    // Check for duplicate registration
    const existing = await prisma.webinarRegistration.findFirst({
      where: { webinarId, email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "You are already registered for this webinar." },
        { status: 409 }
      );
    }

    // Create the registration
    const registration = await prisma.webinarRegistration.create({
      data: {
        webinarId,
        fullName,
        email,
        phone,
        organization: organization || null,
        interest: interest || null,
      },
    });

    // Send confirmation email with webinar link
    try {
      await sendWebinarConfirmation(email, fullName, {
        title: webinar.title,
        date: webinar.date,
        startTime: webinar.startTime,
        endTime: webinar.endTime,
        speakers: webinar.speakers,
        platform: webinar.platform,
        webinarLink: webinar.webinarLink,
      });
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Registration still succeeds even if email fails
    }

    return NextResponse.json(registration, { status: 201 });
  } catch (error) {
    console.error("Webinar registration failed:", error);
    return NextResponse.json(
      { error: "Failed to register for webinar" },
      { status: 500 }
    );
  }
}
