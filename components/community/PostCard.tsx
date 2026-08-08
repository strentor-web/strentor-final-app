"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/useAction";
import { deletePost } from "@/actions/community/delete-post.action";
import { CommentThread, type CommunityComment } from "@/components/community/CommentThread";

export interface CommunityPost {
  id: string;
  body: string;
  createdAt: string;
  authorId: string;
  authorName: string;
  comments: CommunityComment[];
}

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.round(diffHr / 24);
  return `${diffDay}d ago`;
}

export function PostCard({
  post,
  currentUserId,
  onDeleted,
}: {
  post: CommunityPost;
  currentUserId: string;
  onDeleted: (postId: string) => void;
}) {
  const [showComments, setShowComments] = useState(false);

  const { execute: executeDelete, isLoading: isDeleting } = useAction(deletePost, {
    onSuccess: () => {
      toast.success("Post deleted.");
      onDeleted(post.id);
    },
    onError: (error) => toast.error(error),
  });

  const isOwnPost = post.authorId === currentUserId;

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-card-foreground">{post.authorName}</p>
          <p className="text-xs text-muted-foreground">{timeAgo(post.createdAt)}</p>
        </div>
        {isOwnPost && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => executeDelete({ id: post.id })}
            disabled={isDeleting}
            aria-label="Delete post"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <p className="mt-3 whitespace-pre-wrap text-sm text-card-foreground">{post.body}</p>

      <button
        type="button"
        onClick={() => setShowComments((v) => !v)}
        className="mt-4 flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <MessageCircle className="h-3.5 w-3.5" />
        {post.comments.length === 0
          ? "Comment"
          : `${post.comments.length} comment${post.comments.length === 1 ? "" : "s"}`}
      </button>

      {showComments && (
        <CommentThread postId={post.id} comments={post.comments} currentUserId={currentUserId} />
      )}
    </div>
  );
}
