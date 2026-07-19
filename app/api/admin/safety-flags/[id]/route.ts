import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { validateServerRole } from "@/lib/server-role-validation";
import prisma from "@/utils/prisma/prismaClient";

const payloadSchema = z.object({
  status: z.enum(["OPEN", "IN_REVIEW", "RESOLVED"]),
  adminNotes: z.string().max(4000).optional(),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user } = await validateServerRole(["ADMIN", "FITNESS_TRAINER_ADMIN", "FITNESS_TRAINER"]);

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

  const flag = await prisma.safety_flags.update({
    where: { id },
    data: {
      status: parsed.data.status,
      admin_notes: parsed.data.adminNotes,
      assigned_to_id: user.id,
      resolved_at: parsed.data.status === "RESOLVED" ? new Date() : null,
    },
  });

  return NextResponse.json({ id: flag.id, status: flag.status });
}
