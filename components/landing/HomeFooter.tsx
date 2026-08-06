"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Facebook, Instagram, Linkedin, Youtube, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const programLinks = [
  { href: "/coaching", label: "1:1 Coaching" },
  { href: "/programs/online-wheelchair-strength-training", label: "Adaptive Strength" },
  { href: "/the-strentor-method", label: "Mindset & Resilience" },
  { href: "/coaching", label: "Nutrition Guidance" },
  { href: "/coaching", label: "Tracking & Feedback" },
];

const resourceLinks = [
  { href: "/blog", label: "Blogs" },
  { href: "/resources", label: "Guides" },
  { href: "/resources", label: "Tools" },
  { href: "/faq", label: "FAQ" },
];

const companyLinks = [
  { href: "/about", label: "About Us" },
  { href: "/the-strentor-method", label: "Our Mission" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-service", label: "Terms & Conditions" },
];

const socialLinks = [
  { href: "https://www.instagram.com/strentor/", label: "Instagram", icon: Instagram },
  { href: "https://www.youtube.com/@STRENTOR", label: "YouTube", icon: Youtube },
  { href: "https://www.facebook.com/strentor/", label: "Facebook", icon: Facebook },
  { href: "https://in.linkedin.com/company/strentor", label: "LinkedIn", icon: Linkedin },
];

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#C9A96A]">{title}</h3>
      <ul className="mt-4 space-y-2.5 text-sm text-gray-400">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="transition-colors hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
  }

  if (subscribed) {
    return (
      <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#C9A96A]">
        <Check className="h-4 w-4" /> You&apos;re on the list.
      </p>
    );
  }

  return (
    // Stacked at every width, not just below `sm` — the footer grid goes to
    // 5 columns at `lg` (see HomeFooter below), which narrows this column
    // to ~200px. A side-by-side input+button doesn't fit there and the
    // button spills past the container edge; stacking is safe regardless
    // of how narrow the column gets.
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        aria-label="Email address"
        className="h-10 w-full rounded-md border border-white/15 bg-black px-3 text-sm text-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96A]"
      />
      <Button type="submit" className="h-10 w-full rounded-md bg-[#C9A96A] px-5 text-xs font-bold uppercase tracking-widest text-black hover:bg-[#C9A96A]/90">
        Subscribe
      </Button>
    </form>
  );
}

export function HomeFooter() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="container mx-auto grid gap-10 px-4 py-14 text-center sm:grid-cols-2 sm:text-left lg:grid-cols-5">
        <div className="sm:col-span-2 lg:col-span-1">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <Image src="/strentor-icon.png" alt="STRENTOR" width={32} height={32} className="h-8 w-8" />
            <span className="leading-tight">
              <span className="block text-base font-extrabold tracking-wide text-white">STRENTOR</span>
              <span className="block text-[9px] font-semibold tracking-[0.2em] text-[#C9A96A]">
                BREAK. BUILD. BECOME.
              </span>
            </span>
          </Link>
          <p className="mt-4 text-sm text-gray-400">
            Premium coaching for wheelchair users and anyone ready to transform with strength, mindset and purpose.
          </p>
          <div className="mt-5 flex justify-center gap-4 text-gray-400 sm:justify-start">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Follow STRENTOR on ${social.label}`}
                className="rounded-full p-2 -m-2 transition-colors hover:text-[#C9A96A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96A]"
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        <FooterColumn title="Programs" links={programLinks} />
        <FooterColumn title="Resources" links={resourceLinks} />
        <FooterColumn title="Company" links={companyLinks} />

        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#C9A96A]">Stay Connected</h3>
          <p className="mt-4 text-sm text-gray-400">Get tips, updates and inspiration straight to your inbox.</p>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} STRENTOR. All rights reserved.
      </div>
    </footer>
  );
}
