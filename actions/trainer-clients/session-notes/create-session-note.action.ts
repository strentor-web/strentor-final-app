"use server";

import { z } from "zod";
import prisma from "@/utils/prisma/prismaClient";
import { validateServerRole } from "@/lib/server-role-validation";
import { createSafeAction, ActionState } from "@/lib/create-safe-action";
import { completeText, AiNotConfiguredError } from "@/utils/ai/anthropicClient";
import { isNextControlFlowError } from "@/utils/next-control-flow-errors";

const SESSION_NOTE_SYSTEM_PROMPT = `You structure a fitness trainer's raw coaching-session notes into a short, skimmable summary for that client's file.

Format as plain text with these sections, omitting any that have nothing to report:
Focus: what the session targeted.
Progress: what improved or went well.
Concerns: anything the trainer should watch — fatigue, form breakdown, reported discomfort. Do not invent concerns that aren't in the notes.
Next Session: a concrete next step.

Stay strictly within what the notes say. Never add exercises, numbers, or medical interpretations the trainer didn't write. Keep it under 150 words.`;

const CreateSessionNoteSchema = z.object({
  clientId: z.string().uuid(),
  rawNotes: z.string().min(1, "Session notes are required").max(4000, "Notes are too long"),
});

type CreateSessionNoteInput = z.infer<typeof CreateSessionNoteSchema>;

interface SessionNoteResult {
  id: string;
  rawNotes: string;
  summary: string | null;
  sessionDate: string;
}

async function createSessionNoteHandler(
  data: CreateSessionNoteInput
): Promise<ActionState<CreateSessionNoteInput, SessionNoteResult>> {
  const { user } = await validateServerRole(["FITNESS_TRAINER", "FITNESS_TRAINER_ADMIN"]);

  let summary: string | null = null;
  try {
    summary = await completeText({
      system: SESSION_NOTE_SYSTEM_PROMPT,
      messages: [{ role: "user", content: data.rawNotes }],
      maxTokens: 400,
    });
  } catch (error) {
    if (isNextControlFlowError(error)) throw error;
    if (!(error instanceof AiNotConfiguredError)) {
      console.error("Error generating session note summary:", error);
    }
    // Falls through with summary left null — the raw notes are still
    // worth saving even when AI structuring isn't available.
  }

  const note = await prisma.trainer_session_notes.create({
    data: {
      client_id: data.clientId,
      trainer_id: user.id,
      raw_notes: data.rawNotes,
      summary,
    },
  });

  return {
    data: {
      id: note.id,
      rawNotes: note.raw_notes,
      summary: note.summary,
      sessionDate: note.session_date.toISOString(),
    },
  };
}

export const createSessionNote = createSafeAction(CreateSessionNoteSchema, createSessionNoteHandler);
