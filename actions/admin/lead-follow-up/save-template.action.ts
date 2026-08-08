"use server";

import { z } from "zod";
import prisma from "@/utils/prisma/prismaClient";
import { getAdminUser } from "@/utils/user";
import { createSafeAction, ActionState } from "@/lib/create-safe-action";
import { revalidatePath } from "next/cache";

const SaveTemplateSchema = z.object({
  id: z.string().uuid().optional(),
  pathway: z.string().trim().max(50).optional(),
  stepNumber: z.number().int().positive(),
  delayDays: z.number().int().min(0),
  subject: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(5000),
  isActive: z.boolean(),
});

type SaveTemplateInput = z.infer<typeof SaveTemplateSchema>;

async function saveTemplateHandler(
  data: SaveTemplateInput
): Promise<ActionState<SaveTemplateInput, { id: string }>> {
  const adminUser = await getAdminUser();
  if (!adminUser) return { error: "Admin access required" };

  const pathway = data.pathway || null;

  const template = data.id
    ? await prisma.lead_followup_templates.update({
        where: { id: data.id },
        data: {
          pathway,
          step_number: data.stepNumber,
          delay_days: data.delayDays,
          subject: data.subject,
          body: data.body,
          is_active: data.isActive,
        },
      })
    : await prisma.lead_followup_templates.create({
        data: {
          pathway,
          step_number: data.stepNumber,
          delay_days: data.delayDays,
          subject: data.subject,
          body: data.body,
          is_active: data.isActive,
          created_by_id: adminUser.userId,
        },
      });

  revalidatePath("/admin/lead-follow-up/templates");

  return { data: { id: template.id } };
}

export const saveTemplate = createSafeAction(SaveTemplateSchema, saveTemplateHandler);
