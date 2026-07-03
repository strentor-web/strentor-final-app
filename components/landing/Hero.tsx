"use client"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import { motion } from "motion/react"
import { ContactForm } from "@/components/forms/ContactForm"
import { WaitlistForm } from "../forms/WaitlistForm"
import { EmailCaptureModal } from "@/components/forms/EmailCaptureModal"
import { CalendlyEmbedModal } from "@/components/forms/CalendlyEmbedModal"

export default function Hero() {
  const [showForm, setShowForm] = useState(false)
  const [showWaitlist, setShowWaitlist] = useState(false)
  const [showEmailCapture, setShowEmailCapture] = useState(false)
  const [showCalendlyEmbed, setShowCalendlyEmbed] = useState(false)
  const [capturedEmail, setCapturedEmail] = useState("")

  const guarantees = [
    "90 day satisfaction guarantee",
    "Instant Access to Our Personalised Services",
    "Instant Access to Our Community"
  ]

  const handleBookingClick = () => {
    setShowEmailCapture(true);
  };

  const handleEmailCaptured = (email: string) => {
    setCapturedEmail(email);
    setShowEmailCapture(false);
    setShowCalendlyEmbed(true);
  };

  // const handleJoinNowClick = () => {
  //   setShowForm(true)
  // }

  // const handleWaitlistClick = () => {
  //   setShowWaitlist(true)
  // }



  return (
    <>
      <div className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A96A]/5 via-[#2FA366]/5 to-[#C9C0B4]/5" />
        
        <div className="container mx-auto p-4">
          <div className="relative flex flex-col md:grid md:grid-cols-2 gap-8 p-6 md:p-12 bg-background/90 backdrop-blur-sm rounded-2xl shadow-xl">
            {/* Headline Section */}
            <motion.div
              className="flex flex-col justify-center space-y-6"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h1 className="text-4xl md:text-6xl font-bold font-display text-foreground">
                 Wellness Programs
                <br />
                Made For <span className="text-[#C9A96A]">YOU</span>
              </h1>
              <p className="text-xl md:text-2xl font-medium text-muted-foreground">
                Personalized pathways to your best self, crafted by experts who understand your unique journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleBookingClick}
                  className="h-14 px-8 text-lg rounded-full font-bold bg-[#C9A96A] hover:bg-[#C9A96A]/90 transition-all transform hover:scale-105"
                >
                  Book Your Discovery Call
                </Button>

              </div>
            </motion.div>

            {/* Founder Card */}
            <div className="flex justify-center items-center [perspective:1200px]">
              <motion.div
                className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl [transform-style:preserve-3d]"
                initial={{ opacity: 0, scale: 0.92, rotateY: -8 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
                whileHover={{ rotateY: -6, rotateX: 3, scale: 1.02 }}
              >
                <Image
                  src="/Aditya.jpg"
                  alt="Aditya Mandan — Founder & Empowerment Coach, National-level Para Powerlifter"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <motion.div
                  className="absolute bottom-4 left-4 right-4 rounded-lg bg-background/90 backdrop-blur-sm px-4 py-3 shadow-lg"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
                >
                  <p className="font-bold text-foreground">Aditya Mandan</p>
                  <p className="text-sm text-muted-foreground">Founder &amp; National-level Para Powerlifter</p>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Guarantee Badges */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 mt-8">
            {guarantees.map((guarantee, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-background/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg transform hover:scale-105 transition-all w-full sm:w-auto"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#2FA366] flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <span className="text-base font-bold text-foreground">{guarantee}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      <ContactForm open={showForm} onOpenChange={setShowForm} />
      <WaitlistForm open={showWaitlist} onOpenChange={setShowWaitlist}/>
      
      {/* Email Capture Modal */}
      <EmailCaptureModal 
        open={showEmailCapture} 
        onOpenChange={setShowEmailCapture}
        onEmailCaptured={handleEmailCaptured}
      />
      
      {/* Calendly Embed Modal */}
      <CalendlyEmbedModal 
        open={showCalendlyEmbed}
        onOpenChange={setShowCalendlyEmbed}
        userEmail={capturedEmail}
      />
    </>
  )
}
