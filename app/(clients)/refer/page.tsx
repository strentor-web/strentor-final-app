import { validateServerRole } from "@/lib/server-role-validation"
import { getOrCreateReferralCode } from "@/lib/referral"
import prisma from "@/utils/prisma/prismaClient"
import { ReferralDashboard, type ReferralRow } from "@/components/refer/ReferralDashboard"
import { Metadata } from "next"
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader"
import { ScrollReveal } from "@/components/motion/ScrollReveal"

export const metadata: Metadata = {
  title: "Refer a Friend - Strentor",
  description: "Refer a friend to STRENTOR and earn cashback when they become a client.",
}

const siteUrl = "https://www.strentor.com"

export default async function ReferPage() {
  const { user } = await validateServerRole(["CLIENT", "CORPORATE_EMPLOYEE"])

  const [referralCode, profile, referrals] = await Promise.all([
    getOrCreateReferralCode(user.id),
    prisma.users_profile.findUnique({ where: { id: user.id }, select: { payout_upi_id: true } }),
    prisma.referrals.findMany({ where: { referrer_id: user.id }, orderBy: { created_at: "desc" } }),
  ])

  const rows: ReferralRow[] = referrals.map((r) => ({
    id: r.id,
    referredName: r.referred_name,
    referredEmail: r.referred_email,
    status: r.status as ReferralRow["status"],
    cashbackAmount: r.cashback_amount,
    createdAt: r.created_at.toISOString(),
  }))

  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader
        title="Refer a Friend"
        description="Earn ₹2,000 for every friend you refer who becomes a STRENTOR client."
      />

      <ScrollReveal>
        <ReferralDashboard
          referralLink={`${siteUrl}/apply-for-access?ref=${referralCode}`}
          initialUpiId={profile?.payout_upi_id || ""}
          referrals={rows}
        />
      </ScrollReveal>
    </div>
  )
}
