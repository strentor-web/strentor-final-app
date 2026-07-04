import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Spina Bifida Fitness Coaching | Strentor",
  description: "Fitness coaching adapted for individuals with spina bifida — personalized, adaptive training and nutrition guidance from a national-level para powerlifter, delivered online.",
  alternates: {
    canonical: "/programs/spina-bifida-fitness-coaching",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
