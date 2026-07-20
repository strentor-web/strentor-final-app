import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/utils/supabase/service";

// Supabase's free tier auto-pauses a project after a period of inactivity
// measured through its own API layer (Auth/REST/Storage) — not through
// direct Postgres connections like Prisma uses elsewhere in this app.
// This route makes a trivial request through the actual Supabase JS
// client so the project registers as active and doesn't get paused.
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createServiceClient();
    const { error } = await supabase.from("users_profile").select("id").limit(1);

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Supabase keep-alive ping failed:", error);
    return NextResponse.json(
      {
        error: "Keep-alive ping failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
