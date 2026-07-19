import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { validateServerRole } from "@/lib/server-role-validation";
import prisma from "@/utils/prisma/prismaClient";

const payloadSchema = z.object({
  companyName: z.string().trim().min(1).max(200),
  contactPerson: z.string().trim().min(1).max(200),
  contactEmail: z.string().trim().email().max(200),
  planType: z.string().trim().max(100).optional(),
  memberLimit: z.number().int().positive().optional(),
});

export async function POST(request: NextRequest) {
  await validateServerRole(["ADMIN", "FITNESS_TRAINER_ADMIN"]);

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

  const group = await prisma.corporate_groups.create({
    data: {
      company_name: parsed.data.companyName,
      contact_person: parsed.data.contactPerson,
      contact_email: parsed.data.contactEmail,
      plan_type: parsed.data.planType,
      member_limit: parsed.data.memberLimit,
    },
  });

  return NextResponse.json({ id: group.id });
}
