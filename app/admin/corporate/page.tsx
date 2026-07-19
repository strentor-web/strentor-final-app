import { Metadata } from "next"
import { validateServerRole } from "@/lib/server-role-validation"
import prisma from "@/utils/prisma/prismaClient"
import { CorporateInquiriesList, type CorporateInquiryRow } from "@/components/admin/corporate/CorporateInquiriesList"
import { CorporateGroupsManager, type CorporateGroupRow } from "@/components/admin/corporate/CorporateGroupsManager"
import { MentorshipApplicationsList, type MentorshipApplicationRow } from "@/components/admin/corporate/MentorshipApplicationsList"

export const metadata: Metadata = {
  title: "Corporate & Elite Mentorship - Admin - Strentor",
  description: "Manage corporate wellness inquiries, corporate groups, and Elite Mentorship applications.",
  robots: { index: false, follow: false },
}

export default async function AdminCorporatePage() {
  await validateServerRole(["ADMIN", "FITNESS_TRAINER_ADMIN"])

  const [inquiries, groups, applications] = await Promise.all([
    prisma.corporate_inquiries.findMany({ orderBy: { created_at: "desc" }, take: 100 }),
    prisma.corporate_groups.findMany({ orderBy: { created_at: "desc" }, take: 100 }),
    prisma.mentorship_applications.findMany({
      orderBy: [{ status: "asc" }, { submitted_at: "desc" }],
      include: { users_profile: { select: { name: true, email: true } } },
      take: 100,
    }),
  ])

  const inquiryRows: CorporateInquiryRow[] = inquiries.map((i) => ({
    id: i.id,
    companyName: i.company_name,
    contactName: i.contact_name,
    email: i.email,
    phone: i.phone,
    employeeCount: i.employee_count,
    message: i.message,
    status: i.status,
    createdAt: i.created_at.toISOString(),
  }))

  const groupRows: CorporateGroupRow[] = groups.map((g) => ({
    id: g.id,
    companyName: g.company_name,
    contactPerson: g.contact_person,
    contactEmail: g.contact_email,
    planType: g.plan_type,
    memberLimit: g.member_limit,
    status: g.status,
  }))

  const applicationRows: MentorshipApplicationRow[] = applications.map((a) => ({
    id: a.id,
    userName: a.users_profile.name,
    userEmail: a.users_profile.email,
    goals: a.goals,
    readinessScore: a.readiness_score,
    status: a.status,
    submittedAt: a.submitted_at.toISOString(),
  }))

  return (
    <div className="container py-8 space-y-10">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Corporate &amp; Elite Mentorship</h1>
        <p className="text-xl text-muted-foreground mt-1">
          B2B leads, active corporate groups, and Elite Mentorship applications.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Corporate Inquiries</h2>
        <CorporateInquiriesList inquiries={inquiryRows} />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Corporate Groups</h2>
        <CorporateGroupsManager initialGroups={groupRows} />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Elite Mentorship Applications</h2>
        <MentorshipApplicationsList applications={applicationRows} />
      </div>
    </div>
  )
}
