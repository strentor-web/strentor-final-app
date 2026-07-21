import { Metadata } from "next"
import { validateServerRole } from "@/lib/server-role-validation"
import prisma from "@/utils/prisma/prismaClient"
import { IntakeSubmissionsList, type IntakeSubmissionRow } from "@/components/admin/intake/IntakeSubmissionsList"

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
  }))

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Intake Submissions</h1>
        <p className="text-xl text-muted-foreground mt-1">
          Every application, regardless of whether the notification email was delivered.
        </p>
      </div>
      <IntakeSubmissionsList submissions={rows} />
    </div>
  )
}
