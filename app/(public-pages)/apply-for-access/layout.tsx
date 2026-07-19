import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Apply for Access",
  description: "Apply for a STRENTOR Access Seat — the application for our 12-week wheelchair-user-focused adaptive strength coaching program. Submit your details for review and an access-tier decision.",
  alternates: {
    canonical: "/apply-for-access",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
