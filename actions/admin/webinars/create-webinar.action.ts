"use server";

import { z } from "zod";
import prisma from "@/utils/prisma/prismaClient";
import { getAdminUser } from "@/utils/user";
import { createSafeAction, ActionState } from "@/lib/create-safe-action";
import { revalidatePath } from "next/cache";

const CreateWebinarSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).optional(),
  hostName: z.string().trim().max(200).optional(),
  platform: z.enum(["YOUTUBE_LIVE", "ZOOM", "OTHER"]),
  joinUrl: z.string().trim().url(),
  startsAt: z.string().trim().min(1),
  durationMinutes: z.number().int().positive().optional(),
  capacity: z.number().int().positive().optional(),
});

type CreateWebinarInput = z.infer<typeof CreateWebinarSchema>;

async function createWebinarHandler(
  data: CreateWebinarInput
): Promise<ActionState<CreateWebinarInput, { id: string }>> {
  const adminUser = await getAdminUser();
  if (!adminUser) return { error: "Admin access required" };

  const webinar = await prisma.webinars.create({
    data: {
      title: data.title,
      description: data.description,
      host_name: data.hostName,
      platform: data.platform,
      join_url: data.joinUrl,
      starts_at: new Date(data.startsAt),
      duration_minutes: data.durationMinutes,
      capacity: data.capacity,
      created_by_id: adminUser.userId,
    },
  });

  revalidatePath("/admin/webinars");

  return { data: { id: webinar.id } };
}

export const createWebinar = createSafeAction(CreateWebinarSchema, createWebinarHandler);
