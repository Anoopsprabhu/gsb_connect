import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const isAuthenticated = cookieStore.has("admin_auth");

    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // In this simple auth system, we don't store the user ID in the cookie.
    // For now, let's return a default "Super Admin" or fetch the first admin.
    // Ideally, we should use a session token to find the specific admin.
    
    // As a temporary measure to fulfill the requirement of showing the username,
    // let's fetch the first admin or a generic one if no session data is in the cookie.
    const admin = await prisma.admin.findFirst();

    if (!admin) {
      return NextResponse.json({ name: "Super Admin", role: "superadmin" });
    }

    return NextResponse.json({
      name: admin.name,
      role: admin.role,
      email: admin.email,
    });
  } catch (error) {
    console.error("Failed to fetch admin info:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
