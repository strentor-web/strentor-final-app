"use server";

import { z } from "zod";
import prisma from "@/utils/prisma/prismaClient";
import { getAdminUser } from "@/utils/user";
import { createSafeAction, ActionState } from "@/lib/create-safe-action";
import { revalidatePath } from "next/cache";

const SetCommentStatusSchema = z.object({
  commentId: z.string().uuid(),
  status: z.enum(["PUBLISHED", "HIDDEN"]),
});

type SetCommentStatusInput = z.infer<typeof SetCommentStatusSchema>;

async function setCommentStatusHandler(
  data: SetCommentStatusInput
): Promise<ActionState<SetCommentStatusInput, { success: boolean }>> {
  const adminUser = await getAdminUser();
  if (!adminUser) return { error: "Admin access required" };

  await prisma.community_comments.update({
    where: { id: data.commentId },
    data: { status: data.status },
  });

  revalidatePath("/admin/community");
  revalidatePath("/community/feed");

  return { data: { success: true } };
}

export const setCommentStatus = createSafeAction(SetCommentStatusSchema, setCommentStatusHandler);
