import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Transformation Stories",
  description: "Real, named client stories from STRENTOR's wheelchair-first strength and performance coaching — presented honestly, without invented outcomes or numbers.",
  alternates: {
    canonical: "/transformation-stories",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
