import { Metadata } from "next"
import { validateServerRole } from "@/lib/server-role-validation"
import prisma from "@/utils/prisma/prismaClient"
import { WeeklyCheckinForm } from "@/components/tracker/WeeklyCheckinForm"
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader"
import { ScrollReveal } from "@/components/motion/ScrollReveal"

export const metadata: Metadata = {
  title: "Weekly Reflection - Strentor",
  description: "Your weekly check-in: wins, barriers, and how your body is doing.",
  robots: { index: false, follow: false },
}

function startOfWeek(date: Date): string {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
  const day = d.getUTCDay()
  const diff = (day + 6) % 7
  d.setUTCDate(d.getUTCDate() - diff)
  return d.toISOString().slice(0, 10)
}

export default async function CheckInPage() {
  const { user } = await validateServerRole(["CLIENT", "CORPORATE_EMPLOYEE"])

  const currentWeekStart = startOfWeek(new Date())
  const existing = await prisma.weekly_checkins.findUnique({
    where: { user_id_week_start: { user_id: user.id, week_start: new Date(currentWeekStart) } },
  })

  return (
    <div className="container py-8 space-y-8">
      <DashboardPageHeader
        title="Weekly Reflection"
        description="A few minutes to reflect on your week and flag anything a coach should know."
      />

      <ScrollReveal>
        <WeeklyCheckinForm alreadyCompleted={!!existing} />
      </ScrollReveal>
    </div>
  )
}
