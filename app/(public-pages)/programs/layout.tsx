import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Programs",
  description: "STRENTOR runs several coaching programs for wheelchair users — from Elite Mentorship and Flagship Transformation to focused strength coaching, group coaching, and corporate partnerships. The right program is recommended after your Performance Assessment.",
  alternates: {
    canonical: "/programs",
  },
};

export default function ProgramsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
