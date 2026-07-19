import Link from "next/link"
import type { Metadata } from "next"
import Header from "@/components/landing/Header"
import Footer from "@/components/landing/Footer"
import { Button } from "@/components/ui/button"
import { AssessmentForm } from "@/components/forms/assessment/AssessmentForm"
import { createClient } from "@/utils/supabase/server"

export const metadata: Metadata = {
  title: "Readiness Assessment",
  description: "Answer a few questions so STRENTOR can recommend the right pathway for you.",
  robots: { index: false, follow: true },
}

export default async function AssessmentPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="relative bg-black py-16 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A96A]/10 via-black to-black" />
        <div className="container relative mx-auto px-4 text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-[#C9A96A]">
            Readiness Assessment
          </span>
          <h1 className="mt-4 text-4xl font-bold font-display text-white sm:text-5xl">
            Find Your Pathway
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-300">
            A few honest answers help us recommend a safe, appropriate starting point — not a
            medical clearance.
          </p>
        </div>
      </div>

      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-8 shadow-sm">
          {user ? (
            <AssessmentForm />
          ) : (
            <div className="text-center">
              <h2 className="text-xl font-bold text-card-foreground">
                Create a free account to take the assessment
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Your results are saved to your account so a coach can review them if needed.
              </p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <Button asChild className="h-12 rounded-full bg-[#C9A96A] px-8 hover:bg-[#C9A96A]/90">
                  <Link href="/sign-up">Create Free Account</Link>
                </Button>
                <Button asChild variant="outline" className="h-12 rounded-full border-[#C9A96A] px-8 text-[#C9A96A] hover:bg-[#C9A96A]/10">
                  <Link href="/sign-in">Sign In</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
