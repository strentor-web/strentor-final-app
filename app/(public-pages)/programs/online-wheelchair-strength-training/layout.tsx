import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Online Strength Training for Wheelchair Users | Strentor",
  description: "Seated and adaptive strength training for wheelchair users, coached entirely online by a national-level para powerlifter. Personalized programs, delivered virtually.",
  alternates: {
    canonical: "/programs/online-wheelchair-strength-training",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
