import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { validateServerRole } from "@/lib/server-role-validation";
import prisma from "@/utils/prisma/prismaClient";

const lineItemSchema = z.object({
  description: z.string().trim().min(1).max(200),
  quantity: z.number().positive(),
  unitAmount: z.number().nonnegative(),
});

const payloadSchema = z.object({
  description: z.string().trim().min(1).max(300),
  amount: z.number().positive(),
  currency: z.string().trim().length(3).toUpperCase().default("INR"),
  dueAt: z.string().datetime().optional(),
  lineItems: z.array(lineItemSchema).optional(),
});

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await validateServerRole(["ADMIN", "FITNESS_TRAINER_ADMIN"]);
  const { id } = await params;

  const invoices = await prisma.corporate_invoices.findMany({
    where: { corporate_group_id: id },
    orderBy: { issued_at: "desc" },
  });

  return NextResponse.json({
    invoices: invoices.map((i) => ({
      id: i.id,
      description: i.description,
      amount: i.amount.toString(),
      currency: i.currency,
      status: i.status,
      lineItems: i.line_items,
      issuedAt: i.issued_at.toISOString(),
      dueAt: i.due_at?.toISOString() ?? null,
    })),
  });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user } = await validateServerRole(["ADMIN", "FITNESS_TRAINER_ADMIN"]);
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = payloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid submission" }, { status: 400 });
  }
  const data = parsed.data;

  const group = await prisma.corporate_groups.findUnique({ where: { id } });
  if (!group) return NextResponse.json({ error: "Corporate group not found" }, { status: 404 });

  const invoice = await prisma.corporate_invoices.create({
    data: {
      corporate_group_id: id,
      description: data.description,
      amount: data.amount,
      currency: data.currency,
      due_at: data.dueAt ? new Date(data.dueAt) : null,
      line_items: data.lineItems ?? undefined,
      created_by_id: user.id,
    },
  });

  return NextResponse.json({ id: invoice.id });
}
