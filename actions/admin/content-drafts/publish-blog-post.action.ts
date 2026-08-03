"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getAdminUser } from "@/utils/user";
import { createSafeAction, ActionState } from "@/lib/create-safe-action";
import { publishBlogPostFile, BlogPublishingNotConfiguredError } from "@/utils/github/blogPublisher";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const PublishBlogPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().regex(SLUG_PATTERN, "Slug must be lowercase letters, numbers, and hyphens only").max(120),
  excerpt: z.string().min(1, "Excerpt is required").max(400),
  content: z.string().min(1, "Content is required"),
  relatedProgram: z.string().max(200).optional(),
});

type PublishBlogPostInput = z.infer<typeof PublishBlogPostSchema>;

function escapeYaml(value: string): string {
  return value.replace(/"/g, '\\"');
}

async function publishBlogPostHandler(
  data: PublishBlogPostInput
): Promise<ActionState<PublishBlogPostInput, { url: string; commitUrl: string }>> {
  const adminUser = await getAdminUser();
  if (!adminUser) return { error: "Admin access required" };

  const publishedAt = new Date().toISOString().slice(0, 10);
  const frontmatterLines = [
    "---",
    `title: "${escapeYaml(data.title)}"`,
    `slug: "${data.slug}"`,
    `excerpt: "${escapeYaml(data.excerpt)}"`,
    `publishedAt: "${publishedAt}"`,
    "published: true",
  ];
  if (data.relatedProgram?.trim()) {
    frontmatterLines.push(`relatedProgram: "${escapeYaml(data.relatedProgram.trim())}"`);
  }
  frontmatterLines.push("---", "", data.content.trim(), "");

  const mdxContent = frontmatterLines.join("\n");

  try {
    const result = await publishBlogPostFile({
      slug: data.slug,
      mdxContent,
      commitMessage: `Publish blog post: ${data.title}`,
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${data.slug}`);

    return { data: { url: `/blog/${data.slug}`, commitUrl: result.commitUrl } };
  } catch (error) {
    if (error instanceof BlogPublishingNotConfiguredError) {
      return { error: "Blog publishing isn't set up yet — BLOG_PUBLISH_GITHUB_TOKEN is missing." };
    }
    console.error("Error publishing blog post:", error);
    return { error: error instanceof Error ? error.message : "Failed to publish. Please try again." };
  }
}

export const publishBlogPost = createSafeAction(PublishBlogPostSchema, publishBlogPostHandler);
