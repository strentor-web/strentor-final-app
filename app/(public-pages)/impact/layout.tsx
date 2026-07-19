import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Our Impact | Strentor",
  description: "See how Strentor measures impact for wheelchair-user coaching — strength, endurance, nutrition, confidence, discipline, and program completion, tracked as our early-stage program grows.",
  alternates: {
    canonical: "/impact",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
