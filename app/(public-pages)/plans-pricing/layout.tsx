import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Plans & Pricing | Strentor",
  description: "STRENTOR adaptive coaching plans and pricing for India, Singapore, UAE, and global clients — from a 7-day starter kit to elite mentorship and ongoing membership.",
  alternates: {
    canonical: "/plans-pricing",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
