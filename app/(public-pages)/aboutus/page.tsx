import { HeroSection } from '@/components/aboutus/HeroSection';
import { BrandStory } from '@/components/aboutus/BrandStory';
import { Mission } from '@/components/aboutus/Mission';
import { FounderStory } from '@/components/aboutus/Founder';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer'
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About Us",
  description: "Meet the founder behind Strentor: a national-level para powerlifter building adaptive strength and nutrition coaching for wheelchair users with spina bifida, CKD, and long-term physical challenges.",
  alternates: {
    canonical: "/aboutus",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header/>
      <HeroSection />
      <BrandStory />
      <Mission />
      
      <FounderStory />
      <Footer/>
    </main>
  );
}




