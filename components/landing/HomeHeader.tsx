"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programs" },
  { href: "/coaching", label: "Coaching" },
  { href: "/transformation-stories", label: "Transformation" },
  { href: "/resources", label: "Resources" },
  { href: "/sponsor-a-seat", label: "Pay It Forward" },
  { href: "/contact", label: "Contact" },
];

export function HomeHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/95 backdrop-blur">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/strentor-icon.png" alt="STRENTOR" width={36} height={36} className="h-9 w-9" />
          <span className="leading-tight">
            <span className="block text-lg font-extrabold tracking-wide text-white">STRENTOR</span>
            <span className="block text-[9px] font-semibold tracking-[0.2em] text-[#C9A96A]">
              BREAK. BUILD. BECOME.
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-xs font-bold tracking-widest text-gray-300 lg:flex">
          {navLinks.map((link) => {
            const isActive = link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "group relative py-1 uppercase transition-colors hover:text-white",
                  isActive && "text-white"
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 bg-[#C9A96A] transition-transform duration-300 ease-out group-hover:scale-x-100",
                    isActive && "scale-x-100"
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="hidden text-xs font-bold uppercase tracking-widest text-gray-300 transition-colors hover:text-white lg:inline-flex"
          >
            Sign In
          </Link>
          <button
            className="rounded-full p-2 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96A] lg:hidden"
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav
          id="mobile-nav"
          className="flex flex-col items-center gap-4 border-t border-white/10 bg-black py-6 text-sm font-bold uppercase tracking-widest text-gray-300 lg:hidden"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/sign-in" onClick={() => setIsMenuOpen(false)} className="transition-colors hover:text-white">
            Sign In
          </Link>
        </nav>
      )}
    </header>
  );
}
