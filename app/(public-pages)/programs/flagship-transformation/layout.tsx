import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "8-Week Adaptive Strength & Mindset Transformation | Strentor",
  description: "STRENTOR's flagship 8-week program for wheelchair users — adaptive strength training, nutrition guidance, and mindset coaching, structured across four phases to build real independence.",
  alternates: {
    canonical: "/programs/flagship-transformation",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
