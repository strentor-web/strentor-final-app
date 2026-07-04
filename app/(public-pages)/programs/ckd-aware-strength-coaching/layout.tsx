import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "CKD-Aware Strength Coaching | Strentor",
  description: "Strength and nutrition coaching that works alongside chronic kidney disease (CKD) management — adaptive, personalized programs delivered online by a national-level para powerlifter.",
  alternates: {
    canonical: "/programs/ckd-aware-strength-coaching",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
