import { Metadata } from "next"
import { validateServerRole } from "@/lib/server-role-validation"
import prisma from "@/utils/prisma/prismaClient"
import { ReferralsList, type ReferralAdminRow } from "@/components/admin/referrals/ReferralsList"
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader"

export const metadata: Metadata = {
  title: "Referrals - Admin - Strentor",
  description: "Review client referrals and confirm cashback owed.",
  robots: { index: false, follow: false },
}

export default async function AdminReferralsPage() {
  await validateServerRole(["ADMIN", "FITNESS_TRAINER_ADMIN"])

  const referrals = await prisma.referrals.findMany({
    orderBy: [{ status: "asc" }, { created_at: "desc" }],
    take: 200,
    include: { referrer: { select: { name: true, email: true, payout_upi_id: true } } },
  })

  const rows: ReferralAdminRow[] = referrals.map((r) => ({
    id: r.id,
    referrerName: r.referrer.name,
    referrerEmail: r.referrer.email,
    payoutUpiId: r.referrer.payout_upi_id,
    referredName: r.referred_name,
    referredEmail: r.referred_email,
    status: r.status as ReferralAdminRow["status"],
    cashbackAmount: r.cashback_amount,
    createdAt: r.created_at.toISOString(),
  }))

  return (
    <div className="container py-8 space-y-6">
      <DashboardPageHeader
        title="Referrals"
        description={'Mark a referral "Converted" once the referred person becomes a paying client, then "Paid" once you\'ve sent the cashback.'}
      />
      <ReferralsList referrals={rows} />
    </div>
  )
}
