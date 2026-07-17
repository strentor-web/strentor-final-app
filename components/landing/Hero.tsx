"use client"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { motion } from "motion/react"
import Link from "next/link"

export default function Hero() {
  const guarantees = [
    "Adaptive, health-respecting programming",
    "Coached by a national-level para powerlifter",
    "Real bodies, real limits, real goals"
  ]

  return (
    <div className="relative min-h-[90vh] flex items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-[#C9A96A]/5 via-[#B8935A]/5 to-[#C9C0B4]/5" />

      <div className="container mx-auto p-4">
        <motion.div
          className="relative flex flex-col items-center gap-6 p-6 md:p-12 bg-background/90 backdrop-blur-sm rounded-2xl shadow-xl text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-6xl font-bold font-display text-foreground">
            You Don&apos;t Need to Stand
            <br />
            to Get <span className="text-[#C9A96A]">Stronger</span>
          </h1>
          <p className="text-xl md:text-2xl font-medium text-muted-foreground">
            Premium adaptive strength, nutrition, and mindset coaching for people with real physical challenges — coached virtually by a national-level para powerlifter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="h-14 px-8 rounded-full bg-[#C9A96A] hover:bg-[#C9A96A]/90 transition-all transform hover:scale-105">
              <Link href="/contact">Book Fit Assessment</Link>
            </Button>
          </div>
        </motion.div>

        {/* Guarantee Badges */}
        <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 mt-8">
          {guarantees.map((guarantee, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-background/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg transform hover:scale-105 transition-all w-full sm:w-auto"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#C9A96A] flex items-center justify-center">
                <Check className="w-5 h-5 text-strentor-black" />
              </div>
              <span className="text-base font-bold text-foreground">{guarantee}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
