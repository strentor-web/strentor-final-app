"use server";

import { z } from "zod";
import prisma from "@/utils/prisma/prismaClient";
import { getAdminUser } from "@/utils/user";
import { createSafeAction, ActionState } from "@/lib/create-safe-action";
import { revalidatePath } from "next/cache";

const SetPostStatusSchema = z.object({
  postId: z.string().uuid(),
  status: z.enum(["PUBLISHED", "HIDDEN"]),
  hiddenReason: z.string().max(500).optional(),
});

type SetPostStatusInput = z.infer<typeof SetPostStatusSchema>;

async function setPostStatusHandler(
  data: SetPostStatusInput
): Promise<ActionState<SetPostStatusInput, { success: boolean }>> {
  const adminUser = await getAdminUser();
  if (!adminUser) return { error: "Admin access required" };

  await prisma.community_posts.update({
    where: { id: data.postId },
    data: {
      status: data.status,
      hidden_reason: data.status === "HIDDEN" ? data.hiddenReason ?? null : null,
    },
  });

  revalidatePath("/admin/community");
  revalidatePath("/community/feed");

  return { data: { success: true } };
}

export const setPostStatus = createSafeAction(SetPostStatusSchema, setPostStatusHandler);
