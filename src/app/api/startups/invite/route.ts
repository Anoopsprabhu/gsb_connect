import { NextResponse } from "next/server";
import { sendCofounderInvite } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { cofounderEmail, startupName, startupId } = await request.json();

    if (!cofounderEmail || !startupName) {
      return NextResponse.json(
        { error: "Co-founder email and startup name are required" },
        { status: 400 }
      );
    }

    // If no startupId yet (form not submitted), use a placeholder link
    const id = startupId || "preview";

    await sendCofounderInvite(cofounderEmail, startupName, id);

    return NextResponse.json({ success: true, message: "Invite sent successfully" });
  } catch (error) {
    console.error("Failed to send co-founder invite:", error);
    return NextResponse.json(
      { error: "Failed to send invite. Check email configuration." },
      { status: 500 }
    );
  }
}
