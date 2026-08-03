"use server";

import { z } from "zod";
import { getAdminUser } from "@/utils/user";
import { createSafeAction, ActionState } from "@/lib/create-safe-action";
import { completeText } from "@/utils/ai/anthropicClient";

const CONTENT_TYPE_PROMPTS: Record<string, string> = {
  blog_post: `You write blog posts for STRENTOR, a premium adaptive-strength coaching brand for wheelchair users and others rebuilding strength, confidence, and purpose. Voice: direct, empowering, wheelchair-first, never patronizing or inspirational-clichéd.

Write the post BODY only, in Markdown, with short paragraphs and ## subheadings — do not include an H1 title, that's handled separately. Target 500-800 words.

Hard constraints, same as every other post on this site: never invent client stories, statistics, studies, or testimonials that aren't in the brief; never make medical claims or give treatment advice; never promise or imply guaranteed outcomes. STRENTOR is coaching, not medical care, and every post should read that way.`,
  social_caption: `You write social captions for STRENTOR, a premium adaptive-strength coaching brand for wheelchair users and others rebuilding strength, confidence, and purpose. Voice: direct, empowering, wheelchair-first. Write 3 distinct caption options (numbered), each under 280 characters, each ending with a clear call to action. Never invent client stories, statistics, or medical claims that aren't in the brief.`,
};

const DraftContentSchema = z.object({
  contentType: z.enum(["blog_post", "social_caption"]),
  topic: z.string().min(1, "Topic is required").max(300),
  outline: z.string().max(2000).optional(),
});

type DraftContentInput = z.infer<typeof DraftContentSchema>;

async function draftContentHandler(
  data: DraftContentInput
): Promise<ActionState<DraftContentInput, { draft: string }>> {
  const adminUser = await getAdminUser();
  if (!adminUser) return { error: "Admin access required" };

  const briefParts = [`Topic: ${data.topic}`];
  if (data.outline?.trim()) briefParts.push(`Outline / key points to cover:\n${data.outline.trim()}`);

  try {
    const draft = await completeText({
      system: CONTENT_TYPE_PROMPTS[data.contentType],
      messages: [{ role: "user", content: briefParts.join("\n\n") }],
      maxTokens: 1500,
    });
    return { data: { draft } };
  } catch (error) {
    console.error("Error drafting content:", error);
    return { error: "Failed to generate a draft. Please try again." };
  }
}

export const draftContent = createSafeAction(DraftContentSchema, draftContentHandler);
