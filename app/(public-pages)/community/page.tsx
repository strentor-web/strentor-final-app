"use client"

import Image from 'next/image';
import { Button } from "@/components/ui/button";
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';

const communityGroups = [
  {
    title: "STRENTOR Main Community",
    description: "Your hub for general updates, announcements, and discussions across all services.",
    icon: "/strentor-icon.png",
    color: "from-[#EDE0C8]/10 to-[#EDE0C8]/5",
    buttonColor: "bg-[#EDE0C8] hover:bg-[#EDE0C8]/90",
    whatsappLink: "https://chat.whatsapp.com/GJRdI9y1NRkFei0IosUAlL"
  },
  {
    title: "Fitness Group",
    description: "For those focused on physical health and fitness, this group shares workouts, fitness tips, and motivational content.",
    icon: "/fitness.svg",
    color: "from-[#C9A96A]/10 to-[#C9A96A]/5",
    buttonColor: "bg-[#C9A96A]/70 hover:bg-[#C9A96A]/90",
    whatsappLink: "https://chat.whatsapp.com/EYr2NBxdcPoFKoj3TFmKQr"
  },
  // {
  //   title: "Life Coaching Group",
  //   description: "Focused on personal growth, goal-setting, and achieving your full potential.",
  //   icon: "/lifecoaching.png",
  //   color: "from-[#2FA366]/10 to-[#2FA366]/5",
  //   buttonColor: "bg-[#2FA366] hover:bg-[#2FA366]/90",
  //   whatsappLink: "https://chat.whatsapp.com/BW8s55o0pLCHCimnM0za3x"
  // },
  
];


export default function CommunityPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header/>
      {/* Hero Section */}
      <div className="relative h-[50vh] bg-black">
        <Image
          src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=2070"
          alt="Community collaboration"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold font-display text-white mb-6">
            Join Our <span className="text-[#C9A96A]">Community</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl">
            Connect, grow, and transform with like-minded individuals
          </p>
        </div>
      </div>

      {/* Welcome Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-4xl font-bold font-display text-foreground mb-6">
            Welcome to the <span className="text-[#C9A96A]">STRENTOR</span> Community!
          </h2>
          <p className="text-lg text-foreground font-semibold leading-relaxed">
            We are excited to have you join our journey of holistic empowerment and personal growth. 
            Our community is designed to inspire, support, and guide individuals through a range of 
            specialized services.
          </p>
        </div>

        {/* Community Groups */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {communityGroups.map((group, index) => (
            <div
              key={index}
              className={`rounded-xl p-6 bg-gradient-to-br ${group.color} border border-border`}
            >
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-black p-3 shadow-md">
                  <div className="relative w-8 h-8">
                    <Image
                      src={group.icon}
                      alt={`${group.title} icon`}
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{group.title}</h3>
                    <p className="text-muted-foreground mt-1">{group.description}</p>
                  </div>
                  <a
                    href={group.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-block px-6 py-2 rounded-full text-black font-bold ${group.buttonColor} transition-colors duration-200`}
                  >
                    Join Group
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        
      </section>
        <div className="text-center py-20 bg-gray-900">
            <h2 className="text-4xl font-bold font-display text-white mb-4 sm:text-5xl md:text-6xl lg:text-7xl">
              Ready to Begin Your <span className="text-[#C9A96A]">Journey</span>?
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-300 font-medium md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 pb-8 pt-2">
              Take the first step towards transformation with our expert team of coaches and mentors.
            </p>
            <Button
              className="bg-[#C9A96A] hover:bg-[#C9A96A]/90 text-primary-foreground font-bold rounded-full px-8 py-6 text-lg"
              onClick={() => window.open("https://calendly.com/strentor/strentor-services", "_blank")}
            >
              Start Your Transformation
            </Button>
        </div>
        <Footer/>
    </main>
  );
}