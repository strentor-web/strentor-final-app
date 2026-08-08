"use server";

import { z } from "zod";
import prisma from "@/utils/prisma/prismaClient";
import { validateServerRole } from "@/lib/server-role-validation";
import { createSafeAction, ActionState } from "@/lib/create-safe-action";
import { revalidatePath } from "next/cache";

const CreatePostSchema = z.object({
  body: z.string().min(1, "Post can't be empty").max(2000, "Post is too long"),
});

type CreatePostInput = z.infer<typeof CreatePostSchema>;

interface CreatePostResult {
  id: string;
}

async function createPostHandler(
  data: CreatePostInput
): Promise<ActionState<CreatePostInput, CreatePostResult>> {
  const { user } = await validateServerRole(["CLIENT", "CORPORATE_EMPLOYEE"]);

  const post = await prisma.community_posts.create({
    data: {
      author_id: user.id,
      body: data.body,
    },
  });

  revalidatePath("/community/feed");

  return { data: { id: post.id } };
}

export const createPost = createSafeAction(CreatePostSchema, createPostHandler);
