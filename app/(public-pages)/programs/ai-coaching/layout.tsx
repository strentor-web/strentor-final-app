import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "STRENTOR AI Coaching | Strentor",
  description: "AI-powered adaptive coaching for wheelchair users, from a limited free-form starter tier to full 1:1 human-led transformation with AI support.",
  alternates: {
    canonical: "/programs/ai-coaching",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
