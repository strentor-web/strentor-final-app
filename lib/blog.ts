import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export interface BlogPostFrontmatter {
  title: string;
  slug: string;
  excerpt: string;
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
  publishedAt: string;
  published: boolean;
  relatedProgram?: string;
}

export interface BlogPost extends BlogPostFrontmatter {
  content: string;
}

function readAllPostFiles(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith(".mdx"));
}

function parsePostFile(filename: string): BlogPost {
  const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf8");
  const { data, content } = matter(raw);
  return { ...(data as BlogPostFrontmatter), content };
}

/** All published posts, newest first. */
export function getPublishedPosts(): BlogPost[] {
  return readAllPostFiles()
    .map(parsePostFile)
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

/** A single post by slug. Returns undefined if missing or unpublished. */
export function getPublishedPostBySlug(slug: string): BlogPost | undefined {
  return getPublishedPosts().find((post) => post.slug === slug);
}
