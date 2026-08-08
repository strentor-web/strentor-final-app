import { Metadata } from "next";
import Link from "next/link";
import { validateServerRole } from "@/lib/server-role-validation";
import prisma from "@/utils/prisma/prismaClient";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { WebinarForm } from "@/components/admin/webinars/WebinarForm";
import { WebinarStatusControl } from "@/components/admin/webinars/WebinarStatusControl";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Webinars - Admin - Strentor",
  description: "Create and manage webinars, and review registrants.",
  robots: { index: false, follow: false },
};

export default async function AdminWebinarsPage() {
  await validateServerRole(["ADMIN", "FITNESS_TRAINER_ADMIN"]);

  const webinars = await prisma.webinars.findMany({
    orderBy: { starts_at: "desc" },
    include: { _count: { select: { registrations: true } } },
  });

  return (
    <div className="container py-8 space-y-8">
      <DashboardPageHeader
        title="Webinars"
        description="Create webinars and manage registrations and reminders."
      />

      <WebinarForm />

      <div className="space-y-3">
        {webinars.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg">No webinars yet.</div>
        ) : (
          webinars.map((webinar) => (
            <div
              key={webinar.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/webinars/${webinar.id}`} className="font-semibold text-foreground hover:underline">
                    {webinar.title}
                  </Link>
                  <Badge variant="outline">{webinar._count.registrations} registered</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {webinar.starts_at.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                </p>
              </div>
              <WebinarStatusControl id={webinar.id} status={webinar.status} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
