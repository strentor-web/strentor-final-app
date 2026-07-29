import { Skeleton } from "@/components/ui/skeleton";

export default function AssessmentLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-20 bg-black" />
      <div className="relative bg-black py-16 md:py-20">
        <div className="container relative mx-auto px-4 text-center">
          <Skeleton className="mx-auto h-4 w-40 bg-white/10" />
          <Skeleton className="mx-auto mt-4 h-10 w-72 bg-white/10" />
          <Skeleton className="mx-auto mt-4 h-5 w-96 max-w-full bg-white/10" />
        </div>
      </div>
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="mx-auto max-w-2xl space-y-6 rounded-2xl border border-border bg-card p-8 shadow-sm">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      </section>
    </div>
  );
}
