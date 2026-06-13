import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

import { sendCofounderInvite } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      startupName, founderName, email, phone, 
      problem, solution, demoLink, category, 
      progress, funding, revenueStage, burnRate, 
      roundSize, roundStructure, valuation,
      userId, cofounderEmail
    } = body;

    if (!startupName || !founderName || !email || !phone || !problem || !solution || !category || !progress || !revenueStage || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const startup = await prisma.startup.create({
      data: {
        startupName,
        founderName,
        email,
        phone,
        problem,
        solution,
        demoLink,
        category,
        progress,
        funding,
        revenueStage,
        burnRate,
        roundSize,
        roundStructure,
        valuation,
        userId,
        cofounderEmail,
      },
    });

    // Send invite to cofounder if email provided
    if (cofounderEmail) {
      try {
        await sendCofounderInvite(cofounderEmail, startupName, startup.id);
      } catch (emailError) {
        console.error("Failed to send cofounder invite:", emailError);
        // Don't fail the whole request if email fails
      }
    }

    return NextResponse.json(startup);
  } catch (error) {
    console.error("Startup registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const startups = await prisma.startup.findMany({
      select: {
        id: true,
        startupName: true,
        founderName: true,
        email: true,
        phone: true,
        category: true,
        progress: true,
        revenueStage: true,
        status: true,
        createdAt: true,
        // Include text fields as they are used in the details modal
        problem: true,
        solution: true,
        demoLink: true,
        funding: true,
        burnRate: true,
        roundSize: true,
        roundStructure: true,
        valuation: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(startups);
  } catch (error) {
    console.error("Failed to fetch startups:", error);
    return NextResponse.json({ error: "Failed to fetch startups" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Missing ID or status" }, { status: 400 });
    }

    const startup = await prisma.startup.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(startup);
  } catch (error) {
    console.error("Startup update error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
