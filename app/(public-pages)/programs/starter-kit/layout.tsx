import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "7-Day Wheelchair Strength Starter Kit | Strentor",
  description: "A safe, structured 7-day introduction to adaptive strength training for wheelchair users — exercise plan, video feedback, and daily tracking, from just ₹1,999.",
  alternates: {
    canonical: "/programs/starter-kit",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
