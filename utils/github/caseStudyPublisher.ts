// Publishes a case study by committing a new content/case-studies/*.mdx
// file directly to the repo's main branch via the GitHub Contents API —
// the same mechanism as utils/github/blogPublisher.ts, reusing the same
// BLOG_PUBLISH_GITHUB_TOKEN (identical permission scope, no reason to
// require a second secret). The site reads case studies from the
// filesystem at build time (see lib/caseStudies.ts), so a commit to main
// is what "publish" means here — live after the next deploy, typically
// within a couple of minutes.

const GITHUB_OWNER = "strentor-web";
const GITHUB_REPO = "strentor-final-app";
const GITHUB_BRANCH = "main";
const GITHUB_API_BASE = "https://api.github.com";

export const CASE_STUDY_PUBLISHING_CONFIGURED = !!process.env.BLOG_PUBLISH_GITHUB_TOKEN;

export class CaseStudyPublishingNotConfiguredError extends Error {
  constructor() {
    super("Case study publishing is not configured: BLOG_PUBLISH_GITHUB_TOKEN is not set.");
    this.name = "CaseStudyPublishingNotConfiguredError";
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

/** Returns true if content/case-studies/{slug}.mdx already exists on `main`. */
export async function caseStudySlugExists(slug: string): Promise<boolean> {
  const token = process.env.BLOG_PUBLISH_GITHUB_TOKEN;
  if (!token) throw new CaseStudyPublishingNotConfiguredError();

  const path = `content/case-studies/${slug}.mdx`;
  const url = `${GITHUB_API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
  });
  return response.status === 200;
}

export async function publishCaseStudyFile({ slug, mdxContent, commitMessage }: PublishParams): Promise<PublishResult> {
  const token = process.env.BLOG_PUBLISH_GITHUB_TOKEN;
  if (!token) throw new CaseStudyPublishingNotConfiguredError();

  const path = `content/case-studies/${slug}.mdx`;
  const url = `${GITHUB_API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;

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
