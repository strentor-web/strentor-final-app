import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Community",
  description: "Join Strentor's WhatsApp community for updates, motivation, and support on your fitness journey.",
  alternates: {
    canonical: "/community",
  },
};

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return children;
}
