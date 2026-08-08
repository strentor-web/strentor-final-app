"use server";

import { z } from "zod";
import prisma from "@/utils/prisma/prismaClient";
import { validateServerRole } from "@/lib/server-role-validation";
import { createSafeAction, ActionState } from "@/lib/create-safe-action";
import { revalidatePath } from "next/cache";

const CreateCommentSchema = z.object({
  postId: z.string().uuid(),
  body: z.string().min(1, "Comment can't be empty").max(2000, "Comment is too long"),
});

type CreateCommentInput = z.infer<typeof CreateCommentSchema>;

interface CreateCommentResult {
  id: string;
}

async function createCommentHandler(
  data: CreateCommentInput
): Promise<ActionState<CreateCommentInput, CreateCommentResult>> {
  const { user } = await validateServerRole(["CLIENT", "CORPORATE_EMPLOYEE"]);

  const post = await prisma.community_posts.findUnique({ where: { id: data.postId } });
  if (!post || post.status !== "PUBLISHED") {
    return { error: "Post not found" };
  }

  const comment = await prisma.community_comments.create({
    data: {
      post_id: data.postId,
      author_id: user.id,
      body: data.body,
    },
  });

  revalidatePath("/community/feed");

  return { data: { id: comment.id } };
}

export const createComment = createSafeAction(CreateCommentSchema, createCommentHandler);
