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
      interest 
    } = body;

    if (!eventId || !fullName || !email || !phone || !dob) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Calculate age
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
