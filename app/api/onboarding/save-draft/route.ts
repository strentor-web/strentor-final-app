import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/utils/prisma/prismaClient";

// Server-side mirror of the onboarding wizard's localStorage autosave, so
// ops has visibility into accounts that started onboarding but never
// finished — localStorage alone is invisible to anyone but the user.
// Best-effort by design: never blocks the onboarding form on failure.
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { formData, step } = body;

    if (typeof formData !== "object" || formData === null) {
      return NextResponse.json({ error: "Invalid draft payload" }, { status: 400 });
    }

    await prisma.onboarding_drafts.upsert({
      where: { user_id: user.id },
      update: {
        form_data: formData,
        last_step: typeof step === "number" ? step : undefined,
      },
      create: {
        user_id: user.id,
        form_data: formData,
        last_step: typeof step === "number" ? step : 1,
      },
    });

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Failed to save onboarding draft:", error);
    return NextResponse.json({ error: "Failed to save draft" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.onboarding_drafts.deleteMany({ where: { user_id: user.id } });
    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Failed to clear onboarding draft:", error);
    return NextResponse.json({ error: "Failed to clear draft" }, { status: 500 });
  }
}
