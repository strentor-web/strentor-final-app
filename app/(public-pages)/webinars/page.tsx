import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import prisma from "@/utils/prisma/prismaClient";
import { createClient } from "@/utils/supabase/server";
import { ScrollReveal, StaggerGroup } from "@/components/motion/ScrollReveal";
import { HoverLift } from "@/components/motion/HoverLift";
import { CalendarDays, Users as UsersIcon } from "lucide-react";
import { CancelRegistrationButton } from "@/components/forms/webinars/CancelRegistrationButton";

export const metadata: Metadata = {
  title: "Webinars - Strentor",
  description: "Free live sessions on adaptive strength training, mindset, and recovery — hosted by the STRENTOR team.",
};

function formatWebinarTime(startsAt: Date) {
  return startsAt.toLocaleString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
    timeZoneName: "short",
  });
}

export default async function WebinarsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const upcoming = await prisma.webinars.findMany({
    where: { status: "PUBLISHED", starts_at: { gte: new Date() } },
    orderBy: { starts_at: "asc" },
  });

  const myRegistrations = user
    ? await prisma.webinar_registrations.findMany({
        where: { user_id: user.id, status: "REGISTERED", webinar: { starts_at: { gte: new Date() } } },
        include: { webinar: true },
        orderBy: { webinar: { starts_at: "asc" } },
      })
    : [];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="relative bg-black py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A96A]/10 via-black to-black" />
        <div className="container relative mx-auto px-4 text-center">
          <ScrollReveal direction="none" duration={0.4}>
            <h1 className="text-4xl font-bold font-display text-white sm:text-5xl md:text-6xl">
              Free <span className="text-[#C9A96A]">Webinars</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.15}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300 md:text-xl">
              Live sessions on adaptive strength training, mindset, and recovery — hosted by the
              STRENTOR team.
            </p>
          </ScrollReveal>
        </div>
      </div>

      {myRegistrations.length > 0 && (
        <section className="border-b border-border bg-muted/30 py-10">
          <div className="container mx-auto px-4">
            <h2 className="text-lg font-bold text-foreground">Your registrations</h2>
            <div className="mt-4 space-y-3">
              {myRegistrations.map((reg) => (
                <div
                  key={reg.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4"
                >
                  <div>
                    <p className="font-semibold text-card-foreground">{reg.webinar.title}</p>
                    <p className="text-sm text-muted-foreground">{formatWebinarTime(reg.webinar.starts_at)}</p>
                  </div>
                  <CancelRegistrationButton registrationId={reg.id} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="container mx-auto px-4 py-16">
        {upcoming.length === 0 ? (
          <div className="mx-auto max-w-lg rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            No upcoming webinars right now — check back soon.
          </div>
        ) : (
          <StaggerGroup className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
            {upcoming.map((webinar) => (
              <ScrollReveal key={webinar.id}>
                <HoverLift className="h-full">
                  <Link
                    href={`/webinars/${webinar.id}`}
                    className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm"
                  >
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#C9A96A]">
                      <CalendarDays className="h-4 w-4" />
                      {formatWebinarTime(webinar.starts_at)}
                    </div>
                    <h3 className="text-xl font-bold text-card-foreground">{webinar.title}</h3>
                    {webinar.description && (
                      <p className="line-clamp-3 text-muted-foreground">{webinar.description}</p>
                    )}
                    <div className="mt-auto flex items-center justify-between pt-2">
                      {webinar.host_name && (
                        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <UsersIcon className="h-3.5 w-3.5" /> {webinar.host_name}
                        </span>
                      )}
                      <Button className="ml-auto rounded-full bg-[#C9A96A] px-6 hover:bg-[#C9A96A]/90">
                        Register
                      </Button>
                    </div>
                  </Link>
                </HoverLift>
              </ScrollReveal>
            ))}
          </StaggerGroup>
        )}
      </section>

      <Footer />
    </div>
  );
}
