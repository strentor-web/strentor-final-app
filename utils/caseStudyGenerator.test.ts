import { describe, it, expect } from "vitest";
import matter from "gray-matter";
import { slugify, buildExcerpt, buildCaseStudyMdx, escapeYaml } from "./caseStudyGenerator";
import type { CaseStudyFrontmatter } from "@/lib/caseStudies";

describe("slugify", () => {
  it("lowercases and hyphenates a name", () => {
    expect(slugify("Chaitanya Shetty")).toBe("chaitanya-shetty");
  });

  it("strips punctuation and collapses whitespace", () => {
    expect(slugify("  Mary-Jane O'Brien!! ")).toBe("mary-jane-obrien");
  });

  it("returns an empty string for input with no safe characters", () => {
    expect(slugify("!!!")).toBe("");
  });
});

describe("escapeYaml", () => {
  it("escapes double quotes", () => {
    expect(escapeYaml('She said "hello"')).toBe('She said \\"hello\\"');
  });
});

describe("buildExcerpt", () => {
  it("returns short text unchanged", () => {
    expect(buildExcerpt("Short progress note.")).toBe("Short progress note.");
  });

  it("truncates long text at a word boundary and appends an ellipsis", () => {
    const long = "word ".repeat(60).trim();
    const excerpt = buildExcerpt(long);
    expect(excerpt.length).toBeLessThanOrEqual(163); // 160 + "..."
    expect(excerpt.endsWith("...")).toBe(true);
    expect(excerpt.endsWith(" ...")).toBe(false); // no dangling space before ellipsis
  });
});

describe("buildCaseStudyMdx", () => {
  const params = {
    name: "Test Person",
    slug: "test-person",
    condition: "Spina Bifida",
    quote: "Working with Aditya changed everything.",
    startingPoint: "Doubted whether training was possible.",
    approach: "A program built around my specific condition.",
    progress: "Stronger and more confident than before.",
  };

  it("produces valid frontmatter with all fields", () => {
    const mdx = buildCaseStudyMdx(params);
    expect(mdx).toContain('name: "Test Person"');
    expect(mdx).toContain('slug: "test-person"');
    expect(mdx).toContain('role: "Client"');
    expect(mdx).toContain('condition: "Spina Bifida"');
    expect(mdx).toContain('quote: "Working with Aditya changed everything."');
    expect(mdx).toContain("published: true");
    expect(mdx).toMatch(/publishedAt: "\d{4}-\d{2}-\d{2}"/);
  });

  it("includes all three narrative sections in order", () => {
    const mdx = buildCaseStudyMdx(params);
    const startingIdx = mdx.indexOf("## Starting point");
    const approachIdx = mdx.indexOf("## Coaching approach");
    const progressIdx = mdx.indexOf("## Where they are now");
    expect(startingIdx).toBeGreaterThan(-1);
    expect(approachIdx).toBeGreaterThan(startingIdx);
    expect(progressIdx).toBeGreaterThan(approachIdx);
    expect(mdx).toContain(params.startingPoint);
    expect(mdx).toContain(params.approach);
    expect(mdx).toContain(params.progress);
  });

  it("escapes double quotes in name and quote to keep YAML frontmatter valid", () => {
    const mdx = buildCaseStudyMdx({ ...params, name: 'Pat "PJ" Jones', quote: 'He said "great work".' });
    expect(mdx).toContain('name: "Pat \\"PJ\\" Jones"');
    expect(mdx).toContain('quote: "He said \\"great work\\"."');
  });

  it("is parseable by gray-matter — the same library lib/caseStudies.ts uses in production", () => {
    const mdx = buildCaseStudyMdx(params);
    const { data, content } = matter(mdx);
    const frontmatter = data as CaseStudyFrontmatter;

    expect(frontmatter.name).toBe(params.name);
    expect(frontmatter.slug).toBe(params.slug);
    expect(frontmatter.role).toBe("Client");
    expect(frontmatter.condition).toBe(params.condition);
    expect(frontmatter.quote).toBe(params.quote);
    expect(frontmatter.published).toBe(true);
    expect(content).toContain(params.startingPoint);
  });

  it("stays parseable even with quotes and special characters in every field", () => {
    const mdx = buildCaseStudyMdx({
      name: 'D\'Angelo "Danny" O\'Neil',
      slug: "dangelo-oneil",
      condition: 'C5-C6 SCI, uses a "power" chair',
      quote: 'He said: "This changed my life," and meant it.',
      startingPoint: "Couldn't do a single rep.",
      approach: 'Aditya said "we\'ll build this slowly."',
      progress: "Now benching 60kg.",
    });
    const { data } = matter(mdx);
    expect((data as CaseStudyFrontmatter).name).toBe('D\'Angelo "Danny" O\'Neil');
    expect((data as CaseStudyFrontmatter).quote).toBe('He said: "This changed my life," and meant it.');
  });
});
