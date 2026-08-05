"use server";

import { z } from "zod";
import prisma from "@/utils/prisma/prismaClient";
import { validateServerRole } from "@/lib/server-role-validation";
import { createSafeAction, ActionState } from "@/lib/create-safe-action";
import { revalidatePath } from "next/cache";

const CreateWaterLogSchema = z.object({
  date: z.string(), // YYYY-MM-DD
  amountMl: z.number().int().min(1).max(5000),
});

type CreateWaterLogInput = z.infer<typeof CreateWaterLogSchema>;

async function createWaterLogHandler(
  data: CreateWaterLogInput
): Promise<ActionState<CreateWaterLogInput, { id: string }>> {
  const { user } = await validateServerRole(["CLIENT", "CORPORATE_EMPLOYEE"]);

  const log = await prisma.water_logs.create({
    data: {
      user_id: user.id,
      date: new Date(data.date),
      amount_ml: data.amountMl,
    },
  });

  revalidatePath("/nutrition");

  return { data: { id: log.id } };
}

export const createWaterLog = createSafeAction(CreateWaterLogSchema, createWaterLogHandler);
