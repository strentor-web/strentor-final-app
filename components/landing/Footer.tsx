"use client";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Linkedin, Instagram, Youtube, Mail, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background/5 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-12 grid gap-8 sm:grid-cols-4 text-center sm:text-left">
        {/* Brand */}
        <div className="space-y-3">
          <Link href="/" className="inline-flex items-center gap-2">
            <Image src="/strentor-icon.png" alt="STRENTOR" width={28} height={28} className="h-7 w-7" />
            <span className="font-bold text-foreground">STRENTOR</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Holistic strength for wheelchair users. Founder-led, wheelchair-first, mission-driven.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Quick Links</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="hover:text-primary">
              <Link href="/programs">12-Week Program</Link>
            </li>
            <li className="hover:text-primary">
              <Link href="/apply-for-access">Apply for Access</Link>
            </li>
            <li className="hover:text-primary">
              <Link href="/sponsor-a-seat">Sponsor a Seat</Link>
            </li>
            <li className="hover:text-primary">
              <Link href="/impact">Impact</Link>
            </li>
            <li className="hover:text-primary">
              <Link href="/partner-with-us">Partner With Us</Link>
            </li>
            <li className="hover:text-primary">
              <Link href="/about">About</Link>
            </li>
            <li className="hover:text-primary">
              <Link href="/community">Community</Link>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Legal</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="hover:text-primary">
              <Link href="/privacy-policy">Privacy Policy</Link>
            </li>
            <li className="hover:text-primary">
              <Link href="/terms-of-service">Terms of Service</Link>
            </li>
            <li className="hover:text-primary">
              <Link href="/medical-disclaimer">Medical Disclaimer</Link>
            </li>
          </ul>
        </div>

        {/* Contact + Stay Connected */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Contact</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center justify-center gap-2 sm:justify-start">
              <Mail className="h-4 w-4 text-[#C9A96A]" />
              <a href="mailto:adityamandan@strentor.com" className="hover:text-primary">adityamandan@strentor.com</a>
            </li>
            <li className="flex items-center justify-center gap-2 sm:justify-start">
              <Globe className="h-4 w-4 text-[#C9A96A]" />
              <span>www.strentor.com</span>
            </li>
          </ul>
          <div className="flex justify-center sm:justify-start gap-4 text-muted-foreground">
            <Link
              className="hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full p-2 -m-2"
              href="https://www.facebook.com/strentor/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow Strentor on Facebook"
            >
              <Facebook className="h-5 w-5" />
            </Link>

            <Link
              className="hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full p-2 -m-2"
              href="https://in.linkedin.com/company/strentor"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow Strentor on LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </Link>

            <Link
              className="hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full p-2 -m-2"
              href="https://www.instagram.com/strentor/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow Strentor on Instagram"
            >
              <Instagram className="h-5 w-5" />
            </Link>

            <Link
              className="hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full p-2 -m-2"
              href="https://www.youtube.com/@STRENTOR"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Subscribe to Strentor on YouTube"
            >
              <Youtube className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-8 text-center text-sm text-muted-foreground">
        © 2025 STRENTOR. All rights reserved.
      </div>

      {/* Additional Styles for Mobile */}
      <style jsx>{`
        @media (max-width: 640px) {
          .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}
