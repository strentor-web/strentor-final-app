"use client"

import { HeartPulse, Scale, Sparkles, LucideIcon } from 'lucide-react'
import Image from 'next/image'

interface TransformationItem {
  title: string;
  description: string;
  icon?: LucideIcon;
  isCustomIcon?: boolean;
  iconPath?: string;
  color: string;
  lightColor: string;
}

const transformations: TransformationItem[] = [
  {
    title: "Take Control of Your Condition",
    description: "Manage or Reverse Chronic Health Issues Like Diabetes or Thyroid Problems.",
    icon: HeartPulse,
    color: "#C9A96A",
    lightColor: "rgba(212, 175, 55, 0.1)"
  },
  {
    title: "Build Strength Beyond Limits",
    description: "Develop Physical and Mental Resilience to Conquer Life's Toughest Challenge.",
    isCustomIcon: true,
    iconPath: "/dumbbell.png",
    color: "#B8935A",
    lightColor: "rgba(184, 147, 90, 0.1)"
  },
  {
    title: "Achieve Weight Goals",
    description: "Experience Weight Management as a Byproduct of Better Health and Strength.",
    icon: Scale,
    color: "#C9C0B4",
    lightColor: "rgba(201, 192, 180, 0.1)"
  },
  {
    title: "Rediscover Confidence and Freedom",
    description: "Regain Mobility and Feel Empowered in Your Own Body.",
    isCustomIcon: true,
    iconPath: "/self-confidence.png",
    color: "#DCC28C",
    lightColor: "rgba(220, 194, 140, 0.1)"
  },
  {
    title: "Enhance Your Quality of Life",
    description: "Enjoy Reduced Pain and More Energy.",
    icon: Sparkles,
    color: "#EDE0C8",
    lightColor: "rgba(237, 224, 200, 0.1)"
  }
]

export default function Transformations() {
  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
            Your <span className="text-[#C9A96A]">Journey</span> to Transformation
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Five major transformations you&apos;ll experience on your fitness journey with us.
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-4">
          {transformations.map((item, index) => (
            <div 
              key={index}
              className="flex rounded-xl bg-card shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div 
                className="w-24 flex items-center justify-center p-4"
                style={{ backgroundColor: item.lightColor }}
              >
                {item.isCustomIcon ? (
                  <div 
                    className="w-8 h-8 relative"
                    style={{ color: item.color }}
                  >
                    <Image
                      src={item.iconPath!}
                      alt={item.title}
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </div>
                ) : (
                  item.icon && <item.icon 
                    className="w-8 h-8"
                    style={{ color: item.color }}
                  />
                )}
              </div>
              <div className="flex-1 p-4">
                <h3 className="text-lg font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm mt-1">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 