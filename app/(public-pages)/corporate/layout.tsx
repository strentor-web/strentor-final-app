import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Corporate & CSR Partnerships | Strentor",
  description: "Adaptive strength programs for inclusive workplaces and communities — structured, dignity-first CSR and corporate wellness partnerships with measurable human impact.",
  alternates: {
    canonical: "/corporate",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
