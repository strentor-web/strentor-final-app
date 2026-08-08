import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import prisma from "@/utils/prisma/prismaClient";
import { createClient } from "@/utils/supabase/server";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { WebinarRegistrationForm } from "@/components/forms/webinars/WebinarRegistrationForm";
import { CalendarDays, Users as UsersIcon } from "lucide-react";

function formatWebinarTime(startsAt: Date) {
  return startsAt.toLocaleString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
    timeZoneName: "short",
  });
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const webinar = await prisma.webinars.findUnique({ where: { id } });
  if (!webinar) return { title: "Webinar - Strentor" };
  return {
    title: `${webinar.title} - Strentor Webinars`,
    description: webinar.description || undefined,
  };
}

export default async function WebinarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const webinar = await prisma.webinars.findUnique({ where: { id } });

  if (!webinar || webinar.status !== "PUBLISHED") {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let alreadyRegistered = false;
  if (user?.email) {
    const existing = await prisma.webinar_registrations.findUnique({
      where: { webinar_id_email: { webinar_id: webinar.id, email: user.email } },
    });
    alreadyRegistered = existing?.status === "REGISTERED";
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="relative bg-black py-16 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A96A]/10 via-black to-black" />
        <div className="container relative mx-auto px-4 text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-[#C9A96A]">Webinar</span>
          <h1 className="mt-4 text-4xl font-bold font-display text-white sm:text-5xl">{webinar.title}</h1>
          <div className="mx-auto mt-4 flex max-w-xl flex-wrap items-center justify-center gap-4 text-gray-300">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 text-[#C9A96A]" /> {formatWebinarTime(webinar.starts_at)}
            </span>
            {webinar.host_name && (
              <span className="flex items-center gap-1.5">
                <UsersIcon className="h-4 w-4 text-[#C9A96A]" /> {webinar.host_name}
              </span>
            )}
          </div>
        </div>
      </div>

      <section className="container mx-auto grid max-w-4xl gap-10 px-4 py-16 md:grid-cols-2">
        {webinar.description && (
          <ScrollReveal>
            <h2 className="text-xl font-bold text-foreground">About this session</h2>
            <p className="mt-3 whitespace-pre-wrap text-muted-foreground">{webinar.description}</p>
          </ScrollReveal>
        )}
        <ScrollReveal className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          {alreadyRegistered ? (
            <div className="text-center">
              <h3 className="text-lg font-bold text-card-foreground">You're already registered</h3>
              <p className="mt-2 text-muted-foreground">
                Check your email for the confirmation, or manage your registration from{" "}
                <a href="/webinars" className="text-[#C9A96A] underline">
                  your webinars
                </a>
                .
              </p>
            </div>
          ) : (
            <WebinarRegistrationForm
              webinarId={webinar.id}
              defaultName={user?.user_metadata?.name || ""}
              defaultEmail={user?.email || ""}
            />
          )}
        </ScrollReveal>
      </section>

      <Footer />
    </div>
  );
}
