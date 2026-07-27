import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/utils/prisma/prismaClient";

// Cashback amounts are fixed here, server-side — never trust a
// client-supplied amount. See prisma/schema.prisma testimonials.cashback_amount.
const CASHBACK_BY_TYPE: Record<"TEXT" | "VIDEO", number> = { TEXT: 500, VIDEO: 1000 };

const payloadSchema = z.object({
  nameDisplay: z.string().trim().min(1).max(200),
  programType: z.string().trim().max(200).optional(),
  testimonialText: z.string().trim().min(10).max(2000),
  reviewType: z.enum(["TEXT", "VIDEO"]).default("TEXT"),
  videoUrl: z.string().trim().url().max(500).optional(),
  upiId: z.string().trim().min(3).max(100),
});

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (!user?.id || userError) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = payloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }

  const { nameDisplay, programType, testimonialText, reviewType, videoUrl, upiId } = parsed.data;

  if (reviewType === "VIDEO" && !videoUrl) {
    return NextResponse.json({ error: "Video link is required for a video review" }, { status: 400 });
  }

  // Captured once, reused for both testimonial and referral cashback payouts.
  await prisma.users_profile.update({
    where: { id: user.id },
    data: { payout_upi_id: upiId },
  });

  const testimonial = await prisma.testimonials.create({
    data: {
      user_id: user.id,
      name_display: nameDisplay,
      program_type: programType,
      testimonial_text: testimonialText,
      review_type: reviewType,
      media_url: reviewType === "VIDEO" ? videoUrl : undefined,
      // Set now so the amount is locked to what was true at submission time;
      // it only becomes payable once approval_status flips to APPROVED.
      cashback_amount: CASHBACK_BY_TYPE[reviewType],
      approval_status: "PENDING",
    },
  });

  return NextResponse.json({ id: testimonial.id });
}
