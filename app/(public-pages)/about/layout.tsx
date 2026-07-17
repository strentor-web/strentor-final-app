import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About Strentor | Adaptive Strength & Transformation",
  description: "Strentor is an adaptive strength and transformation brand founded by Aditya Mandan, a national-level para powerlifter, built for people who refuse to let physical challenges define their future.",
  alternates: {
    canonical: "/about",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
