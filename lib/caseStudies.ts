import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CASE_STUDY_DIR = path.join(process.cwd(), "content", "case-studies");

export interface CaseStudyFrontmatter {
  name: string;
  slug: string;
  role: string;
  condition: string;
  excerpt: string;
  quote?: string;
  publishedAt: string;
  published: boolean;
}

export interface CaseStudy extends CaseStudyFrontmatter {
  content: string;
}

function readAllCaseStudyFiles(): string[] {
  if (!fs.existsSync(CASE_STUDY_DIR)) return [];
  return fs.readdirSync(CASE_STUDY_DIR).filter((file) => file.endsWith(".mdx"));
}

function parseCaseStudyFile(filename: string): CaseStudy {
  const raw = fs.readFileSync(path.join(CASE_STUDY_DIR, filename), "utf8");
  const { data, content } = matter(raw);
  return { ...(data as CaseStudyFrontmatter), content };
}

/** All published case studies, founder story first, then newest first. */
export function getPublishedCaseStudies(): CaseStudy[] {
  return readAllCaseStudyFiles()
    .map(parseCaseStudyFile)
    .filter((study) => study.published)
    .sort((a, b) => {
      if (a.role === "Founder") return -1;
      if (b.role === "Founder") return 1;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
}

/** A single case study by slug. Returns undefined if missing or unpublished. */
export function getPublishedCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return getPublishedCaseStudies().find((study) => study.slug === slug);
}
