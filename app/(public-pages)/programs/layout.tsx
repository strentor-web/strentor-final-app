import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "The 12-Week Program",
  description: "The 12-Week STRENTOR Holistic Strength Program builds seated strength, nutrition habits, mindset and resilience — with access-based pricing so sponsors and donors can help subsidize participants' seats.",
  alternates: {
    canonical: "/programs",
  },
};

export default function ProgramsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
