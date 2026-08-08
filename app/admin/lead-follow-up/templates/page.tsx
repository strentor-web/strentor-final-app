import { Metadata } from "next";
import { validateServerRole } from "@/lib/server-role-validation";
import prisma from "@/utils/prisma/prismaClient";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { TemplateList, type TemplateListItem } from "@/components/admin/lead-follow-up/TemplateList";

export const metadata: Metadata = {
  title: "Lead Follow-Up Templates - Admin - Strentor",
  description: "Manage the automated email sequence sent to new leads.",
  robots: { index: false, follow: false },
};

export default async function AdminLeadFollowUpTemplatesPage() {
  await validateServerRole(["ADMIN", "FITNESS_TRAINER_ADMIN"]);

  const [templates, sampleSubmission] = await Promise.all([
    prisma.lead_followup_templates.findMany({
      orderBy: [{ pathway: "asc" }, { step_number: "asc" }],
    }),
    prisma.intake_submissions.findFirst({ orderBy: { created_at: "desc" }, select: { id: true } }),
  ]);

  const rows: TemplateListItem[] = templates.map((t) => ({
    id: t.id,
    pathway: t.pathway || "",
    stepNumber: String(t.step_number),
    delayDays: String(t.delay_days),
    subject: t.subject,
    body: t.body,
    isActive: t.is_active,
  }));

  return (
    <div className="container py-8 space-y-6">
      <DashboardPageHeader
        title="Lead Follow-Up Templates"
        description="Admin-approved templates the automated sequence sends — nothing goes out unattended without review here first."
      />
      <TemplateList templates={rows} sampleSubmissionId={sampleSubmission?.id} />
    </div>
  );
}
