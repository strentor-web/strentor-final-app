"use client"

import { Suspense } from "react"
import Link from "next/link"
import Header from "@/components/landing/Header"
import Footer from "@/components/landing/Footer"
import { Button } from "@/components/ui/button"
import { ShieldAlert, Check } from "lucide-react"
import { useRegion } from "@/hooks/useRegion"
import { REGIONS, REGION_CONFIG, RegionCode } from "@/utils/region"
import { regionalPlans, formatRegionalPlanPrice } from "@/config/regionalPlans"

function RegionSwitcher({ region, setRegion }: { region: RegionCode; setRegion: (r: RegionCode) => void }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {REGIONS.map((code) => (
        <button
          key={code}
          onClick={() => setRegion(code)}
          className={`rounded-full border px-4 py-2 text-sm transition-colors ${
            region === code
              ? "border-[#C9A96A] bg-[#C9A96A] text-black"
              : "border-border text-muted-foreground hover:border-[#C9A96A] hover:text-foreground"
          }`}
        >
          {REGION_CONFIG[code].label} · {REGION_CONFIG[code].currency}
        </button>
      ))}
    </div>
  )
}

function PlansContent() {
  const { region, setRegion } = useRegion()

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <div className="relative bg-black py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A96A]/10 via-black to-black" />
        <div className="container relative mx-auto px-4 text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-[#C9A96A]">
            Plans &amp; Pricing
          </span>
          <h1 className="mt-4 text-4xl font-bold font-display text-white sm:text-5xl md:text-6xl">
            Choose Your <span className="text-[#C9A96A]">Path</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300 md:text-xl">
            Premium adaptive coaching, priced for where you live. Every plan starts with a
            conversation — final eligibility and program recommendation are confirmed after
            your Fit Assessment.
          </p>
        </div>
      </div>

      {/* Region switcher */}
      <div className="container mx-auto px-4 py-10">
        <p className="mb-4 text-center text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Viewing pricing for
        </p>
        <RegionSwitcher region={region} setRegion={setRegion} />
      </div>

      {/* Pricing cards */}
      <div className="container mx-auto px-4 pb-16">
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {regionalPlans.map((plan) => (
            <div
              key={plan.id}
              className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm transition-colors hover:border-[#C9A96A]"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#C9A96A]">
                  {plan.frequency}
                </p>
                <h3 className="mt-2 text-lg font-bold text-card-foreground">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{plan.positioning}</p>
                <p className="mt-4 text-2xl font-bold text-foreground">
                  {formatRegionalPlanPrice(plan, region)}
                </p>
                <p className="mt-3 text-sm text-muted-foreground">{plan.description}</p>
                <ul className="mt-4 space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#C9A96A]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Button asChild className="mt-6 w-full bg-[#C9A96A] hover:bg-[#C9A96A]/90 text-primary-foreground">
                <Link href={plan.href}>Learn More</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="container mx-auto px-4 pb-16">
        <div className="mx-auto flex max-w-3xl gap-4 rounded-xl border border-[#C9A96A]/30 bg-[#C9A96A]/5 p-6">
          <ShieldAlert className="h-6 w-6 flex-shrink-0 text-[#C9A96A]" />
          <p className="text-sm text-muted-foreground">
            Prices shown are fixed regional starting points, not a live currency conversion.
            Final pricing and program fit are confirmed after your Fit Assessment — STRENTOR
            provides fitness and nutrition coaching, not medical treatment or physiotherapy.
            Please consult your physician before beginning any new exercise program.
          </p>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-black py-20 text-center">
        <h2 className="mb-4 text-4xl font-bold font-display text-white sm:text-5xl">
          Not sure which plan is <span className="text-[#C9A96A]">right for you</span>?
        </h2>
        <p className="mx-auto max-w-[700px] pb-8 pt-2 text-gray-300 md:text-xl">
          Start with a Fit Assessment — we'll recommend the right path based on your goals and
          health context.
        </p>
        <Button asChild className="bg-[#C9A96A] hover:bg-[#C9A96A]/90 text-primary-foreground rounded-full px-8 py-6">
          <Link href="/contact">Book Fit Assessment</Link>
        </Button>
      </div>

      <Footer />
    </div>
  )
}

export default function PlansPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <PlansContent />
    </Suspense>
  )
}
