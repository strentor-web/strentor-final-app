import { VideoHero } from "@/components/landing/VideoHero";
import { PainPoints } from "@/components/landing/flagship/PainPoints";
import { BreakBuildBecome } from "@/components/landing/flagship/BreakBuildBecome";
import { EcosystemFlow } from "@/components/landing/flagship/EcosystemFlow";
import { ProgramsGrid } from "@/components/landing/flagship/ProgramsGrid";
import { StatsCounter } from "@/components/landing/flagship/StatsCounter";

export default function FlagshipPreviewPage() {
  return (
    <main>
      <VideoHero />
      <PainPoints />
      <BreakBuildBecome />
      <EcosystemFlow />
      <ProgramsGrid />
      <StatsCounter />
    </main>
  );
}
