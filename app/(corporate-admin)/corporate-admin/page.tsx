import Link from "next/link";
import { requireCorporateAdminGroup } from "@/lib/corporate-admin";
import prisma from "@/utils/prisma/prismaClient";
import { Metadata } from "next";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { ScrollReveal, StaggerGroup } from "@/components/motion/ScrollReveal";
import { HoverLift } from "@/components/motion/HoverLift";

export const metadata: Metadata = {
  title: "Corporate Dashboard - Strentor",
};

export default async function CorporateAdminOverviewPage() {
  const { corporateGroup } = await requireCorporateAdminGroup();

  const [employeeCount, upcomingBookings, pendingInvoices] = await Promise.all([
    prisma.users_profile.count({
      where: { corporate_group_id: corporateGroup.id, role: "CORPORATE_EMPLOYEE" },
    }),
    prisma.corporate_program_bookings.count({
      where: { corporate_group_id: corporateGroup.id, status: "scheduled" },
    }),
    prisma.corporate_invoices.count({
      where: { corporate_group_id: corporateGroup.id, status: "pending" },
    }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader
        title={corporateGroup.company_name}
        description={`${corporateGroup.plan_type ? `${corporateGroup.plan_type} plan` : "Corporate account"}${corporateGroup.member_limit ? ` — up to ${corporateGroup.member_limit} employees` : ""}`}
      />

      <StaggerGroup className="grid gap-4 sm:grid-cols-3">
        <ScrollReveal>
          <HoverLift tilt={false}>
            <Link href="/corporate-admin/employees" className="block rounded-lg border border-border bg-card p-6 hover:border-[#C9A96A]">
              <p className="text-sm text-muted-foreground">Employees</p>
              <p className="mt-2 text-3xl font-bold text-card-foreground">{employeeCount}</p>
              {corporateGroup.member_limit && (
                <p className="mt-1 text-xs text-muted-foreground">of {corporateGroup.member_limit} seats</p>
              )}
            </Link>
          </HoverLift>
        </ScrollReveal>
        <ScrollReveal delay={0.06}>
          <HoverLift tilt={false}>
            <Link href="/corporate-admin/programs" className="block rounded-lg border border-border bg-card p-6 hover:border-[#C9A96A]">
              <p className="text-sm text-muted-foreground">Upcoming programs</p>
              <p className="mt-2 text-3xl font-bold text-card-foreground">{upcomingBookings}</p>
            </Link>
          </HoverLift>
        </ScrollReveal>
        <ScrollReveal delay={0.12}>
          <HoverLift tilt={false}>
            <Link href="/corporate-admin/billing" className="block rounded-lg border border-border bg-card p-6 hover:border-[#C9A96A]">
              <p className="text-sm text-muted-foreground">Pending invoices</p>
              <p className="mt-2 text-3xl font-bold text-card-foreground">{pendingInvoices}</p>
            </Link>
          </HoverLift>
        </ScrollReveal>
      </StaggerGroup>
    </div>
  );
}
