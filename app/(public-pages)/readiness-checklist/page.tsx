"use client"

import { useState } from "react"
import Link from "next/link"
import Header from "@/components/landing/Header"
import Footer from "@/components/landing/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollReveal } from "@/components/motion/ScrollReveal"
import { ErrorSummary, LoadingState, SuccessMessage } from "@/components/forms/intake/IntakeFormFeedback"
import { CheckCircle2 } from "lucide-react"

const quickQuestions = [
  {
    key: "mobility",
    label: "How would you describe your daily movement?",
    options: [
      { value: "mostly_seated", label: "Mostly seated" },
      { value: "mixed", label: "Mixed sitting/standing" },
      { value: "mostly_standing", label: "Mostly standing/walking" },
    ],
  },
  {
    key: "goal",
    label: "What's your main goal right now?",
    options: [
      { value: "strength", label: "Build strength" },
      { value: "confidence", label: "Build confidence & routine" },
      { value: "unsure", label: "Not sure yet" },
    ],
  },
  {
    key: "concern",
    label: "Do you have a pain or safety concern you'd want a coach to know about first?",
    options: [
      { value: "no", label: "No" },
      { value: "yes", label: "Yes" },
      { value: "unsure", label: "Unsure" },
    ],
  },
]

export default function ReadinessChecklistPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("")
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [website, setWebsite] = useState("") // honeypot
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle")
  const [error, setError] = useState<string | null>(null)

  const allAnswered = quickQuestions.every((q) => answers[q.key])
  const canSubmit =
    fullName.trim() && email.trim() && phone.trim() && city.trim() && country.trim() && allAnswered

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit || status === "submitting") return

    if (website.trim().length > 0) {
      // Silently drop bot submissions without revealing the honeypot to the user.
      setStatus("success")
      return
    }

    setStatus("submitting")
    setError(null)

    const summaryLines = quickQuestions.map((q) => {
      const chosen = q.options.find((o) => o.value === answers[q.key])
      return `${q.label} ${chosen?.label ?? ""}`
    })

    try {
      const response = await fetch("/api/intake/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pathway: "general",
          contact: { fullName, email, phone, city, country },
          general: { message: `Free Readiness Checklist responses:\n${summaryLines.join("\n")}` },
          sourcePage: "/readiness-checklist",
          consent: true,
          submittedAt: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        setError("Something went wrong. Please try again in a moment.")
        setStatus("idle")
        return
      }

      setStatus("success")
    } catch {
      setError("Network error. Please check your connection and try again.")
      setStatus("idle")
    }
  }

  const showCaution = answers.concern === "yes" || answers.concern === "unsure"

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="relative bg-black py-16 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A96A]/10 via-black to-black" />
        <ScrollReveal direction="none" className="container relative mx-auto px-4 text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-[#C9A96A]">
            Free Readiness Checklist
          </span>
          <h1 className="mt-4 text-4xl font-bold font-display text-white sm:text-5xl">
            Where Are You Starting From?
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-300">
            Less than two minutes. No pressure — just a starting point.
          </p>
        </ScrollReveal>
      </div>

      <section className="container mx-auto px-4 py-16 md:py-20">
        <ScrollReveal className="mx-auto max-w-xl">
          {status === "success" ? (
            <div className="space-y-6">
              <SuccessMessage
                title="Thanks — here's your starting point"
                description="We've saved your answers. Continue to the safety disclaimer and readiness assessment for a full pathway recommendation."
              />
              {showCaution && (
                <div className="flex items-start gap-3 rounded-lg border border-[#C9A96A]/30 bg-[#C9A96A]/5 p-4 text-sm text-card-foreground">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#C9A96A]" />
                  <p>
                    Since you flagged a possible concern, we recommend the full Readiness
                    Assessment next — it screens for safety before recommending a pathway.
                  </p>
                </div>
              )}
              <Button asChild className="h-12 w-full rounded-full bg-[#C9A96A] hover:bg-[#C9A96A]/90">
                <Link href="/safety-disclaimer?next=/assessment">Continue to Safety Disclaimer</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-8 shadow-sm">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full name</Label>
                  <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone / WhatsApp</Label>
                    <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} required />
                  </div>
                </div>

                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                {quickQuestions.map((q) => (
                  <div key={q.key}>
                    <Label>{q.label}</Label>
                    <RadioGroup
                      className="mt-3 flex flex-wrap gap-3"
                      value={answers[q.key]}
                      onValueChange={(value) => setAnswers((prev) => ({ ...prev, [q.key]: value }))}
                    >
                      {q.options.map((option) => (
                        <label
                          key={option.value}
                          className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm cursor-pointer hover:border-[#C9A96A]"
                        >
                          <RadioGroupItem value={option.value} />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </RadioGroup>
                  </div>
                ))}
              </div>

              {error && <ErrorSummary message={error} />}

              <Button
                type="submit"
                disabled={!canSubmit || status === "submitting"}
                className="mt-6 h-12 w-full rounded-full bg-[#C9A96A] hover:bg-[#C9A96A]/90 disabled:opacity-50"
              >
                {status === "submitting" ? <LoadingState label="Submitting..." /> : "Get My Starting Point"}
              </Button>
            </form>
          )}
        </ScrollReveal>
      </section>

      <Footer />
    </div>
  )
}
