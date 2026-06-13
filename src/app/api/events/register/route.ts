import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      eventId,
      fullName,
      email,
      phone,
      dob,
      address,
      country,
      state,
      city,
      pincode,
      profession,
      category,
      interest,
    } = body;

    if (!eventId || !fullName || !email || !phone || !dob) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true, registrationOpen: true, title: true },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (!event.registrationOpen) {
      return NextResponse.json(
        { error: "Registration is closed for this event." },
        { status: 403 },
      );
    }

    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    const registration = await prisma.registration.create({
      data: {
        eventId,
        fullName,
        email,
        phone,
        dob: birthDate,
        age,
        address,
        country,
        state,
        city,
        pincode,
        profession,
        category,
        interest,
      },
    });

    return NextResponse.json(registration);
  } catch (error) {
    console.error("Registration failed:", error);
    return NextResponse.json({ error: "Failed to submit registration" }, { status: 500 });
  }
}
