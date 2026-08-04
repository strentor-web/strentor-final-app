import { requireCorporateAdminGroup } from "@/lib/corporate-admin";
import prisma from "@/utils/prisma/prismaClient";
import { partnerPricingOptions } from "@/config/partnerPricing";
import { Metadata } from "next";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { ScrollReveal, StaggerGroup } from "@/components/motion/ScrollReveal";

export const metadata: Metadata = {
  title: "Programs & Workshops - Corporate Dashboard - Strentor",
};

function resolveOptionLabel(optionId: string): string {
  const option = partnerPricingOptions.find((o) => o.id === optionId);
  return option ? option.label : optionId;
}

function formatDate(date: Date | null): string {
  if (!date) return "Date to be confirmed";
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

const STATUS_LABELS: Record<string, string> = {
  scheduled: "Scheduled",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default async function CorporateProgramsPage() {
  const { corporateGroup } = await requireCorporateAdminGroup();

  const bookings = await prisma.corporate_program_bookings.findMany({
    where: { corporate_group_id: corporateGroup.id },
    orderBy: { scheduled_date: "asc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader
        title="Programs & Workshops"
        description={`Booked programs for ${corporateGroup.company_name}. To book a new workshop or pilot program, contact your STRENTOR account manager.`}
      />

      {bookings.length === 0 && (
        <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
          No programs booked yet.
        </div>
      )}

      {bookings.length > 0 && (
        <StaggerGroup className="grid gap-4">
          {bookings.map((booking) => (
            <ScrollReveal key={booking.id} as="div">
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h2 className="text-lg font-semibold text-card-foreground">
                    {resolveOptionLabel(booking.program_option)}
                  </h2>
                  <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
                    {STATUS_LABELS[booking.status] || booking.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{formatDate(booking.scheduled_date)}</p>
                {booking.notes && <p className="mt-3 text-sm text-card-foreground">{booking.notes}</p>}
              </div>
            </ScrollReveal>
          ))}
        </StaggerGroup>
      )}
    </div>
  );
}
