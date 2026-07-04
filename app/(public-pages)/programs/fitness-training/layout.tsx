import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Adaptive Transformation Coaching Program | Strentor",
  description: "STRENTOR's adaptive transformation coaching program — personalized strength, nutrition, and mindset coaching for wheelchair users with spina bifida, CKD, chronic health realities, or long-term physical challenges. Expert para-athlete coaching, customized plans, proven results.",
  alternates: {
    canonical: "/programs/fitness-training",
  },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Adaptive Fitness Transformation Coaching",
  name: "Strentor Transformation Program",
  description: "Adaptive strength, nutrition, and mindset coaching for wheelchair users with spina bifida, CKD, chronic health realities, or long-term physical challenges, led by a national-level para powerlifter.",
  provider: {
    "@type": "Organization",
    name: "Strentor",
    url: "https://www.strentor.com/",
  },
  areaServed: "Online",
  audience: {
    "@type": "Audience",
    audienceType: "Wheelchair users and individuals with chronic health conditions or long-term physical challenges",
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
