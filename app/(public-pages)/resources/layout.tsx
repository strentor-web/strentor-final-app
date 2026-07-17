import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Resources | Strentor",
  description: "Checklists, assessments, and guides for anyone considering adaptive strength coaching with Strentor — readiness tools, training guides, and the 7-Day Starter Kit.",
  alternates: {
    canonical: "/resources",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
