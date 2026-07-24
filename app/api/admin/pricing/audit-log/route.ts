import { NextRequest, NextResponse } from "next/server";
import { checkAdminAccess } from "@/utils/user";
import prisma from "@/utils/prisma/prismaClient";

export async function GET(request: NextRequest) {
  await checkAdminAccess();

  const overrideId = request.nextUrl.searchParams.get("overrideId") ?? undefined;

  const entries = await prisma.pricing_audit_log.findMany({
    where: overrideId ? { override_id: overrideId } : undefined,
    orderBy: { changed_at: "desc" },
    take: 100,
  });

  return NextResponse.json({ entries });
}
