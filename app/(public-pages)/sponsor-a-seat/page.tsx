"use client"

import Header from "@/components/landing/Header"
import Footer from "@/components/landing/Footer"
import { IntakeForm } from "@/components/forms/intake/IntakeForm"
import { sponsorshipOptions } from "@/config/sponsorshipOptions"
import { HeartHandshake, ChartLine, ShieldCheck, FileCheck2 } from "lucide-react"

const impactPoints = [
  {
    icon: HeartHandshake,
    title: "Dignity-First Access",
    description: "Help wheelchair users access world-class coaching with dignity.",
  },
  {
    icon: ChartLine,
    title: "Measurable Impact",
    description: "You receive documented impact reports and outcomes.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent Use",
    description: "Every contribution is tracked and used for program delivery.",
  },
  {
    icon: FileCheck2,
    title: "CSR & Documentation",
    description: "We provide CSR duration and impact documentation where legally applicable.",
  },
]

export default function SponsorASeatPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <div className="relative bg-black py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A96A]/10 via-black to-black" />
        <div className="container relative mx-auto px-4 text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-[#C9A96A]">
            Sponsorship
          </span>
          <h1 className="mt-4 text-4xl font-bold font-display text-white sm:text-5xl md:text-6xl">
            Sponsor Strength. Sponsor a <span className="text-[#C9A96A]">STRENTOR Seat.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300 md:text-xl">
            Your support can fund holistic coaching for a wheelchair user and change a life.
          </p>
        </div>
      </div>

      {/* Two-column: impact + pricing table */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-start">
          {/* Left: impact points */}
          <div className="space-y-6">
            {impactPoints.map((point) => (
              <div
                key={point.title}
                className="flex gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#C9A96A]">
                  <point.icon className="h-5 w-5 text-strentor-black" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-card-foreground">{point.title}</h3>
                  <p className="mt-1 text-muted-foreground">{point.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right: sponsorship options table */}
          <div>
            <h2 className="text-2xl font-bold font-display text-foreground sm:text-3xl">
              Sponsorship Options
            </h2>
            <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card">
              <table className="w-full min-w-[420px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border border-border bg-muted/30">
                    <th className="px-4 py-3 font-bold text-foreground sm:px-6">Option</th>
                    <th className="px-4 py-3 font-bold text-foreground sm:px-6">
                      Contribution (INR)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sponsorshipOptions.map((option) => (
                    <tr key={option.id} className="border border-border">
                      <td className="px-4 py-3 font-medium text-card-foreground sm:px-6">
                        {option.label}
                      </td>
                      <td className="px-4 py-3 text-[#C9A96A] font-semibold sm:px-6">
                        {option.contribution}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Form band */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold font-display text-foreground sm:text-4xl">
              Ready to sponsor a seat?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Fill out the form and our team will connect with you.
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-3xl">
            <IntakeForm initialPathway="sponsor" sourcePage="/sponsor-a-seat" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
