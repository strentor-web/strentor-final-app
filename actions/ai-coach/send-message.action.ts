"use server";

import { z } from "zod";
import prisma from "@/utils/prisma/prismaClient";
import { getAuthenticatedUserId } from "@/utils/user";
import { createSafeAction, ActionState } from "@/lib/create-safe-action";
import { completeText, AiNotConfiguredError } from "@/utils/ai/anthropicClient";
import { buildAiTrainerSystemPrompt } from "@/utils/ai-trainer/systemPrompt";
import { interceptRedFlags, RED_FLAG_SAFETY_RESPONSE } from "@/utils/ai-trainer/redFlagInterceptor";
import { RED_FLAG_OPTIONS } from "@/utils/assessment/scoring";
import { sendIntakeNotification } from "@/utils/email/resend";

const SAFETY_ADMIN_EMAIL = "fitassessment@strentor.com";
const HISTORY_TURNS = 10; // last 10 user+assistant pairs of context

const SendMessageSchema = z.object({
  message: z.string().min(1, "Message is required").max(2000, "Message is too long"),
});

type SendMessageInput = z.infer<typeof SendMessageSchema>;

async function sendMessageHandler(
  data: SendMessageInput
): Promise<ActionState<SendMessageInput, { reply: string; redFlagIntercepted: boolean }>> {
  const userId = await getAuthenticatedUserId();
  if (!userId) return { error: "Unauthorized" };

  // Defense in depth — /coach's own page gates on this too, but the action
  // can be invoked directly.
  const activeSubscription = await prisma.user_subscriptions.findFirst({
    where: {
      user_id: userId,
      status: { in: ["ACTIVE", "AUTHENTICATED"] },
      subscription_plans: { category: "AI_COACHING" },
    },
    select: { id: true },
  });
  if (!activeSubscription) {
    return { error: "An active AI Coaching subscription is required." };
  }

  await prisma.ai_coach_messages.create({
    data: { user_id: userId, role: "user", content: data.message },
  });

  const intercept = interceptRedFlags(data.message);

  if (intercept.intercepted) {
    await prisma.ai_coach_messages.create({
      data: {
        user_id: userId,
        role: "assistant",
        content: RED_FLAG_SAFETY_RESPONSE,
        red_flag_intercepted: true,
      },
    });

    const flagLabels = intercept.matchedCategories.map(
      (category) => RED_FLAG_OPTIONS.find((option) => option.value === category)?.label || category
    );

    try {
      await prisma.safety_flags.create({
        data: {
          user_id: userId,
          source_type: "ai_coach_chat",
          source_id: userId,
          symptom_type: flagLabels.join(", "),
          severity: "HIGH",
          message: `AI Trainer chat message intercepted before reaching the model: "${data.message.slice(0, 300)}"`,
          human_review_required: true,
        },
      });

      const profile = await prisma.users_profile.findUnique({
        where: { id: userId },
        select: { name: true, email: true },
      });

      await sendIntakeNotification({
        to: SAFETY_ADMIN_EMAIL,
        subject: `[Safety Flag] AI Trainer chat — ${profile?.name || userId}`,
        html: `<div style="font-family: Arial, sans-serif; max-width: 640px; color:#111;">
          <p><strong>${profile?.name || "A client"}</strong> (${profile?.email || userId}) sent a message to the AI Trainer that was intercepted before reaching the model.</p>
          <p><strong>Flagged categories:</strong> ${flagLabels.join(", ")}</p>
          <p><strong>Message:</strong> ${data.message}</p>
          <p>Review in the admin Safety Flags queue.</p>
        </div>`,
      });
    } catch (error) {
      // Never blocks the safety response from reaching the client — same
      // pattern as onboarding's safety check.
      console.error("Failed to record/notify AI chat safety flag:", error);
    }

    return { data: { reply: RED_FLAG_SAFETY_RESPONSE, redFlagIntercepted: true } };
  }

  try {
    const recentMessages = await prisma.ai_coach_messages.findMany({
      where: { user_id: userId, red_flag_intercepted: false },
      orderBy: { created_at: "desc" },
      take: HISTORY_TURNS * 2,
      select: { role: true, content: true },
    });
    recentMessages.reverse();

    const reply = await completeText({
      system: buildAiTrainerSystemPrompt(),
      messages: recentMessages.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
    });

    await prisma.ai_coach_messages.create({
      data: { user_id: userId, role: "assistant", content: reply },
    });

    return { data: { reply, redFlagIntercepted: false } };
  } catch (error) {
    if (error instanceof AiNotConfiguredError) {
      return { error: "The AI Trainer isn't set up yet — please check back soon." };
    }
    console.error("Error generating AI trainer reply:", error);
    return { error: "Failed to get a response. Please try again." };
  }
}

export const sendAiCoachMessage = createSafeAction(SendMessageSchema, sendMessageHandler);
