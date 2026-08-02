"use client";

import { useState, type FormEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sparkles, Copy } from "lucide-react";
import { useAction } from "@/hooks/useAction";
import { draftContent } from "@/actions/admin/content-drafts/draft-content.action";
import { toast } from "sonner";

export function ContentDraftForm() {
  const [contentType, setContentType] = useState<"blog_post" | "social_caption">("blog_post");
  const [topic, setTopic] = useState("");
  const [outline, setOutline] = useState("");
  const [draft, setDraft] = useState("");

  const { execute, isLoading, fieldErrors } = useAction(draftContent, {
    onSuccess: (data) => setDraft(data.draft),
    onError: (error) => toast.error(error),
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!topic.trim()) return;
    execute({ contentType, topic: topic.trim(), outline: outline.trim() || undefined });
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(draft);
    toast.success("Copied to clipboard.");
  }

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
