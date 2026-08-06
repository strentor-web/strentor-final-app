// Pure string-building for auto-generated case study MDX files. Deliberately
// deterministic and template-based, not AI — this runs off an unauthenticated
// public submission (see app/api/site-testimonials/submit/route.ts), so no
// LLM call, no hallucination or prompt-injection surface. Produces the same
// shape as the hand-written files in content/case-studies/*.mdx.

export function escapeYaml(value: string): string {
  return value.replace(/"/g, '\\"');
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function buildExcerpt(progress: string): string {
  const trimmed = progress.trim();
  if (trimmed.length <= 160) return trimmed;
  return `${trimmed.slice(0, 160).replace(/\s+\S*$/, "")}...`;
}

export interface CaseStudyMdxParams {
  name: string;
  slug: string;
  condition: string;
  quote: string;
  startingPoint: string;
  approach: string;
  progress: string;
}

/** Assembles a case study MDX file, same shape as the hand-written ones in
 * content/case-studies/*.mdx. */
export function buildCaseStudyMdx(params: CaseStudyMdxParams): string {
  const { name, slug, condition, quote, startingPoint, approach, progress } = params;
  const publishedAt = new Date().toISOString().slice(0, 10);
  const excerpt = buildExcerpt(progress);

  const frontmatterLines = [
    "---",
    `name: "${escapeYaml(name)}"`,
    `slug: "${slug}"`,
    `role: "Client"`,
    `condition: "${escapeYaml(condition)}"`,
    `excerpt: "${escapeYaml(excerpt)}"`,
    `quote: "${escapeYaml(quote)}"`,
    `publishedAt: "${publishedAt}"`,
    "published: true",
    "---",
    "",
    "## Starting point",
    "",
    startingPoint.trim(),
    "",
    "## Coaching approach",
    "",
    approach.trim(),
    "",
    "## Where they are now",
    "",
    progress.trim(),
    "",
  ];

  return frontmatterLines.join("\n");
}
