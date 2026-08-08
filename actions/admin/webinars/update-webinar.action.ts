"use server";

import { z } from "zod";
import prisma from "@/utils/prisma/prismaClient";
import { getAdminUser } from "@/utils/user";
import { createSafeAction, ActionState } from "@/lib/create-safe-action";
import { revalidatePath } from "next/cache";

const UpdateWebinarSchema = z.object({
  id: z.string().uuid(),
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).optional(),
  hostName: z.string().trim().max(200).optional(),
  platform: z.enum(["YOUTUBE_LIVE", "ZOOM", "OTHER"]),
  joinUrl: z.string().trim().url(),
  startsAt: z.string().trim().min(1),
  durationMinutes: z.number().int().positive().optional(),
  capacity: z.number().int().positive().optional(),
});

type UpdateWebinarInput = z.infer<typeof UpdateWebinarSchema>;

async function updateWebinarHandler(
  data: UpdateWebinarInput
): Promise<ActionState<UpdateWebinarInput, { success: boolean }>> {
  const adminUser = await getAdminUser();
  if (!adminUser) return { error: "Admin access required" };

  await prisma.webinars.update({
    where: { id: data.id },
    data: {
      title: data.title,
      description: data.description,
      host_name: data.hostName,
      platform: data.platform,
      join_url: data.joinUrl,
      starts_at: new Date(data.startsAt),
      duration_minutes: data.durationMinutes,
      capacity: data.capacity,
    },
  });

  revalidatePath("/admin/webinars");
  revalidatePath("/webinars");

  return { data: { success: true } };
}

export const updateWebinar = createSafeAction(UpdateWebinarSchema, updateWebinarHandler);
