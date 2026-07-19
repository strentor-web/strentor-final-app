import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/utils/prisma/prismaClient";
import { sendIntakeNotification } from "@/utils/email/resend";
import {
  RED_FLAG_OPTIONS,
  SCORED_QUESTIONS,
  scoreAssessment,
} from "@/utils/assessment/scoring";

const SAFETY_ADMIN_EMAIL = "fitassessment@strentor.com";

const validScoredKeys = new Set(SCORED_QUESTIONS.map((q) => q.key));
const validRedFlagValues = new Set(RED_FLAG_OPTIONS.map((o) => o.value));

const payloadSchema = z.object({
  scored: z.record(z.string(), z.string()).refine(
    (scored) => Object.keys(scored).every((key) => validScoredKeys.has(key)),
    { message: "Unknown scored question key" }
  ),
  redFlags: z.array(z.string()).refine(
    (flags) => flags.every((f) => validRedFlagValues.has(f)),
    { message: "Unknown red flag value" }
  ),
  corporateInterest: z.boolean(),
  eliteInterest: z.boolean(),
});

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

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

  const { scored, redFlags, corporateInterest, eliteInterest } = parsed.data;

  if (Object.keys(scored).length !== SCORED_QUESTIONS.length) {
    return NextResponse.json({ error: "All questions must be answered" }, { status: 400 });
  }

  const result = scoreAssessment({ scored, redFlags, corporateInterest, eliteInterest });

  const userData = await prisma.users_profile.findUnique({
    where: { id: user.id },
    select: { name: true, email: true },
  });

  if (!userData) {
    return NextResponse.json({ error: "User profile not found" }, { status: 404 });
  }

  const assessmentAnswers = [
    ...SCORED_QUESTIONS.map((question) => {
      const option = question.options.find((o) => o.value === scored[question.key]);
      return {
        question_key: question.key,
        answer_value: scored[question.key],
        score_value: option?.points ?? 0,
        is_red_flag: false,
      };
    }),
    ...redFlags.map((flag) => ({
      question_key: "red_flag",
      answer_value: flag,
      score_value: 0,
      is_red_flag: flag !== "none",
    })),
  ];

  const pathwayRecommendationsToCreate: {
    user_id: string;
    pathway: typeof result.pathway;
    reason: string;
    cta_type: string;
    automatic_progression_allowed: boolean;
  }[] = [
    {
      user_id: user.id,
      pathway: result.pathway,
      reason: result.reason,
      cta_type: result.ctaType,
      automatic_progression_allowed: result.automaticProgressionAllowed,
    },
  ];

  if (result.showCorporateCta) {
    pathwayRecommendationsToCreate.push({
      user_id: user.id,
      pathway: "CORPORATE_INCLUSIVE_WELLNESS",
      reason: "Selected corporate/organizational wellness interest during assessment.",
      cta_type: "corporate_wellness",
      automatic_progression_allowed: true,
    });
  }

  if (result.showEliteCta) {
    pathwayRecommendationsToCreate.push({
      user_id: user.id,
      pathway: "LIVE_LIMITLESS",
      reason: "Selected Elite Mentorship interest during assessment with no safety concerns flagged.",
      cta_type: "elite_mentorship",
      automatic_progression_allowed: true,
    });
  }

  const assessment = await prisma.assessments.create({
    data: {
      user_id: user.id,
      total_score: result.totalScore,
      red_flag_exists: result.redFlagExists,
      pathway_result: result.pathway,
      human_review_required: !result.automaticProgressionAllowed,
      corporate_interest: corporateInterest,
      elite_interest: eliteInterest,
      assessment_answers: { create: assessmentAnswers },
      pathway_recommendations: { create: pathwayRecommendationsToCreate },
    },
  });

  if (result.redFlagExists) {
    const symptomLabels = redFlags
      .filter((f) => f !== "none")
      .map((f) => RED_FLAG_OPTIONS.find((o) => o.value === f)?.label || f);

    await prisma.safety_flags.create({
      data: {
        user_id: user.id,
        source_type: "assessment",
        source_id: assessment.id,
        symptom_type: symptomLabels.join(", "),
        severity: "HIGH",
        message:
          "Pause this activity. Response suggests professional guidance or coach review may be needed before continuing.",
        status: "OPEN",
        human_review_required: true,
      },
    });

    try {
      await sendIntakeNotification({
        to: SAFETY_ADMIN_EMAIL,
        subject: `[Safety Flag] Readiness assessment red flag — ${userData.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 640px; color: #111;">
            <h2 style="color:#B42318;">Red flag on readiness assessment</h2>
            <p><strong>${escapeHtml(userData.name)}</strong> (${escapeHtml(userData.email)}) reported: ${escapeHtml(symptomLabels.join(", "))}</p>
            <p>human_review_required = true. Automatic progression blocked. Please review in the admin safety queue.</p>
          </div>
        `,
      });
    } catch (error) {
      console.error("Failed to send safety flag notification email:", error);
    }
  }

  return NextResponse.json({
    id: assessment.id,
    totalScore: result.totalScore,
    redFlagExists: result.redFlagExists,
    pathway: result.pathway,
    reason: result.reason,
    ctaType: result.ctaType,
    automaticProgressionAllowed: result.automaticProgressionAllowed,
    showCorporateCta: result.showCorporateCta,
    showEliteCta: result.showEliteCta,
  });
}
