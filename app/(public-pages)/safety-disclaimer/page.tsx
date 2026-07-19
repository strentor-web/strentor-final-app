"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Header from "@/components/landing/Header"
import Footer from "@/components/landing/Footer"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollReveal } from "@/components/motion/ScrollReveal"
import { AlertTriangle } from "lucide-react"
import { SAFETY_ACK_KEY } from "@/utils/assessment/constants"

function SafetyDisclaimerContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get("next") || "/assessment"
  const [acknowledged, setAcknowledged] = useState(false)

  function handleContinue() {
    if (!acknowledged) return
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(SAFETY_ACK_KEY, "1")
    }
    router.push(next)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="relative bg-black py-16 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A96A]/10 via-black to-black" />
        <ScrollReveal direction="none" className="container relative mx-auto px-4 text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-[#C9A96A]">
            Before You Continue
          </span>
          <h1 className="mt-4 text-4xl font-bold font-display text-white sm:text-5xl">
            Safety Disclaimer &amp; Consent
          </h1>
        </ScrollReveal>
      </div>

      <section className="container mx-auto px-4 py-16 md:py-20">
        <ScrollReveal className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                STRENTOR coaching is <strong className="text-card-foreground">educational and lifestyle-focused</strong>.
                It does not diagnose, treat, prescribe, or replace medical care, physiotherapy, or
                emergency treatment.
              </p>
              <p>
                Before starting the Readiness Assessment, please confirm you understand the following:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Your pathway result is a starting guide, not a medical clearance.</li>
                <li>You will follow restrictions, medication, fluid, diet, and safety instructions from your own medical/clinical team.</li>
                <li>You will report pain, fatigue, skin issues, dizziness, breathlessness, fever, swelling, or new symptoms before training.</li>
                <li>A coach may pause, modify, or refer you to a professional when safety boundaries are unclear.</li>
              </ul>

              <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
                <p className="text-destructive">
                  If you are experiencing a medical emergency, contact your local emergency services
                  immediately. Do not use this Service for emergency assistance.
                </p>
              </div>

              <p>
                Read our full{" "}
                <Link href="/medical-disclaimer" className="text-[#C9A96A] hover:underline">
                  Medical Disclaimer
                </Link>{" "}
                for details.
              </p>
            </div>

            <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-background p-4 text-sm hover:border-[#C9A96A]">
              <Checkbox checked={acknowledged} onCheckedChange={(v) => setAcknowledged(v === true)} />
              <span className="text-card-foreground">
                I have read and understood this disclaimer, and I consent to continue.
              </span>
            </label>

            <Button
              onClick={handleContinue}
              disabled={!acknowledged}
              className="mt-6 h-12 w-full rounded-full bg-[#C9A96A] hover:bg-[#C9A96A]/90 disabled:opacity-50"
            >
              Continue to Readiness Assessment
            </Button>
          </div>
        </ScrollReveal>
      </section>

      <Footer />
    </div>
  )
}

export default function SafetyDisclaimerPage() {
  return (
    <Suspense>
      <SafetyDisclaimerContent />
    </Suspense>
  )
}
