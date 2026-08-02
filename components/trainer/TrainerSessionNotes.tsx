"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, NotebookPen } from "lucide-react";
import { useAction } from "@/hooks/useAction";
import { createSessionNote } from "@/actions/trainer-clients/session-notes/create-session-note.action";
import { getSessionNotes, type SessionNoteRow } from "@/actions/trainer-clients/session-notes/get-session-notes.action";
import { toast } from "sonner";

export function TrainerSessionNotes({ clientId }: { clientId: string }) {
  const [notes, setNotes] = useState<SessionNoteRow[]>([]);
  const [rawNotes, setRawNotes] = useState("");
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);

  const { execute, isLoading, fieldErrors } = useAction(createSessionNote, {
    onSuccess: (data) => {
      setNotes((prev) => [
        { id: data.id, rawNotes: data.rawNotes, summary: data.summary, sessionDate: data.sessionDate, trainerName: "You" },
        ...prev,
      ]);
      setRawNotes("");
      toast.success(data.summary ? "Note saved and summarized." : "Note saved.");
    },
    onError: (error) => toast.error(error),
  });

  useEffect(() => {
    getSessionNotes(clientId)
      .then(setNotes)
      .catch((error) => {
        console.error("Failed to load session notes:", error);
        toast.error("Failed to load session notes.");
      })
      .finally(() => setIsLoadingNotes(false));
  }, [clientId]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!rawNotes.trim()) return;
    execute({ clientId, rawNotes: rawNotes.trim() });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <NotebookPen className="h-5 w-5" /> Session Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-2">
          <Textarea
            value={rawNotes}
            onChange={(e) => setRawNotes(e.target.value)}
            placeholder="Jot down what happened this session — exercises, how the client felt, anything to follow up on…"
            rows={4}
            maxLength={4000}
            disabled={isLoading}
          />
          {fieldErrors?.rawNotes && (
            <p className="text-sm text-destructive">{fieldErrors.rawNotes[0]}</p>
          )}
          <Button type="submit" disabled={isLoading || !rawNotes.trim()}>
            <Sparkles className="mr-2 h-4 w-4" />
            {isLoading ? "Summarizing…" : "Save & Summarize"}
          </Button>
        </form>

        <div className="space-y-4">
          {isLoadingNotes && <p className="text-sm text-muted-foreground">Loading notes…</p>}
          {!isLoadingNotes && notes.length === 0 && (
            <p className="text-sm text-muted-foreground">No session notes yet.</p>
          )}
          {notes.map((note) => (
            <div key={note.id} className="rounded-lg border border-border p-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{note.trainerName}</span>
                <span>{new Date(note.sessionDate).toLocaleDateString()}</span>
              </div>
              {note.summary ? (
                <p className="mt-2 whitespace-pre-wrap text-sm text-card-foreground">{note.summary}</p>
              ) : (
                <p className="mt-2 whitespace-pre-wrap text-sm text-card-foreground">{note.rawNotes}</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
