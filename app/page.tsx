import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Accessibility,
  Apple,
  ArrowRight,
  Award,
  Brain,
  Compass,
  Crown,
  Dumbbell,
  Globe,
  HeartPulse,
  LineChart,
  Play,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import { HomeHeader } from "@/components/landing/HomeHeader";
import { HomeFooter } from "@/components/landing/HomeFooter";
import WhatsAppButton from "@/components/landing/WhatsAppButton";
import { ProgramsCarousel, type CarouselProgram } from "@/components/landing/ProgramsCarousel";
import Featured from "@/components/landing/Featured";
import { Button } from "@/components/ui/button";
import { ScrollReveal, StaggerGroup } from "@/components/motion/ScrollReveal";
import { TrackedLink } from "@/components/analytics/TrackedLink";

const homeTitle = "STRENTOR — Premium Performance Coaching for Wheelchair Users";
const homeDescription =
  "Premium strength, mindset and purpose coaching for ambitious wheelchair users in India, the UAE and Singapore. Personalized coaching that connects adaptive strength, nutrition, mindset and accountability to the goals that matter in your life. Founder-led by Aditya Mandan, a wheelchair user and para powerlifter.";

export const metadata: Metadata = {
  title: { absolute: homeTitle },
  description: homeDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: homeTitle,
    description: homeDescription,
    type: "website",
    url: "https://www.strentor.com/",
  },
  twitter: {
    card: "summary_large_image",
    title: homeTitle,
    description: homeDescription,
  },
};

const heroBadges = [
  { icon: Accessibility, label: "Wheelchair-First Approach" },
  { icon: Award, label: "Science-Backed Programs" },
  { icon: Sparkles, label: "Real Transformations" },
  { icon: Crown, label: "Elite Coaching, Premium Support" },
];

const iconClass = "h-5 w-5 text-[#C9A96A]";
const carouselPrograms: CarouselProgram[] = [
  { icon: <Users className={iconClass} />, title: "1:1 Coaching", tagline: "Personalized. Premium. Purposeful.", href: "/coaching" },
  { icon: <Dumbbell className={iconClass} />, title: "Adaptive Strength", tagline: "Safe. Effective. Sustainable.", href: "/programs/online-wheelchair-strength-training" },
  { icon: <Brain className={iconClass} />, title: "Mindset & Resilience", tagline: "Stronger mind. Stronger you.", href: "/the-strentor-method" },
  { icon: <Apple className={iconClass} />, title: "Nutrition Guidance", tagline: "Fuel. Heal. Perform.", href: "/coaching" },
  { icon: <LineChart className={iconClass} />, title: "Tracking & Feedback", tagline: "We track. You grow. We adapt.", href: "/coaching" },
];

const whyStrentor = [
  { icon: Accessibility, label: "Adaptive by Design" },
  { icon: Award, label: "Science Backed" },
  { icon: HeartPulse, label: "Health Conscious" },
  { icon: Compass, label: "Purpose Driven" },
];

const stats = [
  { icon: Users, value: "500+", label: "Lives Transformed" },
  { icon: Globe, value: "20+", label: "Countries" },
  { icon: Sparkles, value: "98%", label: "Client Satisfaction" },
  { icon: Dumbbell, value: "1000+", label: "Sessions Delivered" },
];

