import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "The STRENTOR Method — Break. Build. Become.",
  description: "The STRENTOR Method: a three-stage coaching framework — Break, Build, Become — that connects adaptive strength, mindset, and purpose coaching for ambitious wheelchair users.",
  alternates: {
    canonical: "/the-strentor-method",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
