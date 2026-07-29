import prisma from "@/utils/prisma/prismaClient";
import { testimonials as staticTestimonials } from "@/data/testimonials";

export interface TestimonialStory {
  key: string;
  quote: string;
  author: string;
  mediaUrl?: string;
}

// Prioritizes real, admin-approved client testimonials (video reviews first,
// since they're the strongest social proof), then falls back to public
// site_testimonials submissions, then the static hand-picked quotes — mirrors
// the pattern in /transformation-stories/page.tsx.
export async function getHomeTestimonials(): Promise<TestimonialStory[]> {
  const approved = await prisma.testimonials.findMany({
    where: { approval_status: "APPROVED" },
    orderBy: { created_at: "desc" },
    take: 20,
  });
  const videoFirst = [...approved].sort(
    (a, b) => (b.review_type === "VIDEO" ? 1 : 0) - (a.review_type === "VIDEO" ? 1 : 0)
  );
  const fromClients: TestimonialStory[] = videoFirst.slice(0, 9).map((t) => ({
    key: t.id,
    quote: t.testimonial_text,
    author: t.name_display,
    mediaUrl: t.review_type === "VIDEO" ? t.media_url ?? undefined : undefined,
  }));

  if (fromClients.length >= 6) return fromClients;

  const submitted = await prisma.site_testimonials.findMany({
    where: { is_published: true },
    orderBy: { created_at: "desc" },
    take: 9 - fromClients.length,
  });
  const combined: TestimonialStory[] = [
    ...fromClients,
    ...submitted.map((t) => ({ key: t.id, quote: t.testimonial_text, author: t.name_display })),
  ];

  if (combined.length >= 3) return combined;

  return [
    ...combined,
    ...staticTestimonials
      .slice(0, 9 - combined.length)
      .map((t) => ({ key: t.author, quote: t.quote, author: t.author })),
  ];
}
