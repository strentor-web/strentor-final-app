"use server";

import { z } from "zod";
import prisma from "@/utils/prisma/prismaClient";
import { validateServerRole } from "@/lib/server-role-validation";
import { createSafeAction, ActionState } from "@/lib/create-safe-action";
import { revalidatePath } from "next/cache";

const DeleteFoodLogSchema = z.object({
  id: z.string().uuid(),
});

type DeleteFoodLogInput = z.infer<typeof DeleteFoodLogSchema>;

async function deleteFoodLogHandler(
  data: DeleteFoodLogInput
): Promise<ActionState<DeleteFoodLogInput, { success: boolean }>> {
  const { user } = await validateServerRole(["CLIENT", "CORPORATE_EMPLOYEE"]);

  const log = await prisma.nutrition_logs.findUnique({ where: { id: data.id } });
  if (!log || log.user_id !== user.id) {
    return { error: "Log entry not found" };
  }

  await prisma.nutrition_logs.delete({ where: { id: data.id } });

  revalidatePath("/nutrition");

  return { data: { success: true } };
}

export const deleteFoodLog = createSafeAction(DeleteFoodLogSchema, deleteFoodLogHandler);
