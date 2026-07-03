import React from 'react';
import { Infinity, Handshake, Flame, Users, type LucideIcon } from 'lucide-react';

interface IntroCardProps {
  icon: 'holistic' | 'inclusivity' | 'empowerment' | 'community';
  title: string;
  description: string;
}

const iconComponents: Record<IntroCardProps['icon'], LucideIcon> = {
  holistic: Infinity,
  inclusivity: Handshake,
  empowerment: Flame,
  community: Users,
};

const colorMap: Record<IntroCardProps['icon'], string> = {
  holistic: '#D4AF37',     // Strentor Gold
  inclusivity: '#E8C766',  // Strentor Champagne
  empowerment: '#C9972B',  // Strentor Antique Gold
  community: '#B7BAC0',    // Strentor Silver
};

// Icon glyph color chosen per badge for maximum contrast against its solid background.
const iconGlyphColor: Record<IntroCardProps['icon'], string> = {
  holistic: '#0A0A0A',
  inclusivity: '#0A0A0A',
  empowerment: '#0A0A0A',
  community: '#0A0A0A',
};

export function IntroCard({ icon, title, description }: IntroCardProps) {
  const Icon = iconComponents[icon];
  const badgeColor = colorMap[icon];
  const glyphColor = iconGlyphColor[icon];

  return (
    <div className="flex items-start gap-4 rounded-lg border border-border bg-card p-6 shadow-sm transition-all hover:shadow-lg">
      <div
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full shadow-md"
        style={{ backgroundColor: badgeColor }}
      >
        <Icon className="h-7 w-7" color={glyphColor} strokeWidth={2} />
      </div>
      <div className="space-y-2">
        <h3
          className="text-xl font-bold"
          style={{ color: badgeColor }}
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
