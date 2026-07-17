"use client"

import { Mail } from "lucide-react"
import { EnquiryPathway } from "@/types/intake"
import { DEFAULT_CONTACT_EMAIL, PATHWAY_PRIMARY_EMAIL } from "@/utils/intake-routing"

interface DynamicContactEmailProps {
  pathway?: EnquiryPathway
}

export function DynamicContactEmail({ pathway }: DynamicContactEmailProps) {
  const email = pathway ? PATHWAY_PRIMARY_EMAIL[pathway] : DEFAULT_CONTACT_EMAIL

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#C9A96A]">
          <Mail className="h-5 w-5 text-strentor-black" />
        </div>
        <h3 className="text-lg font-bold text-card-foreground">Contact Email</h3>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        {pathway
          ? "Based on what you've selected, your enquiry will be sent to the right team:"
          : "Once you tell us what brings you here, we'll route your enquiry to the right team automatically. Or reach us directly at:"}
      </p>
      <a
        href={`mailto:${email}`}
        className="mt-3 inline-block text-lg font-bold text-[#C9A96A] hover:underline"
      >
        {email}
      </a>

      <div className="mt-8 border-t border-border pt-6">
        <h4 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Before you submit</h4>
        <p className="mt-2 text-sm text-muted-foreground">
          The form on the right asks a few guided questions so we can prepare properly before we speak —
          it only shows what's relevant to your situation. Nothing you share is made public, and STRENTOR
          is fitness coaching, not medical care.
        </p>
      </div>
    </div>
  )
}
