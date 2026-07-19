import { Metadata } from "next"
import { validateServerRole } from "@/lib/server-role-validation"
import prisma from "@/utils/prisma/prismaClient"
import { AssessmentsQueue, type AssessmentRow } from "@/components/admin/assessments/AssessmentsQueue"
import { WeeklyCheckinsQueue, type CheckinRow } from "@/components/admin/assessments/WeeklyCheckinsQueue"

export const metadata: Metadata = {
  title: "Assessments & Check-ins - Admin - Strentor",
  description: "Review readiness assessments and weekly check-ins.",
  robots: { index: false, follow: false },
}

export default async function AdminAssessmentsPage() {
  await validateServerRole(["ADMIN", "FITNESS_TRAINER_ADMIN", "FITNESS_TRAINER"])

  const [assessments, checkins] = await Promise.all([
    prisma.assessments.findMany({
      orderBy: { submitted_at: "desc" },
      include: { users_profile: { select: { name: true, email: true } } },
      take: 100,
    }),
    prisma.weekly_checkins.findMany({
      orderBy: [{ coach_review_status: "asc" }, { week_start: "desc" }],
      include: { users_profile: { select: { name: true, email: true } } },
      take: 100,
    }),
  ])

  const assessmentRows: AssessmentRow[] = assessments.map((a) => ({
    id: a.id,
    userName: a.users_profile.name,
    userEmail: a.users_profile.email,
    totalScore: a.total_score,
    pathway: a.pathway_result,
    redFlagExists: a.red_flag_exists,
    humanReviewRequired: a.human_review_required,
    submittedAt: a.submitted_at.toISOString(),
  }))

  const checkinRows: CheckinRow[] = checkins.map((c) => ({
    id: c.id,
    userName: c.users_profile.name,
    userEmail: c.users_profile.email,
    weekStart: c.week_start.toISOString(),
    wins: c.wins,
    barriers: c.barriers,
    supportNeeded: c.support_needed,
    redFlagDetected: c.red_flag_detected,
    coachReviewStatus: c.coach_review_status,
  }))

  return (
    <div className="container py-8 space-y-10">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Assessments &amp; Check-ins</h1>
        <p className="text-xl text-muted-foreground mt-1">Review readiness assessments and weekly reflections.</p>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Readiness Assessments</h2>
        <AssessmentsQueue assessments={assessmentRows} />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Weekly Check-ins</h2>
        <WeeklyCheckinsQueue checkins={checkinRows} />
      </div>
    </div>
  )
}
