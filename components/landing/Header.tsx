"use client"

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Menu } from "lucide-react";
import { useState } from "react";
import Link from "next/link"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/start-here", label: "Start Here" },
  { href: "/apply-for-access", label: "Apply for Access" },
  { href: "/sponsor-a-seat", label: "Sponsor a Seat" },
  { href: "/programs", label: "Programs" },
  { href: "/impact", label: "Impact" },
  { href: "/partner-with-us", label: "Partner With Us" },
  { href: "/about", label: "About" },
  { href: "/community", label: "Community" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 space-x-5 items-center font-semibold">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative text-foreground hover:text-primary transition-colors py-1 whitespace-nowrap"
              >
                {link.label}
                <span className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center">
            <button
              className="lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full p-2 -m-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav"
            >
              <Menu size={24} />
            </button>
            <Button
              asChild
              className="hidden lg:inline-flex shadow-2xl h-10 rounded-full bg-strentor-red hover:bg-strentor-red/80 text-primary-foreground"
            >
              <Link href="/apply-for-access">Apply Now</Link>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav id="mobile-nav" className="lg:hidden py-4 space-y-4 border-t border-border flex flex-col items-center font-semibold bg-background">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-foreground hover:text-primary py-2 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Button asChild className="shadow-2xl h-10 rounded-full bg-strentor-red hover:bg-strentor-red/80 text-primary-foreground">
              <Link href="/apply-for-access">Apply Now</Link>
            </Button>
          </nav>
        )}
      </header>
    </>
  );
}
