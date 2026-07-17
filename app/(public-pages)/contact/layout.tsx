import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact / Fit Assessment | Strentor",
  description: "Start your STRENTOR Fit Assessment or get in touch — personal coaching, corporate partnerships, Pay It Forward sponsorship, and more.",
  alternates: {
    canonical: "/contact",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
