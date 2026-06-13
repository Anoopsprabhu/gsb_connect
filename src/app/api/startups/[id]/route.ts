import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId } = await auth();
    const user = await currentUser();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const startup = await prisma.startup.findUnique({
      where: { id },
    });

    if (!startup) {
      return NextResponse.json({ error: "Startup not found" }, { status: 404 });
    }

    // Check if user is owner or cofounder
    const isOwner = startup.userId === userId;
    const isCofounder = startup.cofounderEmail && user?.primaryEmailAddress?.emailAddress === startup.cofounderEmail;

    if (!isOwner && !isCofounder) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(startup);
  } catch (error) {
    console.error("Fetch startup error:", error);
    return NextResponse.json({ error: "Failed to fetch startup" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId } = await auth();
    const user = await currentUser();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const startup = await prisma.startup.findUnique({
      where: { id },
    });

    if (!startup) {
      return NextResponse.json({ error: "Startup not found" }, { status: 404 });
    }

    // Check if user is owner or cofounder
    const isOwner = startup.userId === userId;
    const isCofounder = startup.cofounderEmail && user?.primaryEmailAddress?.emailAddress === startup.cofounderEmail;

    if (!isOwner && !isCofounder) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedStartup = await prisma.startup.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(updatedStartup);
  } catch (error) {
    console.error("Update startup error:", error);
    return NextResponse.json({ error: "Failed to update startup" }, { status: 500 });
  }
}
