"use server";

import { z } from "zod";
import prisma from "@/utils/prisma/prismaClient";
import { getAdminUser } from "@/utils/user";
import { createSafeAction, ActionState } from "@/lib/create-safe-action";
import { revalidatePath } from "next/cache";

const MarkAttendedSchema = z.object({
  registrationId: z.string().uuid(),
  attended: z.boolean(),
});

type MarkAttendedInput = z.infer<typeof MarkAttendedSchema>;

async function markAttendedHandler(
  data: MarkAttendedInput
): Promise<ActionState<MarkAttendedInput, { success: boolean }>> {
  const adminUser = await getAdminUser();
  if (!adminUser) return { error: "Admin access required" };

  const registration = await prisma.webinar_registrations.update({
    where: { id: data.registrationId },
    data: { attended: data.attended },
  });

  revalidatePath(`/admin/webinars/${registration.webinar_id}`);

  return { data: { success: true } };
}

export const markAttended = createSafeAction(MarkAttendedSchema, markAttendedHandler);
