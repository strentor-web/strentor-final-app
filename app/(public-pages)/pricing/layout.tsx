import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Fitness Coaching Pricing | Strentor",
  description:
    "See STRENTOR's full adaptive fitness coaching pricing before you sign up — choose 3, 4, or 5 sessions a week, Trainer-Led or Self-Paced, monthly to annual billing with up to 30% off, or a one-time Lifetime Membership.",
  alternates: {
    canonical: "/pricing",
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
