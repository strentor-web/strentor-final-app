import { Metadata } from "next"
import { validateServerRole } from "@/lib/server-role-validation"
import prisma from "@/utils/prisma/prismaClient"
import { PainFatigueForm } from "@/components/tracker/PainFatigueForm"
import { TrackerHistory } from "@/components/tracker/TrackerHistory"
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader"
import { ScrollReveal } from "@/components/motion/ScrollReveal"

export const metadata: Metadata = {
  title: "Body Check Tracker - Strentor",
  description: "Log pain, fatigue, energy, and mood before or after training.",
  robots: { index: false, follow: false },
}

export default async function TrackerPage() {
  const { user } = await validateServerRole(["CLIENT", "CORPORATE_EMPLOYEE"])

  const logs = await prisma.pain_fatigue_logs.findMany({
    where: { user_id: user.id },
    orderBy: { created_at: "desc" },
    take: 10,
  })

  const serializedLogs = logs.map((log) => ({
    id: log.id,
    date: log.date.toISOString(),
    pain_level: log.pain_level,
    fatigue_level: log.fatigue_level,
    energy_level: log.energy_level,
    mood_level: log.mood_level,
    red_flag_detected: log.red_flag_detected,
  }))

  return (
    <div className="container py-8 space-y-8">
      <DashboardPageHeader
        title="Body Check Tracker"
        description="Check in with your body before or after training."
      />

      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        Pause and seek medical help for chest pain, severe breathlessness, fainting, new
        weakness/numbness, fever, sudden severe headache, open wound, major swelling, or any
        symptom your care team treats as urgent.
      </div>

      <ScrollReveal>
        <PainFatigueForm />
      </ScrollReveal>

      <ScrollReveal delay={0.08} className="border rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-6">Recent Body Checks</h2>
        <TrackerHistory logs={serializedLogs} />
      </ScrollReveal>
    </div>
  )
}
