import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Share Your Story",
  description: "Share your STRENTOR coaching story — it's published on the Transformation Stories page as soon as you submit it.",
  alternates: {
    canonical: "/transformation-stories/share",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
