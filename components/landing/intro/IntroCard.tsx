import React from 'react';
import Image from 'next/image';

interface IntroCardProps {
  icon: 'holistic' | 'inclusivity' | 'empowerment' | 'community';
  title: string;
  description: string;
}

const iconPaths: Record<IntroCardProps['icon'], string> = {
  holistic: '/icons/holistic.png',
  inclusivity: '/icons/inclusitivity.png',
  empowerment: '/icons/confidence.png',
  community: '/icons/community.png',
};

const colorMap: Record<IntroCardProps['icon'], string> = {
  holistic: '#D4AF37',    // Strentor Gold
  inclusivity: '#2FA366', // Strentor Green
  empowerment: '#C9972B', // Strentor Antique Gold
  community: '#B7BAC0',   // Strentor Silver
};

export function IntroCard({ icon, title, description }: IntroCardProps) {
  const iconPath = iconPaths[icon];
  const iconColor = colorMap[icon];

  return (
    <div className="flex items-start gap-4 rounded-lg border border-border bg-card p-6 shadow-sm transition-all hover:shadow-lg">
      <div
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border"
        style={{ backgroundColor: `${iconColor}2E`, borderColor: `${iconColor}66` }}
      >
        <div className="relative h-9 w-9">
          <Image
            src={iconPath}
            alt={`${title} Icon`}
            fill
            sizes="36px"
            className="object-contain"
          />
        </div>
      </div>
      <div className="space-y-2">
        <h3 
          className="text-xl font-bold"
          style={{ color: iconColor }}
        >
          {title}
        </h3>
        <p className="text-lg font-semibold text-card-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

export default IntroCard;