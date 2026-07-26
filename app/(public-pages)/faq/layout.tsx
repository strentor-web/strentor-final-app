import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to real questions about STRENTOR coaching — what it is, who it's for, how health considerations are handled, and what to expect from the application process.",
  alternates: {
    canonical: "/faq",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
