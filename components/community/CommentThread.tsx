"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAction } from "@/hooks/useAction";
import { createComment } from "@/actions/community/create-comment.action";
import { deleteComment } from "@/actions/community/delete-comment.action";

export interface CommunityComment {
  id: string;
  body: string;
  createdAt: string;
  authorId: string;
  authorName: string;
}

function CommentRow({
  comment,
  currentUserId,
  onDeleted,
}: {
  comment: CommunityComment;
  currentUserId: string;
  onDeleted: (commentId: string) => void;
}) {
  const { execute, isLoading } = useAction(deleteComment, {
    onSuccess: () => onDeleted(comment.id),
    onError: (error) => toast.error(error),
  });

  return (
    <div className="flex items-start justify-between gap-2 rounded-lg bg-muted/40 px-3 py-2">
      <div>
        <p className="text-xs font-semibold text-foreground">{comment.authorName}</p>
        <p className="mt-0.5 whitespace-pre-wrap text-sm text-foreground">{comment.body}</p>
      </div>
      {comment.authorId === currentUserId && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive"
          onClick={() => execute({ id: comment.id })}
          disabled={isLoading}
          aria-label="Delete comment"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}

export function CommentThread({
  postId,
  comments,
  currentUserId,
}: {
  postId: string;
  comments: CommunityComment[];
  currentUserId: string;
}) {
  const [items, setItems] = useState(comments);
  const [body, setBody] = useState("");

  const { execute, isLoading } = useAction(createComment, {
    onSuccess: (data) => {
      setItems((prev) => [
        ...prev,
        { id: data.id, body, createdAt: new Date().toISOString(), authorId: currentUserId, authorName: "You" },
      ]);
      setBody("");
    },
    onError: (error) => toast.error(error),
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    execute({ postId, body });
  }

  function handleDeleted(commentId: string) {
    setItems((prev) => prev.filter((c) => c.id !== commentId));
  }

  return (
    <div className="mt-4 space-y-2 border-t border-border pt-4">
      {items.map((comment) => (
        <CommentRow key={comment.id} comment={comment} currentUserId={currentUserId} onDeleted={handleDeleted} />
      ))}

      <form onSubmit={handleSubmit} className="flex items-start gap-2 pt-1">
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write a comment…"
          rows={2}
          maxLength={2000}
          className="text-sm"
        />
        <Button type="submit" size="sm" disabled={isLoading || !body.trim()}>
          Post
        </Button>
      </form>
    </div>
  );
}
