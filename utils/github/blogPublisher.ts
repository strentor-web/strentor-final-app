// Publishes a blog post by committing a new content/blog/*.mdx file
// directly to the repo's main branch via the GitHub Contents API. The
// site's blog reads posts from the filesystem at build time (see
// lib/blog.ts), so a commit to main is what "publish" actually means
// here — the host's normal deploy-on-push picks it up from there,
// typically live within a couple of minutes.

const GITHUB_OWNER = "strentor-web";
const GITHUB_REPO = "strentor-final-app";
const GITHUB_BRANCH = "main";
const GITHUB_API_BASE = "https://api.github.com";

export const BLOG_PUBLISHING_CONFIGURED = !!process.env.BLOG_PUBLISH_GITHUB_TOKEN;

export class BlogPublishingNotConfiguredError extends Error {
  constructor() {
    super("Blog publishing is not configured: BLOG_PUBLISH_GITHUB_TOKEN is not set.");
    this.name = "BlogPublishingNotConfiguredError";
  }
}

interface PublishParams {
  slug: string;
  mdxContent: string;
  commitMessage: string;
}

interface PublishResult {
  commitSha: string;
  commitUrl: string;
}

export async function publishBlogPostFile({ slug, mdxContent, commitMessage }: PublishParams): Promise<PublishResult> {
  const token = process.env.BLOG_PUBLISH_GITHUB_TOKEN;
  if (!token) throw new BlogPublishingNotConfiguredError();

  const path = `content/blog/${slug}.mdx`;
  const url = `${GITHUB_API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;

  // A file at this path means this slug was already published — fail
  // loudly rather than silently overwriting an existing post.
  const existing = await fetch(`${url}?ref=${GITHUB_BRANCH}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
  });
  if (existing.status === 200) {
    throw new Error(`A post already exists at content/blog/${slug}.mdx — choose a different slug.`);
  }

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: commitMessage,
      content: Buffer.from(mdxContent, "utf-8").toString("base64"),
      branch: GITHUB_BRANCH,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub API error (${response.status}): ${body}`);
  }

  const data = await response.json();
  return {
    commitSha: data.commit?.sha ?? "",
    commitUrl: data.commit?.html_url ?? "",
  };
}
