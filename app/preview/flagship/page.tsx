import { VideoHero } from "@/components/landing/VideoHero";
import { PainPoints } from "@/components/landing/flagship/PainPoints";
import { BreakBuildBecome } from "@/components/landing/flagship/BreakBuildBecome";
import { EcosystemFlow } from "@/components/landing/flagship/EcosystemFlow";
import { ProgramsGrid } from "@/components/landing/flagship/ProgramsGrid";
import { StatsCounter } from "@/components/landing/flagship/StatsCounter";
import { FounderStory } from "@/components/landing/flagship/FounderStory";
import { TestimonialsCarousel } from "@/components/landing/flagship/TestimonialsCarousel";
import { KnowledgeHub } from "@/components/landing/flagship/KnowledgeHub";

export default function FlagshipPreviewPage() {
  return (
    <main>
      <VideoHero />
      <PainPoints />
      <BreakBuildBecome />
      <EcosystemFlow />
      <ProgramsGrid />
      <StatsCounter />
      <FounderStory />
      <TestimonialsCarousel />
      <KnowledgeHub />
    </main>
  );
}
