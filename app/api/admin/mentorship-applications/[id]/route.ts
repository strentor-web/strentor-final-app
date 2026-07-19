import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { validateServerRole } from "@/lib/server-role-validation";
import prisma from "@/utils/prisma/prismaClient";

const payloadSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "DECLINED"]),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user } = await validateServerRole(["ADMIN", "FITNESS_TRAINER_ADMIN"]);

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

  const application = await prisma.mentorship_applications.update({
    where: { id },
    data: { status: parsed.data.status, reviewed_by_id: user.id },
  });

  return NextResponse.json({ id: application.id, status: application.status });
}
