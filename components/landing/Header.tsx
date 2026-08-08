"use client"

import Image from "next/image";
import { Menu } from "lucide-react";
import { useState } from "react";
import Link from "next/link"

// Order matches the canonical nav sequence from the brand mockup
// (Home, About, Programs, Coaching, Transformation, Resources, Contact),
// with the remaining real pages slotted in after their closest match.
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programs" },
  { href: "/coaching", label: "Coaching" },
  { href: "/the-strentor-method", label: "Method" },
  { href: "/transformation-stories", label: "Stories" },
  { href: "/resources", label: "Resources" },
  { href: "/blog", label: "Blog" },
  { href: "/sponsor-a-seat", label: "Pay It Forward" },
  { href: "/corporate", label: "Corporate" },
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
          <nav className="hidden xl:flex absolute left-1/2 -translate-x-1/2 space-x-2.5 items-center text-xs font-bold">
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

          <div className="flex items-center gap-3">
            <button
              className="xl:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full p-2 -m-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav"
            >
              <Menu size={24} />
            </button>
            <Link
              href="/sign-in"
              className="hidden text-xs font-bold text-foreground hover:text-primary transition-colors xl:inline-flex"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav id="mobile-nav" className="xl:hidden py-4 space-y-4 border-t border-border flex flex-col items-center font-bold bg-background">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-foreground hover:text-primary py-2 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/sign-in" className="block text-foreground hover:text-primary py-2 transition-colors">
              Sign In
            </Link>
          </nav>
        )}
      </header>
    </>
  );
}
