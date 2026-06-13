import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const team = await prisma.teamMember.findMany({
      where: { status: "published" },
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(team);
  } catch (error) {
    console.error("Failed to fetch team members:", error);
    return NextResponse.json({ error: "Failed to fetch team members" }, { status: 500 });
  }
}
