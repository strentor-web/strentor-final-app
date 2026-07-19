"use client"

import Header from "@/components/landing/Header"
import Footer from "@/components/landing/Footer"
import { IntakeForm } from "@/components/forms/intake/IntakeForm"
import { partnerPricingOptions } from "@/config/partnerPricing"
import { Megaphone, ClipboardCheck, TrendingUp, FileText } from "lucide-react"

const partnerBenefits = [
  {
    icon: Megaphone,
    title: "Workshops & Awareness",
    description: "Bring wheelchair-fitness awareness training to your organization.",
  },
  {
    icon: ClipboardCheck,
    title: "Pilot Programs",
    description: "Run a structured pilot cohort with your community.",
  },
  {
    icon: TrendingUp,
    title: "Community Impact",
    description: "Track and report real outcomes for your stakeholders.",
  },
  {
    icon: FileText,
    title: "Documentation",
    description: "Receive CSR and impact documentation for your records.",
  },
]

export default function PartnerWithUsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <div className="relative bg-black py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A96A]/10 via-black to-black" />
        <div className="container relative mx-auto px-4 text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-[#C9A96A]">
            Institutional Partnerships
          </span>
          <h1 className="mt-4 text-4xl font-bold font-display text-white sm:text-5xl md:text-6xl">
            Partner With <span className="text-[#C9A96A]">STRENTOR</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300 md:text-xl">
            For NGOs, POs, foundations, hospitals, rehabilitation centers, and support groups.
          </p>
        </div>
      </div>

      {/* Benefits grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2">
          {partnerBenefits.map((benefit) => (
            <div
              key={benefit.title}
              className="flex gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#C9A96A]">
                <benefit.icon className="h-5 w-5 text-strentor-black" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-card-foreground">{benefit.title}</h3>
                <p className="mt-1 text-muted-foreground">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing table */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-10 text-center text-3xl font-bold font-display text-foreground sm:text-4xl">
            Workshop &amp; Pilot Program Options (INR)
          </h2>
          <div className="mx-auto max-w-3xl overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-4 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                    Option
                  </th>
                  <th className="px-6 py-4 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                    Price Range
                  </th>
                </tr>
              </thead>
              <tbody>
                {partnerPricingOptions.map((option) => (
                  <tr key={option.id} className="border-b border-border last:border-b-0">
                    <td className="px-6 py-4 font-semibold text-card-foreground">{option.label}</td>
                    <td className="px-6 py-4 text-[#C9A96A] font-semibold">{option.priceRange}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Intake form */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold font-display text-foreground sm:text-4xl">
            Let&apos;s discuss a pilot partnership.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Fill out the form and our team will connect with you.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-2xl">
          <IntakeForm initialPathway="corporate" sourcePage="/partner-with-us" />
        </div>
      </section>

      <Footer />
    </div>
  )
}
