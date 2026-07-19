import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/utils/prisma/prismaClient";

const payloadSchema = z.object({
  nameDisplay: z.string().trim().min(1).max(200),
  programType: z.string().trim().max(200).optional(),
  testimonialText: z.string().trim().min(10).max(2000),
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

  const testimonial = await prisma.testimonials.create({
    data: {
      user_id: user.id,
      name_display: parsed.data.nameDisplay,
      program_type: parsed.data.programType,
      testimonial_text: parsed.data.testimonialText,
      approval_status: "PENDING",
    },
  });

  return NextResponse.json({ id: testimonial.id });
}