export default function Home() {
  return (
    <div className="bg-black">
      <HomeHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-black py-16 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A96A]/10 via-black to-black" />
        <div className="container relative mx-auto grid gap-12 px-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <h1 className="text-5xl font-extrabold uppercase leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl">
              Break.
              <br />
              Build.
              <br />
              <span className="text-[#C9A96A]">Become.</span>
            </h1>
            <p className="mt-6 max-w-md text-base text-gray-300 sm:text-lg">
              Adaptive strength coaching for wheelchair users and anyone ready
              to transform&mdash;physically, mentally and purposefully.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                className="h-14 rounded-full bg-[#C9A96A] px-8 text-sm font-bold uppercase tracking-widest text-black transition-transform hover:scale-105 hover:bg-[#C9A96A]/90"
              >
                <TrackedLink href="/apply-for-access" event="hero_cta_click" eventParams={{ location: "hero" }}>
                  Start Your Journey <ArrowRight className="h-4 w-4" />
                </TrackedLink>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-14 rounded-full border-white/20 px-8 text-sm font-bold uppercase tracking-widest text-white transition-transform hover:scale-105 hover:bg-white/5 hover:text-white"
              >
                <Link href="/transformation-stories">
                  <Play className="h-4 w-4" /> Watch Video
                </Link>
              </Button>
            </div>

            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-3">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-[#1a1a1a] text-[#C9A96A] ring-1 ring-[#C9A96A]/40"
                  >
                    <User className="h-4 w-4" />
                  </div>
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-400">500+ Transformations</span>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <ScrollReveal direction="up">
              <div className="relative aspect-[3/4] w-full max-w-md overflow-hidden rounded-3xl border border-white/10">
                <Image
                  src="/Aditya-transparent.png"
                  alt="Aditya Mandan, STRENTOR founder, wheelchair user and para powerlifter"
                  fill
                  sizes="(min-width: 1024px) 440px, 80vw"
                  className="object-cover object-top"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              </div>
            </ScrollReveal>

            <ul className="flex flex-row flex-wrap gap-6 lg:flex-col lg:gap-8">
              {heroBadges.map((badge) => (
                <li key={badge.label} className="flex items-start gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#C9A96A]/10">
                    <badge.icon className="h-4 w-4 text-[#C9A96A]" />
                  </div>
                  <span className="max-w-[9rem] text-xs font-bold uppercase leading-snug tracking-wide text-gray-300">
                    {badge.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Tagline strip */}
      <section className="border-y border-white/10 bg-black py-6">
        <p className="text-center text-sm font-bold uppercase tracking-[0.2em] text-gray-400 sm:text-base">
          Strength Without <span className="text-[#C9A96A]">Limits</span>. Purpose Without{" "}
          <span className="text-[#C9A96A]">Boundaries</span>.
        </p>
      </section>

      {/* Programs carousel */}
      <section className="bg-black py-20">
        <div className="container mx-auto px-4">
          <ScrollReveal className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C9A96A]">Our Programs</p>
            <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
              Built For Your <span className="text-[#C9A96A]">Transformation</span>
            </h2>
          </ScrollReveal>

          <div className="mt-12">
            <ProgramsCarousel programs={carouselPrograms} />
          </div>

          <div className="mt-10 text-center">
            <Button
              asChild
              className="h-12 rounded-full bg-[#C9A96A] px-7 text-xs font-bold uppercase tracking-widest text-black hover:bg-[#C9A96A]/90"
            >
              <Link href="/programs">
                Explore All Programs <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why STRENTOR */}
      <section className="bg-black py-20">
        <div className="container mx-auto grid items-center gap-14 px-4 lg:grid-cols-2">
          <ScrollReveal direction="up" className="flex justify-center">
            <div className="relative flex h-72 w-72 items-center justify-center rounded-full border border-[#C9A96A]/30 bg-gradient-to-br from-[#C9A96A]/10 via-black to-black sm:h-80 sm:w-80">
              <div className="absolute inset-4 rounded-full border border-[#C9A96A]/15" />
              <Image src="/strentor-icon.png" alt="STRENTOR emblem" width={180} height={180} className="relative h-40 w-40 drop-shadow-[0_0_30px_rgba(201,169,106,0.35)] sm:h-48 sm:w-48" />
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C9A96A]">Why STRENTOR?</p>
            <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
              More Than Fitness. It&apos;s a <span className="text-[#C9A96A]">Movement.</span>
            </h2>
            <p className="mt-4 max-w-lg text-gray-400">
              We combine adaptive training, mindset coaching, and
              health-conscious strategies to help you break limitations,
              build strength, and become your highest potential.
            </p>

            <StaggerGroup className="mt-8 grid grid-cols-2 gap-6">
              {whyStrentor.map((item) => (
                <ScrollReveal key={item.label} direction="up" className="flex items-center gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#C9A96A]/10">
                    <item.icon className="h-5 w-5 text-[#C9A96A]" />
                  </div>
                  <span className="text-sm font-bold uppercase tracking-wide text-gray-300">{item.label}</span>
                </ScrollReveal>
              ))}
            </StaggerGroup>

            <Button asChild className="mt-8 h-12 rounded-full bg-[#C9A96A] px-7 text-xs font-bold uppercase tracking-widest text-black hover:bg-[#C9A96A]/90">
              <Link href="/about">
                Learn More About Us <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </ScrollReveal>
        </div>
      </section>

      {/* Stats + stories */}
      <section className="bg-black py-20">
        <div className="container mx-auto px-4">
          <ScrollReveal className="mx-auto max-w-2xl text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Real People. Real Results.
              <br />
              <span className="text-[#C9A96A]">Real Transformations.</span>
            </h2>
          </ScrollReveal>

          <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-center">
            <StaggerGroup className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-2">
              {stats.map((stat) => (
                <ScrollReveal key={stat.label} direction="up" className="rounded-2xl border border-white/10 bg-[#101010] p-5 text-center">
                  <stat.icon className="mx-auto h-6 w-6 text-[#C9A96A]" />
                  <p className="mt-3 text-2xl font-extrabold text-white">{stat.value}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wide text-gray-500">{stat.label}</p>
                </ScrollReveal>
              ))}
            </StaggerGroup>

            <ScrollReveal direction="up">
              <Link
                href="/transformation-stories"
                className="group relative block aspect-video overflow-hidden rounded-2xl border border-white/10"
              >
                <Image
                  src="/Aditya-transparent.png"
                  alt="Watch STRENTOR client transformation stories"
                  fill
                  sizes="(min-width: 1024px) 480px, 90vw"
                  className="object-cover object-top opacity-70 transition-opacity group-hover:opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A96A] text-black transition-transform group-hover:scale-110">
                    <Play className="h-6 w-6" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest text-white">Watch Their Stories</span>
                </div>
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Press mentions */}
      <section className="border-y border-white/10 bg-black py-16">
        <Featured />
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-black py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A96A]/10 via-black to-black" />
        <div className="container relative mx-auto grid items-center gap-10 px-4 lg:grid-cols-[1.2fr_0.8fr]">
          <ScrollReveal scale={0.96} className="text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Ready to Break, Build and <span className="text-[#C9A96A]">Become?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-gray-300 lg:mx-0">
              Your transformation starts with one decision. Take the first
              step today.
            </p>
            <Button
              asChild
              className="mt-8 h-14 rounded-full bg-[#C9A96A] px-8 text-sm font-bold uppercase tracking-widest text-black transition-transform hover:scale-105 hover:bg-[#C9A96A]/90"
            >
              <TrackedLink href="/apply-for-access" event="hero_cta_click" eventParams={{ location: "final_cta" }}>
                Start Your Journey <ArrowRight className="h-4 w-4" />
              </TrackedLink>
            </Button>
          </ScrollReveal>

          <ScrollReveal direction="up" className="relative mx-auto hidden aspect-[3/4] w-full max-w-xs overflow-hidden rounded-3xl lg:block">
            <Image
              src="/Aditya-transparent.png"
              alt=""
              aria-hidden
              fill
              sizes="320px"
              className="object-cover object-top opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black" />
          </ScrollReveal>
        </div>
      </section>

      <HomeFooter />
      <WhatsAppButton />
    </div>
  );
}
