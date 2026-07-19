"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Header from "@/components/landing/Header"
import Footer from "@/components/landing/Footer"
import { Button } from "@/components/ui/button"
import { DiscoveryCallButton } from "@/components/forms/DiscoveryCallButton"
import { ScrollReveal } from "@/components/motion/ScrollReveal"
import { AlertTriangle, CheckCircle2 } from "lucide-react"
import {
  PATHWAY_DESTINATION,
  PATHWAY_LABELS,
  type PathwayResult,
} from "@/utils/assessment/scoring"

interface ResultData {
  id: string
  totalScore: number
  redFlagExists: boolean
  pathway: PathwayResult
  reason: string
  automaticProgressionAllowed: boolean
  showCorporateCta: boolean
  showEliteCta: boolean
}

function AssessmentResultContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  const [data, setData] = useState<ResultData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setError("Missing assessment id.")
      return
    }
    fetch(`/api/assessment/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("not found")
        return res.json()
      })
      .then(setData)
      .catch(() => setError("We couldn't find that assessment result."))
  }, [id])

  if (error) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <p className="text-muted-foreground">{error}</p>
        <Button asChild className="mt-6 h-12 rounded-full bg-[#C9A96A] hover:bg-[#C9A96A]/90">
          <Link href="/assessment">Retake Assessment</Link>
        </Button>
      </div>
    )
  }

  if (!data) {
    return <div className="mx-auto max-w-lg text-center text-muted-foreground">Loading your result...</div>
  }

  const destination = PATHWAY_DESTINATION[data.pathway]

  return (
    <div className="mx-auto max-w-2xl">
      {data.redFlagExists && (
        <div className="mb-8 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
          <p className="text-sm text-destructive">
            Pause this activity. Your response suggests professional guidance or coach review may
            be needed before continuing. This is not automatic progression — a coach will review
            your assessment.
          </p>
        </div>
      )}

      <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#C9A96A]/10">
          <CheckCircle2 className="h-7 w-7 text-[#C9A96A]" />
        </span>
        <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-[#C9A96A]">
          Your Recommended Pathway
        </p>
        <h1 className="mt-2 text-3xl font-bold font-display text-card-foreground">
          {PATHWAY_LABELS[data.pathway]}
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">{data.reason}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          Your pathway is a starting guide, not a medical clearance. Respect your body and seek
          professional support when needed.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild className="h-12 rounded-full bg-[#C9A96A] px-8 hover:bg-[#C9A96A]/90">
            <Link href={destination.href}>{destination.label}</Link>
          </Button>
          {!data.automaticProgressionAllowed && (
            <DiscoveryCallButton className="h-12 rounded-full border-[#C9A96A] px-8 text-[#C9A96A] hover:bg-[#C9A96A]/10">
              Book a Discovery Call
            </DiscoveryCallButton>
          )}
        </div>

        {(data.showCorporateCta || data.showEliteCta) && (
          <div className="mt-8 flex flex-col items-center justify-center gap-3 border-t border-border pt-8 sm:flex-row">
            {data.showCorporateCta && (
              <Button asChild variant="outline" className="h-11 rounded-full border-border px-6">
                <Link href="/partner-with-us">Explore Corporate Wellness</Link>
              </Button>
            )}
            {data.showEliteCta && (
              <Button asChild variant="outline" className="h-11 rounded-full border-border px-6">
                <Link href="/programs/elite-mentorship">Explore Elite Mentorship</Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function AssessmentResultPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="container mx-auto px-4 py-16 md:py-20">
        <ScrollReveal>
          <Suspense fallback={<div className="text-center text-muted-foreground">Loading...</div>}>
            <AssessmentResultContent />
          </Suspense>
        </ScrollReveal>
      </section>
      <Footer />
    </div>
  )
}
