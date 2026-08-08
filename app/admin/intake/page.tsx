import { Metadata } from "next"
import { validateServerRole } from "@/lib/server-role-validation"
import prisma from "@/utils/prisma/prismaClient"
import { IntakeSubmissionsList, type IntakeSubmissionRow } from "@/components/admin/intake/IntakeSubmissionsList"
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader"

export const metadata: Metadata = {
  title: "Intake Submissions - Admin - Strentor",
  description: "Every intake form submission, independent of email delivery.",
  robots: { index: false, follow: false },
}

export default async function AdminIntakePage() {
  await validateServerRole(["ADMIN", "FITNESS_TRAINER_ADMIN"])

  const submissions = await prisma.intake_submissions.findMany({
    orderBy: [{ status: "asc" }, { created_at: "desc" }],
    take: 200,
    include: { _count: { select: { lead_followup_sends: true } } },
  })

  const rows: IntakeSubmissionRow[] = submissions.map((s) => ({
    id: s.id,
    pathway: s.pathway,
    fullName: s.full_name,
    email: s.email,
    phone: s.phone,
    city: s.city,
    country: s.country,
    reviewLevel: s.review_level,
    status: s.status,
    sourcePage: s.source_page,
    createdAt: s.created_at.toISOString(),
    followUpsSent: s._count.lead_followup_sends,
    sequencePaused: s.sequence_paused,
  }))

  return (
    <div className="container py-8 space-y-6">
      <DashboardPageHeader
        title="Intake Submissions"
        description="Every application, regardless of whether the notification email was delivered."
      />
      <IntakeSubmissionsList submissions={rows} />
    </div>
  )
}
