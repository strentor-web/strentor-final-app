import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Our Programs",
  description: "Meet the certified experts behind Strentor's fitness programs, led by a national-level para powerlifter dedicated to inclusive coaching.",
  alternates: {
    canonical: "/programs",
  },
};

export default function ProgramsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
