"use server";

import { z } from "zod";
import prisma from "@/utils/prisma/prismaClient";
import { validateServerRole } from "@/lib/server-role-validation";
import { createSafeAction, ActionState } from "@/lib/create-safe-action";
import { hasAdminAccess } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

const DeletePostSchema = z.object({
  id: z.string().uuid(),
});

type DeletePostInput = z.infer<typeof DeletePostSchema>;

async function deletePostHandler(
  data: DeletePostInput
): Promise<ActionState<DeletePostInput, { success: boolean }>> {
  const { user, userRole } = await validateServerRole(["CLIENT", "CORPORATE_EMPLOYEE", "ADMIN", "FITNESS_TRAINER_ADMIN"]);

  const post = await prisma.community_posts.findUnique({ where: { id: data.id } });
  if (!post) return { error: "Post not found" };

  if (post.author_id !== user.id && !hasAdminAccess(userRole)) {
    return { error: "You can only delete your own posts" };
  }

  await prisma.community_posts.delete({ where: { id: data.id } });

  revalidatePath("/community/feed");

  return { data: { success: true } };
}

export const deletePost = createSafeAction(DeletePostSchema, deletePostHandler);
