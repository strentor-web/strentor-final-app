"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAction } from "@/hooks/useAction";
import { createPost } from "@/actions/community/create-post.action";
import { PostCard, type CommunityPost } from "@/components/community/PostCard";
import { ScrollReveal, StaggerGroup } from "@/components/motion/ScrollReveal";

export function CommunityFeedClient({
  initialPosts,
  currentUserId,
}: {
  initialPosts: CommunityPost[];
  currentUserId: string;
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [body, setBody] = useState("");

  const { execute, isLoading } = useAction(createPost, {
    onSuccess: (data) => {
      setPosts((prev) => [
        { id: data.id, body, createdAt: new Date().toISOString(), authorId: currentUserId, authorName: "You", comments: [] },
        ...prev,
      ]);
      setBody("");
      toast.success("Posted.");
    },
    onError: (error) => toast.error(error),
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    execute({ body });
  }

  function handleDeleted(postId: string) {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  }

  return (
    <div className="space-y-6">
      <ScrollReveal className="rounded-2xl border border-border bg-card p-6">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Share a win, ask a question, or say hello…"
            rows={3}
            maxLength={2000}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading || !body.trim()} className="bg-[#C9A96A] hover:bg-[#C9A96A]/90">
              Post
            </Button>
          </div>
        </form>
      </ScrollReveal>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
          No posts yet. Be the first to share something with the community.
        </div>
      ) : (
        <StaggerGroup className="space-y-4">
          {posts.map((post) => (
            <ScrollReveal key={post.id}>
              <PostCard post={post} currentUserId={currentUserId} onDeleted={handleDeleted} />
            </ScrollReveal>
          ))}
        </StaggerGroup>
      )}
    </div>
  );
}
