"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { CalendlyEmbedModal } from "@/components/forms/CalendlyEmbedModal"
import { createClient } from "@/utils/supabase/client"

interface DiscoveryCallButtonProps {
  className?: string
  variant?: "default" | "outline"
  children: React.ReactNode
}

export function DiscoveryCallButton({ className, variant = "outline", children }: DiscoveryCallButtonProps) {
  const [open, setOpen] = useState(false)
  const [userEmail, setUserEmail] = useState("")

  async function handleOpen() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    setUserEmail(user?.email || "")
    setOpen(true)
  }

  async function handleScheduled(eventUri: string) {
    try {
      const response = await fetch("/api/coaching-calls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callType: "discovery", eventUri }),
      })
      if (response.ok) {
        toast.success("Discovery call booked. See you soon!")
      }
    } catch {
      // Booking already succeeded in Calendly; logging failure is non-fatal.
    }
  }

  return (
    <>
      <Button type="button" onClick={handleOpen} variant={variant} className={className}>
        {children}
      </Button>
      <CalendlyEmbedModal open={open} onOpenChange={setOpen} userEmail={userEmail} onScheduled={handleScheduled} />
    </>
  )
}
