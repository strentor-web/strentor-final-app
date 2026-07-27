import Header from "@/components/landing/Header"
import Footer from "@/components/landing/Footer"
import { SiteTestimonialForm } from "@/components/forms/SiteTestimonialForm"
import { ScrollReveal } from "@/components/motion/ScrollReveal"

export default function ShareYourStoryPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <div className="relative bg-black py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A96A]/10 via-black to-black" />
        <div className="container relative mx-auto px-4 text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-[#C9A96A]">
            Share Your Story
          </span>
          <h1 className="mt-4 text-4xl font-bold font-display text-white sm:text-5xl md:text-6xl">
            Tell your <span className="text-[#C9A96A]">STRENTOR story</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-gray-300 md:text-xl">
            Your story publishes to the Transformation Stories page as soon as you submit it —
            no waiting on review.
          </p>
        </div>
      </div>

      {/* Form */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <ScrollReveal className="mx-auto max-w-xl">
          <SiteTestimonialForm />
        </ScrollReveal>
      </section>

      <Footer />
    </div>
  )
}
