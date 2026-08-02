"use server";

import { z } from "zod";
import prisma from "@/utils/prisma/prismaClient";
import { getAdminUser } from "@/utils/user";
import { createSafeAction, ActionState } from "@/lib/create-safe-action";
import { completeText } from "@/utils/ai/anthropicClient";

const FOLLOW_UP_SYSTEM_PROMPT = `You draft short, warm follow-up emails for STRENTOR, an adaptive strength/coaching brand for wheelchair users and others rebuilding strength and confidence. You are given one intake-form submission as JSON.

Write a follow-up email to the applicant that:
- Opens with their first name.
- References something specific from their submission (their stated goal, pathway, or context) — never generic filler.
- Is warm, direct, and not salesy. Short paragraphs.
- Ends with one clear next step (e.g. "reply with a time that works" or "here's the link to book your call").
- Is 120-180 words.

Output only the email body — no subject line, no signature block, no explanation of what you did.`;

const DraftFollowUpSchema = z.object({
  submissionId: z.string().uuid(),
});

type DraftFollowUpInput = z.infer<typeof DraftFollowUpSchema>;

async function draftFollowUpHandler(
  data: DraftFollowUpInput
): Promise<ActionState<DraftFollowUpInput, { draft: string }>> {
  const adminUser = await getAdminUser();
  if (!adminUser) return { error: "Admin access required" };

  const submission = await prisma.intake_submissions.findUnique({
    where: { id: data.submissionId },
  });
  if (!submission) return { error: "Submission not found" };

  try {
    const draft = await completeText({
      system: FOLLOW_UP_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: JSON.stringify({
            fullName: submission.full_name,
            pathway: submission.pathway,
            city: submission.city,
            country: submission.country,
            payload: submission.payload,
          }),
        },
      ],
      maxTokens: 500,
    });
    return { data: { draft } };
  } catch (error) {
    console.error("Error drafting lead follow-up:", error);
    return { error: "Failed to draft a follow-up. Please try again." };
  }
}

export const draftLeadFollowUp = createSafeAction(DraftFollowUpSchema, draftFollowUpHandler);
