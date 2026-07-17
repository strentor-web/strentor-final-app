import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Adaptive Strength Coaching | Strentor",
  description: "Founder-led adaptive strength coaching for wheelchair users and people managing chronic health conditions — health-respecting progress, fatigue- and pain-aware programming, and real accountability.",
  alternates: {
    canonical: "/coaching",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
