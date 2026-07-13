import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "STRENTOR Strength Circle Membership | Strentor",
  description: "Ongoing community, coaching and accountability for wheelchair users — monthly group coaching, an adaptive workout library, and a form-check clinic.",
  alternates: {
    canonical: "/programs/membership",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
