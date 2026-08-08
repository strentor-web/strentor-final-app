"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useAction } from "@/hooks/useAction";
import { saveTemplate } from "@/actions/admin/lead-follow-up/save-template.action";
import { draftLeadFollowUp } from "@/actions/admin/lead-follow-up/draft-follow-up.action";

export interface TemplateFormValues {
  id?: string;
  pathway: string;
  stepNumber: string;
  delayDays: string;
  subject: string;
  body: string;
  isActive: boolean;
}

const EMPTY: TemplateFormValues = {
  pathway: "",
  stepNumber: "1",
  delayDays: "1",
  subject: "",
  body: "",
  isActive: true,
};

export function TemplateEditor({
  initial,
  sampleSubmissionId,
  onSaved,
}: {
  initial?: TemplateFormValues;
  /** Most recent real intake submission matching this pathway — used only
   * to seed "Generate starting draft"; not stored on the template itself. */
  sampleSubmissionId?: string;
  onSaved?: () => void;
}) {
  const [values, setValues] = useState<TemplateFormValues>(initial ?? EMPTY);

  const { execute: save, isLoading: isSaving } = useAction(saveTemplate, {
    onSuccess: () => {
      toast.success("Template saved.");
      onSaved?.();
    },
    onError: (error) => toast.error(error),
  });

  const { execute: draft, isLoading: isDrafting } = useAction(draftLeadFollowUp, {
    onSuccess: (data) => setValues((v) => ({ ...v, body: data.draft })),
    onError: (error) => toast.error(error),
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    save({
      id: initial?.id,
      pathway: values.pathway.trim() || undefined,
      stepNumber: Number(values.stepNumber),
      delayDays: Number(values.delayDays),
      subject: values.subject.trim(),
      body: values.body.trim(),
      isActive: values.isActive,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="t-pathway">Pathway (blank = every pathway)</Label>
          <Input
            id="t-pathway"
            value={values.pathway}
            onChange={(e) => setValues((v) => ({ ...v, pathway: e.target.value }))}
            placeholder="e.g. personal"
          />
        </div>
        <div>
          <Label htmlFor="t-step">Step number</Label>
          <Input
            id="t-step"
            type="number"
            min={1}
            value={values.stepNumber}
            onChange={(e) => setValues((v) => ({ ...v, stepNumber: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="t-delay">Send after (days)</Label>
          <Input
            id="t-delay"
            type="number"
            min={0}
            value={values.delayDays}
            onChange={(e) => setValues((v) => ({ ...v, delayDays: e.target.value }))}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="t-subject">Subject</Label>
        <Input
          id="t-subject"
          value={values.subject}
          onChange={(e) => setValues((v) => ({ ...v, subject: e.target.value }))}
          required
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="t-body">
            Body — merge tags: {"{{full_name}}"}, {"{{pathway}}"}, {"{{city}}"}, {"{{country}}"}
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!sampleSubmissionId || isDrafting}
            onClick={() => sampleSubmissionId && draft({ submissionId: sampleSubmissionId })}
          >
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            {isDrafting ? "Drafting…" : "Generate starting draft"}
          </Button>
        </div>
        <Textarea
          id="t-body"
          rows={8}
          value={values.body}
          onChange={(e) => setValues((v) => ({ ...v, body: e.target.value }))}
          required
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Review and edit the generated draft before saving — it's never sent unattended without a human
          having approved this template first.
        </p>
      </div>

      <label className="flex items-center gap-2 text-sm text-foreground">
        <Checkbox
          checked={values.isActive}
          onCheckedChange={(v) => setValues((prev) => ({ ...prev, isActive: !!v }))}
        />
        Active (cron will send this)
      </label>

      <Button type="submit" disabled={isSaving}>
        {initial?.id ? "Save changes" : "Create template"}
      </Button>
    </form>
  );
}
