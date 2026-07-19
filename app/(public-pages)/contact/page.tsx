"use client"

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Mail, Globe, Clock } from "lucide-react"
import Header from "@/components/landing/Header"
import Footer from "@/components/landing/Footer"
import { DynamicContactEmail } from "@/components/forms/DynamicContactEmail"
import { DiscoveryCallButton } from "@/components/forms/DiscoveryCallButton"
import { IntakeForm } from "@/components/forms/intake/IntakeForm"
import { EnquiryPathway, PATHWAY_LABELS } from "@/types/intake"
import { useRegion } from "@/hooks/useRegion"
import { ScrollReveal, StaggerGroup } from "@/components/motion/ScrollReveal"
import { HoverLift } from "@/components/motion/HoverLift"

const CONTACT_INFO_BLOCKS = [
  {
    icon: Mail,
    label: "Email",
    content: (
      <a href="mailto:adityamandan@strentor.com" className="text-[#C9A96A] hover:underline">
        adityamandan@strentor.com
      </a>
    ),
  },
  {
    icon: Globe,
    label: "Website",
    content: <span className="text-muted-foreground">www.strentor.com</span>,
  },
  {
    icon: Clock,
    label: "Response Time",
    content: (
      <span className="text-muted-foreground">We typically respond within 24–48 hours.</span>
    ),
  },
]

const VALID_PATHWAYS = Object.keys(PATHWAY_LABELS) as EnquiryPathway[]

const HERO_COPY: Partial<Record<EnquiryPathway, { title: React.ReactNode; subtitle: string }>> = {
  corporate: {
    title: (
      <>
        Let's Discuss Your <span className="text-[#C9A96A]">Corporate Program</span>
      </>
    ),
    subtitle: "Tell us about your organization and goals, and we'll connect you with our corporate partnerships team.",
  },
  referral: {
    title: (
      <>
        Refer a <span className="text-[#C9A96A]">Client</span>
      </>
    ),
    subtitle: "Tell us about the referral and the relevant context, and we'll take it from there.",
  },
  sponsor: {
    title: (
      <>
        Become a <span className="text-[#C9A96A]">Sponsor</span>
      </>
    ),
    subtitle: "Tell us how you'd like to support someone's coaching access through Pay It Forward.",
  },
  general: {
    title: (
      <>
        Get In <span className="text-[#C9A96A]">Touch</span>
      </>
    ),
    subtitle: "Tell us what's on your mind and we'll get back to you.",
  },
}

const DEFAULT_HERO_COPY = {
  title: (
    <>
      Book Your <span className="text-[#C9A96A]">Fit Assessment</span>
    </>
  ),
  subtitle: "Tell us a little about your situation and we'll route you to the right person on the STRENTOR team.",
}

function ContactContent() {
  const searchParams = useSearchParams()
  const { region } = useRegion()
  const typeParam = searchParams.get("type")
  const planParam = searchParams.get("plan") || undefined

  const initialPathway: EnquiryPathway | undefined = VALID_PATHWAYS.includes(typeParam as EnquiryPathway)
    ? (typeParam as EnquiryPathway)
    : undefined

  const [pathway, setPathway] = useState<EnquiryPathway | undefined>(initialPathway)
  const heroCopy = (pathway && HERO_COPY[pathway]) || DEFAULT_HERO_COPY

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="relative bg-black py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A96A]/10 via-black to-black" />
        <div className="container relative mx-auto px-4 text-center">
          <ScrollReveal direction="none">
            <span className="text-sm font-bold uppercase tracking-widest text-[#C9A96A]">
              Get In Touch
            </span>
            <h1 className="mt-4 text-4xl font-bold font-display text-white sm:text-5xl">
              {heroCopy.title}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
              {heroCopy.subtitle}
            </p>
          </ScrollReveal>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-start">
          <StaggerGroup className="space-y-6">
            {CONTACT_INFO_BLOCKS.map((block) => (
              <ScrollReveal key={block.label}>
                <HoverLift>
                  <div className="flex gap-4 rounded-2xl border border-border bg-card p-6">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#C9A96A]">
                      <block.icon className="h-5 w-5 text-strentor-black" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-card-foreground">{block.label}</h3>
                      <p className="mt-1 text-sm">{block.content}</p>
                    </div>
                  </div>
                </HoverLift>
              </ScrollReveal>
            ))}

            <ScrollReveal>
              <HoverLift>
                <DynamicContactEmail pathway={pathway} />
              </HoverLift>
            </ScrollReveal>

            <ScrollReveal>
              <HoverLift>
                <div className="rounded-2xl border border-[#C9A96A]/30 bg-[#C9A96A]/5 p-6">
                  <h3 className="text-lg font-bold text-card-foreground">Prefer to talk live?</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Book a discovery call and speak with a coach directly.
                  </p>
                  <DiscoveryCallButton className="mt-4 h-11 w-full rounded-full bg-[#C9A96A] text-black hover:bg-[#C9A96A]/90" variant="default">
                    Book a Discovery Call
                  </DiscoveryCallButton>
                </div>
              </HoverLift>
            </ScrollReveal>
          </StaggerGroup>

          <ScrollReveal direction="left">
            <div>
              <h2 className="text-2xl font-bold font-display text-foreground">Send Us A Message</h2>
              <div className="mt-6">
                <IntakeForm
                  initialPathway={initialPathway}
                  region={region}
                  plan={planParam}
                  sourcePage="/contact"
                  onPathwayChange={setPathway}
                />
              </div>
            </div>
          </ScrollReveal>
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
