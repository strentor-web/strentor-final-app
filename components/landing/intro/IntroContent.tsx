import { IntroCard } from '@/components/landing/intro/IntroCard';

type Feature = {
  icon: 'holistic' | 'inclusivity' | 'empowerment' | 'community';
  title: string;
  description: string;
};

export function IntroContent() {
  const features: Feature[] = [
    {
      icon: "holistic",
      title: "Built Around You, Not Retrofitted",
      description: "Every program starts with your equipment, your mobility, and your goals — not a standing-body plan with a few exercises swapped out."
    },
    {
      icon: "inclusivity",
      title: "Adaptive From Day One",
      description: "Seated strength training, nutrition, and mindset coaching designed for wheelchair users with spina bifida, CKD, or long-term physical challenges."
    },
    {
      icon: "empowerment",
      title: "Coached by a Para-Athlete",
      description: "Programming shaped by a national-level para powerlifter's own training experience — not a generic certification applied to your situation."
    },
    {
      icon: "community",
      title: "Never Training Alone",
      description: "Regular check-ins, progress tracking, and a community of people on the same journey, wherever you're training from."
    }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {features.map((feature, index) => (
        <IntroCard
          key={index}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </div>
  );
}

export default IntroContent;