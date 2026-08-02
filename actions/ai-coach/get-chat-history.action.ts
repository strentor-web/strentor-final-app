"use server";

import prisma from "@/utils/prisma/prismaClient";
import { getAuthenticatedUserId } from "@/utils/user";

export interface AiCoachChatMessage {
  id: string;
  role: string;
  content: string;
  createdAt: string;
}

export async function getAiCoachChatHistory(): Promise<AiCoachChatMessage[]> {
  const userId = await getAuthenticatedUserId();
  if (!userId) return [];

  const messages = await prisma.ai_coach_messages.findMany({
    where: { user_id: userId },
    orderBy: { created_at: "asc" },
    take: 100,
    select: { id: true, role: true, content: true, created_at: true },
  });

  return messages.map((m) => ({
    id: m.id,
    role: m.role,
    content: m.content,
    createdAt: m.created_at.toISOString(),
  }));
}
