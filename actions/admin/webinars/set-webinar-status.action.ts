"use server";

import { z } from "zod";
import prisma from "@/utils/prisma/prismaClient";
import { getAdminUser } from "@/utils/user";
import { createSafeAction, ActionState } from "@/lib/create-safe-action";
import { revalidatePath } from "next/cache";

const SetWebinarStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["DRAFT", "PUBLISHED", "CANCELLED", "COMPLETED"]),
});

type SetWebinarStatusInput = z.infer<typeof SetWebinarStatusSchema>;

async function setWebinarStatusHandler(
  data: SetWebinarStatusInput
): Promise<ActionState<SetWebinarStatusInput, { success: boolean }>> {
  const adminUser = await getAdminUser();
  if (!adminUser) return { error: "Admin access required" };

  await prisma.webinars.update({
    where: { id: data.id },
    data: { status: data.status },
  });

  revalidatePath("/admin/webinars");
  revalidatePath("/webinars");

  return { data: { success: true } };
}

export const setWebinarStatus = createSafeAction(SetWebinarStatusSchema, setWebinarStatusHandler);
