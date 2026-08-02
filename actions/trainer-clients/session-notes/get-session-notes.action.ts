"use server";

import prisma from "@/utils/prisma/prismaClient";
import { validateServerRole } from "@/lib/server-role-validation";

export interface SessionNoteRow {
  id: string;
  rawNotes: string;
  summary: string | null;
  sessionDate: string;
  trainerName: string;
}

export async function getSessionNotes(clientId: string): Promise<SessionNoteRow[]> {
  await validateServerRole(["FITNESS_TRAINER", "FITNESS_TRAINER_ADMIN"]);

  const notes = await prisma.trainer_session_notes.findMany({
    where: { client_id: clientId },
    orderBy: { session_date: "desc" },
    take: 50,
    include: { trainer: { select: { name: true } } },
  });

  return notes.map((note) => ({
    id: note.id,
    rawNotes: note.raw_notes,
    summary: note.summary,
    sessionDate: note.session_date.toISOString(),
    trainerName: note.trainer.name,
  }));
}
