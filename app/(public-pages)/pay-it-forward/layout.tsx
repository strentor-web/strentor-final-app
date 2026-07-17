import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Pay It Forward — Sponsor Coaching Access | Strentor",
  description: "Each One, Pay One. Pay It Forward. Sponsor part or full coaching access for someone who wants Strentor coaching but faces a financial barrier — or apply for sponsorship support.",
  alternates: {
    canonical: "/pay-it-forward",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
