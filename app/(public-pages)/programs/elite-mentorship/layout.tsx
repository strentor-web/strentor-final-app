import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "12-Week Elite Adaptive Transformation Mentorship | Strentor",
  description: "STRENTOR's premium high-touch mentorship for wheelchair users who want intensive, deeply personalized transformation with direct founder access.",
  alternates: {
    canonical: "/programs/elite-mentorship",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
