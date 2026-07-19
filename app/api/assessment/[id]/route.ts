import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/utils/prisma/prismaClient";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (!user?.id || userError) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const assessment = await prisma.assessments.findUnique({
    where: { id },
    include: { pathway_recommendations: true },
  });

  if (!assessment || assessment.user_id !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const primary = assessment.pathway_recommendations.find(
    (rec) => rec.pathway === assessment.pathway_result
  );
  const secondary = assessment.pathway_recommendations.filter(
    (rec) => rec.pathway !== assessment.pathway_result
  );

  return NextResponse.json({
    id: assessment.id,
    totalScore: assessment.total_score,
    redFlagExists: assessment.red_flag_exists,
    pathway: assessment.pathway_result,
    reason: primary?.reason ?? "",
    ctaType: primary?.cta_type ?? "",
    automaticProgressionAllowed: primary?.automatic_progression_allowed ?? true,
    showCorporateCta: secondary.some((r) => r.pathway === "CORPORATE_INCLUSIVE_WELLNESS"),
    showEliteCta: secondary.some((r) => r.pathway === "LIVE_LIMITLESS"),
  });
}
