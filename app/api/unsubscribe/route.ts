import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma/prismaClient";

// One-click-from-email unsubscribe — a state-mutating GET is a deliberate,
// industry-standard choice for this UX (matches how virtually every ESP
// does it). The operation is an upsert, so repeat clicks are harmless.
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (token) {
    const submission = await prisma.intake_submissions.findUnique({
      where: { unsubscribe_token: token },
      select: { email: true },
    });

    if (submission) {
      await prisma.email_suppressions.upsert({
        where: { email: submission.email },
        create: { email: submission.email, reason: "unsubscribed", source: "lead_follow_up" },
        update: {},
      });
    }
  }

  return NextResponse.redirect(new URL("/unsubscribed", request.url));
}
