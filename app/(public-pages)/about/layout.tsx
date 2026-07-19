import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About STRENTOR",
  description: "STRENTOR is a founder-led, wheelchair-first holistic strength platform founded by Aditya Mandan, helping wheelchair users build seated strength, confidence, and daily fitness habits through adaptive coaching.",
  alternates: {
    canonical: "/about",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
