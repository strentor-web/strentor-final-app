import { validateServerRole } from "@/lib/server-role-validation";
import prisma from "@/utils/prisma/prismaClient";
import { partnerPricingOptions } from "@/config/partnerPricing";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Company Workshops - Strentor",
  description: "Workshops and pilot programs your organization has booked with STRENTOR.",
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

export default async function CompanyWorkshopsPage() {
  const { user } = await validateServerRole(["CORPORATE_EMPLOYEE", "CORPORATE_ADMIN"]);

  const profile = await prisma.users_profile.findUnique({
    where: { id: user.id },
    select: { corporate_group_id: true, corporate_group: { select: { company_name: true } } },
  });

  const bookings = profile?.corporate_group_id
    ? await prisma.corporate_program_bookings.findMany({
        where: { corporate_group_id: profile.corporate_group_id },
        orderBy: { scheduled_date: "asc" },
      })
    : [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Company Workshops</h1>
        <p className="mt-2 text-muted-foreground">
          {profile?.corporate_group?.company_name
            ? `Workshops and programs booked for ${profile.corporate_group.company_name}.`
            : "Workshops and programs your organization has booked with STRENTOR."}
        </p>
      </div>

      {!profile?.corporate_group_id && (
        <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
          Your account isn't linked to a corporate group yet. Contact your organization's STRENTOR account
          admin if you believe this is a mistake.
        </div>
      )}

      {profile?.corporate_group_id && bookings.length === 0 && (
        <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
          No workshops booked yet.
        </div>
      )}

      {bookings.length > 0 && (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="rounded-lg border border-border bg-card p-6">
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
          ))}
        </div>
      )}
    </div>
  );
}
