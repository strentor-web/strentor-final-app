import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Performance Assessment — Apply for Coaching",
  description: "Take the STRENTOR Performance Assessment — a structured review of your goals, readiness, and fit, so we can recommend the right personalized coaching pathway for you.",
  alternates: {
    canonical: "/apply-for-access",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
