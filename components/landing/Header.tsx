"use client"

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Menu } from "lucide-react";
import { useState } from "react";
import { ContactForm } from "@/components/forms/ContactForm";
import { EmailCaptureModal } from "@/components/forms/EmailCaptureModal";
import { CalendlyEmbedModal } from "@/components/forms/CalendlyEmbedModal";
import Link from "next/link"
import { useRouter } from "next/navigation";
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [showCalendlyEmbed, setShowCalendlyEmbed] = useState(false);
  const [capturedEmail, setCapturedEmail] = useState("");
  const router = useRouter();
  const handleBookingClick = () => {
    //setShowEmailCapture(true);
    router.push("/sign-up");
  };

  const handleEmailCaptured = (email: string) => {
    setCapturedEmail(email);
    setShowEmailCapture(false);
    setShowCalendlyEmbed(true);
  };

  return (
    <>
      <header className="container mx-auto px-4 border-b border-border shadow-sm bg-background">
        <div className="relative flex items-center justify-between py-3 md:py-3">
          <div>
            <Link href="/" className="flex items-center transition-transform duration-200 ease-out hover:scale-110">
              <Image
                src="/strentor-icon.png"
                alt="Strentor Logo"
                width={32}
                height={32}
                className="h-8 w-8"
              />
            </Link>
          </div>

          {/* Desktop Navigation — centered in header */}
          <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 space-x-5 items-center font-semibold">
            <a href="/" className="group relative text-foreground hover:text-primary transition-colors py-1">
              Home
              <span className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </a>
            <a href="/aboutus" className="group relative text-foreground hover:text-primary transition-colors py-1">
              About Us
              <span className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </a>
            <div className="relative group">
              <button className="relative text-foreground hover:text-primary focus:outline-none flex items-center gap-1 transition-colors py-1">
                Programs
                <span className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </button>
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 origin-top scale-95 bg-card border border-border rounded-lg shadow-lg opacity-0 translate-y-1 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 group-hover:visible invisible transition-all duration-200 ease-out z-50">
                <a href="/programs/fitness-training" className="block px-6 py-3 text-card-foreground hover:bg-muted hover:text-primary transition-colors rounded-b-lg">Fitness Training</a>
              </div>
            </div>
            <a href="/community" className="group relative text-foreground hover:text-primary transition-colors py-1">
              Community
              <span className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </a>
            {/* Hidden for now
            <a href="https://empowerment-hub.strentor.com/" className="group relative text-foreground hover:text-primary transition-colors py-1">
              Empowerment Hub
              <span className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </a>
            */}
          </nav>

          <div className="flex items-center">
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu size={24} />
            </button>
            <Button
              className="hidden md:inline-flex shadow-2xl h-10 rounded-full bg-strentor-red hover:bg-strentor-red/80 text-primary-foreground"
              onClick={handleBookingClick}
            >
              <span className="whitespace-pre-wrap text-center text-sm font-bold leading-none tracking-tight lg:text-lg">
                Sign Up
              </span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-border flex flex-col items-center font-semibold bg-background">
            <a href="/" className="block text-foreground hover:text-primary py-2 transition-colors">Home</a>
            <a href="/aboutus" className="block text-foreground hover:text-primary py-2 transition-colors">About Us</a>
            <a href="/programs" className="block text-foreground hover:text-primary py-2 transition-colors">Programs</a>
            <a href="/community" className="block text-foreground hover:text-primary py-2 transition-colors">Community</a>
            {/* Hidden for now
            <a href="https://empowerment-hub.strentor.com/"  className="block text-foreground hover:text-primary py-2 transition-colors">Empowerment Hub</a>
            */}
            <Button
              className="shadow-2xl h-10 rounded-full bg-strentor-red hover:bg-strentor-red/80 text-primary-foreground"
              onClick={handleBookingClick}
            >
              <span className="whitespace-pre-wrap text-center text-sm font-bold leading-none tracking-tight lg:text-lg">
               Sign Up
              </span>
            </Button>
          </div>
        )}
      </header>

      {/* Contact Form Dialog */}
      <ContactForm open={showForm} onOpenChange={setShowForm} />
      
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
  );
}
