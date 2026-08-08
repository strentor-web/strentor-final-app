"use server";

import { z } from "zod";
import prisma from "@/utils/prisma/prismaClient";
import { validateServerRole } from "@/lib/server-role-validation";
import { createSafeAction, ActionState } from "@/lib/create-safe-action";
import { hasAdminAccess } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

const DeleteCommentSchema = z.object({
  id: z.string().uuid(),
});

type DeleteCommentInput = z.infer<typeof DeleteCommentSchema>;

async function deleteCommentHandler(
  data: DeleteCommentInput
): Promise<ActionState<DeleteCommentInput, { success: boolean }>> {
  const { user, userRole } = await validateServerRole(["CLIENT", "CORPORATE_EMPLOYEE", "ADMIN", "FITNESS_TRAINER_ADMIN"]);

  const comment = await prisma.community_comments.findUnique({ where: { id: data.id } });
  if (!comment) return { error: "Comment not found" };

  if (comment.author_id !== user.id && !hasAdminAccess(userRole)) {
    return { error: "You can only delete your own comments" };
  }

  await prisma.community_comments.delete({ where: { id: data.id } });

  revalidatePath("/community/feed");

  return { data: { success: true } };
}

export const deleteComment = createSafeAction(DeleteCommentSchema, deleteCommentHandler);
