"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/useAction";
import { setPostStatus } from "@/actions/admin/community/set-post-status.action";
import { setCommentStatus } from "@/actions/admin/community/set-comment-status.action";

type ContentStatus = "PUBLISHED" | "HIDDEN";

export interface ModerationComment {
  id: string;
  body: string;
  status: ContentStatus;
  authorName: string;
  authorEmail: string;
  createdAt: string;
}

export interface ModerationPost {
  id: string;
  body: string;
  status: ContentStatus;
  hiddenReason: string | null;
  authorName: string;
  authorEmail: string;
  createdAt: string;
  comments: ModerationComment[];
}

function CommentRow({ comment }: { comment: ModerationComment }) {
  const [status, setStatus] = useState(comment.status);

  const { execute, isLoading } = useAction(setCommentStatus, {
    onSuccess: () => toast.success("Comment updated."),
    onError: (error) => toast.error(error),
  });

  function toggle() {
    const next = status === "PUBLISHED" ? "HIDDEN" : "PUBLISHED";
    setStatus(next);
    execute({ commentId: comment.id, status: next });
  }

  return (
    <div className="flex items-start justify-between gap-3 rounded-lg bg-muted/40 px-3 py-2">
      <div>
        <p className="text-xs font-semibold text-foreground">
          {comment.authorName} <span className="font-normal text-muted-foreground">({comment.authorEmail})</span>
        </p>
        <p className="mt-0.5 text-sm text-foreground">{comment.body}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Badge variant={status === "PUBLISHED" ? "secondary" : "destructive"}>{status}</Badge>
        <Button type="button" variant="outline" size="sm" onClick={toggle} disabled={isLoading}>
          {status === "PUBLISHED" ? "Hide" : "Unhide"}
        </Button>
      </div>
    </div>
  );
}

function PostRow({ post }: { post: ModerationPost }) {
  const [status, setStatus] = useState(post.status);

  const { execute, isLoading } = useAction(setPostStatus, {
    onSuccess: () => toast.success("Post updated."),
    onError: (error) => toast.error(error),
  });

  function toggle() {
    const next = status === "PUBLISHED" ? "HIDDEN" : "PUBLISHED";
    setStatus(next);
    execute({ postId: post.id, status: next });
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-card-foreground">
            {post.authorName} <span className="font-normal text-muted-foreground">({post.authorEmail})</span>
          </p>
          <p className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleString()}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={status === "PUBLISHED" ? "secondary" : "destructive"}>{status}</Badge>
          <Button type="button" variant="outline" size="sm" onClick={toggle} disabled={isLoading}>
            {status === "PUBLISHED" ? "Hide" : "Unhide"}
          </Button>
        </div>
      </div>

      <p className="mt-3 whitespace-pre-wrap text-sm text-card-foreground">{post.body}</p>

      {post.comments.length > 0 && (
        <div className="mt-4 space-y-2 border-t border-border pt-4">
          {post.comments.map((comment) => (
            <CommentRow key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
}

export function CommunityModerationList({ posts }: { posts: ModerationPost[] }) {
  if (posts.length === 0) {
    return <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg">No posts yet.</div>;
  }
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostRow key={post.id} post={post} />
      ))}
    </div>
  );
}
