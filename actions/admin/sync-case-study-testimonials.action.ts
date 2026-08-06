"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getAdminUser } from "@/utils/user";
import { createSafeAction, ActionState } from "@/lib/create-safe-action";
import { getPublishedCaseStudies } from "@/lib/caseStudies";
import prisma from "@/utils/prisma/prismaClient";

// No input — this is a one-click sync, not a form. createSafeAction still
// needs a schema, so an empty object is the input contract.
const SyncSchema = z.object({});
type SyncInput = z.infer<typeof SyncSchema>;

interface SyncResult {
  created: number;
  skipped: number;
  createdNames: string[];
}

// Case studies live as static files (content/case-studies/*.mdx), so there's
// no database trigger when one is added by hand. This is the "case study ->
// testimonial" half of the two-way sync: for every published case study
// that carries a quote, ensure a matching site_testimonials row exists so
// it shows up in the regular testimonial grid too, not just its own page.
// Idempotent — matches on exact name + quote text, safe to re-run.
async function syncCaseStudyTestimonialsHandler(): Promise<ActionState<SyncInput, SyncResult>> {
  const adminUser = await getAdminUser();
  if (!adminUser) return { error: "Admin access required" };

  const studiesWithQuotes = getPublishedCaseStudies().filter((study) => study.quote?.trim());

  let created = 0;
  let skipped = 0;
  const createdNames: string[] = [];

  for (const study of studiesWithQuotes) {
    const existing = await prisma.site_testimonials.findFirst({
      where: { name_display: study.name, testimonial_text: study.quote },
    });

    if (existing) {
      skipped += 1;
      continue;
    }

    await prisma.site_testimonials.create({
      data: {
        name_display: study.name,
        testimonial_text: study.quote as string,
        context: study.condition || undefined,
        consent_given: true,
        is_published: true,
        source_page: `/transformation-stories/${study.slug}`,
      },
    });
    created += 1;
    createdNames.push(study.name);
  }

  if (created > 0) {
    revalidatePath("/transformation-stories");
  }

  return { data: { created, skipped, createdNames } };
}

export const syncCaseStudyTestimonials = createSafeAction(SyncSchema, syncCaseStudyTestimonialsHandler);
