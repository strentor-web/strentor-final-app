import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Community",
  description: "Join the STRENTOR community — WhatsApp, Telegram, live sessions, and resources for support, accountability, and growth on your fitness journey.",
  alternates: {
    canonical: "/community",
  },
};

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return children;
}
