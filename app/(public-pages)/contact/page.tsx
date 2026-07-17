"use client"

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import Header from "@/components/landing/Header"
import Footer from "@/components/landing/Footer"
import { DynamicContactEmail } from "@/components/forms/DynamicContactEmail"
import { IntakeForm } from "@/components/forms/intake/IntakeForm"
import { EnquiryPathway, PATHWAY_LABELS } from "@/types/intake"
import { useRegion } from "@/hooks/useRegion"

const VALID_PATHWAYS = Object.keys(PATHWAY_LABELS) as EnquiryPathway[]

function ContactContent() {
  const searchParams = useSearchParams()
  const { region } = useRegion()
  const typeParam = searchParams.get("type")
  const planParam = searchParams.get("plan") || undefined

  const initialPathway: EnquiryPathway | undefined = VALID_PATHWAYS.includes(typeParam as EnquiryPathway)
    ? (typeParam as EnquiryPathway)
    : undefined

  const [pathway, setPathway] = useState<EnquiryPathway | undefined>(initialPathway)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="relative bg-black py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A96A]/10 via-black to-black" />
        <div className="container relative mx-auto px-4 text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-[#C9A96A]">
            Get In Touch
          </span>
          <h1 className="mt-4 text-4xl font-bold font-display text-white sm:text-5xl">
            Book Your <span className="text-[#C9A96A]">Fit Assessment</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
            Tell us a little about your situation and we'll route you to the right person on the
            STRENTOR team.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-start">
          <DynamicContactEmail pathway={pathway} />
          <IntakeForm
            initialPathway={initialPathway}
            region={region}
            plan={planParam}
            sourcePage="/contact"
            onPathwayChange={setPathway}
          />
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ContactContent />
    </Suspense>
  )
}
