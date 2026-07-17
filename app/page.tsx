import FAQSection from "@/components/landing/FAQSection";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Team from "@/components/landing/Team";
import Footer from "@/components/landing/Footer";
import WhatsAppButton from "@/components/landing/WhatsAppButton";
import {
  ValueProposition,
  ProblemSection,
  DifferenceSection,
  WhoItsFor,
  CoachingPillars,
  HowItWorks,
  PayItForwardIntro,
  HomeMedicalNote,
  FinalCTA,
} from "@/components/landing/home/HomeSections";

export default function Home() {
  return (
    <div>
      <Header/>
      <Hero/>
      <ValueProposition/>
      <ProblemSection/>
      <DifferenceSection/>
      <WhoItsFor/>
      <CoachingPillars/>
      <HowItWorks/>
      <PayItForwardIntro/>
      <Team/>
      <FAQSection/>
      <HomeMedicalNote/>
      <FinalCTA/>
      <Footer/>
      <WhatsAppButton/>
    </div>
  );
}
