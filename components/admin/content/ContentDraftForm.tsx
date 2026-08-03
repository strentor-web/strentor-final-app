"use client";

import { useState, type FormEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Sparkles, Copy, Rocket, ExternalLink } from "lucide-react";
import { useAction } from "@/hooks/useAction";
import { draftContent } from "@/actions/admin/content-drafts/draft-content.action";
import { publishBlogPost } from "@/actions/admin/content-drafts/publish-blog-post.action";
import { toast } from "sonner";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function ContentDraftForm() {
  const [contentType, setContentType] = useState<"blog_post" | "social_caption">("blog_post");
  const [topic, setTopic] = useState("");
  const [outline, setOutline] = useState("");
  const [draft, setDraft] = useState("");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [relatedProgram, setRelatedProgram] = useState("");
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);

  const { execute, isLoading, fieldErrors } = useAction(draftContent, {
    onSuccess: (data) => setDraft(data.draft),
    onError: (error) => toast.error(error),
  });

  const { execute: executePublish, isLoading: isPublishing } = useAction(publishBlogPost, {
    onSuccess: (data) => {
      setPublishedUrl(data.url);
      toast.success("Published — live once your host finishes redeploying (usually a minute or two).");
    },
    onError: (error) => toast.error(error),
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!topic.trim()) return;
    setPublishedUrl(null);
    execute({ contentType, topic: topic.trim(), outline: outline.trim() || undefined });
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(draft);
    toast.success("Copied to clipboard.");
  }

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function handlePublish() {
    executePublish({
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim(),
      content: draft.trim(),
      relatedProgram: relatedProgram.trim() || undefined,
    });
  }

  const canPublish = contentType === "blog_post" && !!draft.trim() && !!title.trim() && !!slug.trim() && !!excerpt.trim();

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label>Content Type</Label>
              <RadioGroup value={contentType} onValueChange={(v) => setContentType(v as typeof contentType)} className="flex gap-6">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="blog_post" id="blog_post" />
                  <Label htmlFor="blog_post" className="font-normal">Blog Post</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="social_caption" id="social_caption" />
                  <Label htmlFor="social_caption" className="font-normal">Social Captions</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Why grip strength matters for wheelchair users"
                maxLength={300}
              />
              {fieldErrors?.topic && <p className="text-sm text-destructive">{fieldErrors.topic[0]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="outline">Outline / key points (optional)</Label>
              <Textarea
                id="outline"
                value={outline}
                onChange={(e) => setOutline(e.target.value)}
                placeholder="Bullet points, angle, anything specific to include…"
                rows={5}
                maxLength={2000}
              />
            </div>

            <Button type="submit" disabled={isLoading || !topic.trim()}>
              <Sparkles className="mr-2 h-4 w-4" />
              {isLoading ? "Drafting…" : "Generate Draft"}
            </Button>
          </form>

          {contentType === "blog_post" && draft && (
            <div className="mt-8 space-y-4 border-t border-border pt-6">
              <p className="text-sm font-semibold text-card-foreground">Publish to Blog</p>
              <p className="text-xs text-muted-foreground">
                This commits a new post directly to the live site — fill these in, review the
                draft on the right, then publish when you&apos;re sure.
              </p>

              <div className="space-y-2">
                <Label htmlFor="post-title">Title</Label>
                <Input id="post-title" value={title} onChange={(e) => handleTitleChange(e.target.value)} maxLength={200} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="post-slug">URL Slug</Label>
                <Input
                  id="post-slug"
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(slugify(e.target.value));
                  }}
                  maxLength={120}
                />
                {slug && <p className="text-xs text-muted-foreground">strentor.com/blog/{slug}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="post-excerpt">Excerpt</Label>
                <Textarea id="post-excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} maxLength={400} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="post-related">Related Program link (optional)</Label>
                <Input
                  id="post-related"
                  value={relatedProgram}
                  onChange={(e) => setRelatedProgram(e.target.value)}
                  placeholder="/programs/online-wheelchair-strength-training"
                  maxLength={200}
                />
              </div>

              {publishedUrl ? (
                <a
                  href={publishedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C9A96A] hover:underline"
                >
                  View published post <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button type="button" disabled={!canPublish || isPublishing} variant="destructive">
                      <Rocket className="mr-2 h-4 w-4" />
                      {isPublishing ? "Publishing…" : "Publish to Blog"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Publish this post live?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This commits &ldquo;{title}&rdquo; to content/blog/{slug}.mdx on your live
                        site&apos;s repository. It will go live once your host finishes deploying —
                        there&apos;s no draft/undo step after this.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handlePublish}>Publish</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-3 flex items-center justify-between">
            <Label>Draft</Label>
            {draft && (
              <Button type="button" variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy
              </Button>
            )}
          </div>
          <Textarea
            value={isLoading ? "Drafting…" : draft}
            onChange={(e) => setDraft(e.target.value)}
            readOnly={isLoading}
            rows={20}
            placeholder="Your draft will appear here."
            className="font-mono text-sm"
          />
        </CardContent>
      </Card>
    </div>
  );
}
