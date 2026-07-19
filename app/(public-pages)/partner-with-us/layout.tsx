import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Partner With Us | Strentor",
  description: "Partner with Strentor to bring adaptive, wheelchair-user fitness coaching to your NGO, PO, foundation, hospital, rehabilitation center, or support group through workshops and structured pilot programs.",
  alternates: {
    canonical: "/partner-with-us",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
