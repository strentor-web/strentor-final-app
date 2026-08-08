"use server";

import { z } from "zod";
import prisma from "@/utils/prisma/prismaClient";
import { getAdminUser } from "@/utils/user";
import { createSafeAction, ActionState } from "@/lib/create-safe-action";
import { revalidatePath } from "next/cache";

const ToggleSequencePauseSchema = z.object({
  submissionId: z.string().uuid(),
  paused: z.boolean(),
});

type ToggleSequencePauseInput = z.infer<typeof ToggleSequencePauseSchema>;

async function toggleSequencePauseHandler(
  data: ToggleSequencePauseInput
): Promise<ActionState<ToggleSequencePauseInput, { success: boolean }>> {
  const adminUser = await getAdminUser();
  if (!adminUser) return { error: "Admin access required" };

  await prisma.intake_submissions.update({
    where: { id: data.submissionId },
    data: { sequence_paused: data.paused },
  });

  revalidatePath("/admin/intake");

  return { data: { success: true } };
}

export const toggleSequencePause = createSafeAction(ToggleSequencePauseSchema, toggleSequencePauseHandler);
