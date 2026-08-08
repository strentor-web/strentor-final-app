"use client";

import { TemplateEditor, type TemplateFormValues } from "@/components/admin/lead-follow-up/TemplateEditor";

export interface TemplateListItem extends TemplateFormValues {
  id: string;
}

export function TemplateList({
  templates,
  sampleSubmissionId,
}: {
  templates: TemplateListItem[];
  sampleSubmissionId?: string;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-3 text-lg font-bold text-foreground">New template</h2>
        <TemplateEditor sampleSubmissionId={sampleSubmissionId} />
      </div>

      {templates.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-bold text-foreground">Existing templates</h2>
          <div className="space-y-4">
            {templates.map((template) => (
              <TemplateEditor key={template.id} initial={template} sampleSubmissionId={sampleSubmissionId} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
