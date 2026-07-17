"use client";
import Link from "next/link";
import { Facebook, Linkedin, Instagram, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background/5 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-10 text-center border-b border-border">
        <p className="text-lg font-semibold text-foreground mb-4">Ready to get stronger?</p>
        <Button asChild className="h-12 px-8 rounded-full bg-strentor-red hover:bg-strentor-red/80 text-primary-foreground">
          <Link href="/contact">Book Fit Assessment</Link>
        </Button>
      </div>
      <div className="container mx-auto px-4 py-12 grid gap-8 sm:grid-cols-3 text-center sm:text-left">
        {/* Company Sections */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Company</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="hover:text-primary">
              <Link href="/about">About</Link>
            </li>
            <li className="hover:text-primary">
              <Link href="/coaching">Coaching</Link>
            </li>
            <li className="hover:text-primary">
              <Link href="/plans-pricing">Plans</Link>
            </li>
            <li className="hover:text-primary">
              <Link href="/corporate">Corporate / CSR</Link>
            </li>
            <li className="hover:text-primary">
              <Link href="/resources">Resources</Link>
            </li>
            <li className="hover:text-primary">
              <Link href="/pay-it-forward">Pay It Forward</Link>
            </li>
          </ul>
        </div>

        {/* Center Section */}
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="font-bold text-foreground">
            Strentor © 2025
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <Link
              href="/privacy-policy"
              className="hover:text-primary"
            >
              Privacy Policy
            </Link>
            <span>•</span>
            <Link
              href="/terms-of-service"
              className="hover:text-primary"
            >
              Terms of Service
            </Link>
            <span>•</span>
            <Link
              href="/medical-disclaimer"
              className="hover:text-primary"
            >
              Medical Disclaimer
            </Link>
          </div>
        </div>

        {/* Stay Connected Section */}
        <div className="space-y-4 justify-self-end">
          <h3 className="text-lg font-semibold text-foreground">Stay Connected</h3>
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
