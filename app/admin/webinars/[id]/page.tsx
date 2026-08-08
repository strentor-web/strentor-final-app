import { Metadata } from "next";
import { notFound } from "next/navigation";
import { validateServerRole } from "@/lib/server-role-validation";
import prisma from "@/utils/prisma/prismaClient";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { WebinarForm, type WebinarFormValues } from "@/components/admin/webinars/WebinarForm";
import { WebinarRegistrantsList, type RegistrantRow } from "@/components/admin/webinars/WebinarRegistrantsList";

export const metadata: Metadata = {
  title: "Webinar - Admin - Strentor",
  robots: { index: false, follow: false },
};

function toLocalInputValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default async function AdminWebinarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await validateServerRole(["ADMIN", "FITNESS_TRAINER_ADMIN"]);
  const { id } = await params;

  const webinar = await prisma.webinars.findUnique({
    where: { id },
    include: { registrations: { orderBy: { created_at: "desc" } } },
  });

  if (!webinar) notFound();

  const initial: WebinarFormValues = {
    id: webinar.id,
    title: webinar.title,
    description: webinar.description || "",
    hostName: webinar.host_name || "",
    platform: webinar.platform,
    joinUrl: webinar.join_url,
    startsAt: toLocalInputValue(webinar.starts_at),
    durationMinutes: webinar.duration_minutes ? String(webinar.duration_minutes) : "",
    capacity: webinar.capacity ? String(webinar.capacity) : "",
  };

  const registrants: RegistrantRow[] = webinar.registrations.map((reg) => ({
    id: reg.id,
    fullName: reg.full_name,
    email: reg.email,
    phone: reg.phone,
    status: reg.status,
    attended: reg.attended,
    createdAt: reg.created_at.toISOString(),
  }));

  return (
    <div className="container py-8 space-y-8">
      <DashboardPageHeader title={webinar.title} description={`${registrants.length} registrant(s)`} />

      <WebinarForm initial={initial} />

      <div>
        <h2 className="mb-3 text-lg font-bold text-foreground">Registrants</h2>
        <WebinarRegistrantsList registrants={registrants} />
      </div>
    </div>
  );
}
