import { Metadata } from "next"
import { validateServerRole } from "@/lib/server-role-validation"
import prisma from "@/utils/prisma/prismaClient"
import { SafetyFlagsTable, type SafetyFlagRow } from "@/components/admin/safety-flags/SafetyFlagsTable"

export const metadata: Metadata = {
  title: "Safety Flags - Admin - Strentor",
  description: "Triage safety flags raised by assessments and trackers.",
  robots: { index: false, follow: false },
}

export default async function AdminSafetyFlagsPage() {
  await validateServerRole(["ADMIN", "FITNESS_TRAINER_ADMIN", "FITNESS_TRAINER"])

  const flags = await prisma.safety_flags.findMany({
    orderBy: [{ status: "asc" }, { created_at: "desc" }],
    include: { users_profile: { select: { name: true, email: true } } },
    take: 100,
  })

  const rows: SafetyFlagRow[] = flags.map((flag) => ({
    id: flag.id,
    userName: flag.users_profile.name,
    userEmail: flag.users_profile.email,
    sourceType: flag.source_type,
    symptomType: flag.symptom_type,
    severity: flag.severity,
    status: flag.status,
    message: flag.message,
    adminNotes: flag.admin_notes,
    createdAt: flag.created_at.toISOString(),
  }))

  const openCount = rows.filter((r) => r.status === "OPEN").length

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Safety Flags</h1>
        <p className="text-xl text-muted-foreground mt-1">
          {openCount} open flag{openCount === 1 ? "" : "s"} awaiting review.
        </p>
      </div>
      <SafetyFlagsTable flags={rows} />
    </div>
  )
}
