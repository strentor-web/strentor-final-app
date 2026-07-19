import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Sponsor a Seat",
  description: "Sponsor a STRENTOR seat and fund holistic coaching access for a wheelchair user. Choose a sponsorship option, track your impact, and receive CSR documentation where applicable.",
  alternates: {
    canonical: "/sponsor-a-seat",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
