"use server";

import { z } from "zod";
import prisma from "@/utils/prisma/prismaClient";
import { validateServerAuth } from "@/lib/server-role-validation";
import { createSafeAction, ActionState } from "@/lib/create-safe-action";
import { revalidatePath } from "next/cache";

const CancelRegistrationSchema = z.object({
  id: z.string().uuid(),
});

type CancelRegistrationInput = z.infer<typeof CancelRegistrationSchema>;

async function cancelRegistrationHandler(
  data: CancelRegistrationInput
): Promise<ActionState<CancelRegistrationInput, { success: boolean }>> {
  const { user } = await validateServerAuth();

  const registration = await prisma.webinar_registrations.findUnique({ where: { id: data.id } });
  // Known V1 gap: an anonymous registrant with no account has no way to
  // self-cancel here (registration.user_id is null for them). Fast-follow
  // is a tokenized cancel link, mirroring the Phase 3 unsubscribe token.
  if (!registration || registration.user_id !== user.id) {
    return { error: "Registration not found" };
  }

  await prisma.webinar_registrations.update({
    where: { id: data.id },
    data: { status: "CANCELLED" },
  });

  revalidatePath("/webinars");

  return { data: { success: true } };
}

export const cancelRegistration = createSafeAction(CancelRegistrationSchema, cancelRegistrationHandler);
