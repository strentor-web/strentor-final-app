import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Fitness Training Program | Strentor",
  description: "Personalized fitness programs for individuals with chronic conditions and physical challenges — expert para-athlete coaching, customized plans, and proven results.",
  alternates: {
    canonical: "/programs/fitness-training",
  },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Fitness Training",
  name: "Strentor Fitness Training Program",
  description: "Personalized fitness and nutrition coaching for individuals with chronic conditions and physical challenges, led by a national-level para powerlifter.",
  provider: {
    "@type": "Organization",
    name: "Strentor",
    url: "https://www.strentor.com/",
  },
  areaServed: "Online",
  audience: {
    "@type": "Audience",
    audienceType: "Individuals with chronic conditions or physical challenges",
  },
};

export default function FitnessTrainingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      {children}
    </>
  );
}
