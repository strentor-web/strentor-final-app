"use client"

import { Suspense } from "react"
import Header from "@/components/landing/Header"
import Footer from "@/components/landing/Footer"
import Pricing from "@/components/landing/Pricing"

// Public, no-account-required pricing page — lets a visitor see the full
// session-based pricing (3/4/5 sessions/week, billing-cycle discounts, and
// the one-time Lifetime Membership) before signing up.
export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <Suspense>
        <Pricing />
      </Suspense>
      <Footer />
    </div>
  )
}
