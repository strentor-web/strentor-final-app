import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Wheelchair Fitness Coaching in India | Strentor",
  description: "STRENTOR offers online wheelchair fitness coaching across India — adaptive strength training and nutrition guidance from a national-level para powerlifter.",
  alternates: {
    canonical: "/programs/wheelchair-fitness-coaching-india",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
