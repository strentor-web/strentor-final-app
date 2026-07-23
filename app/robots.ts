import type { MetadataRoute } from "next";

const siteUrl = "https://www.strentor.com";

const disallowedPaths = [
  "/api/",
  "/admin",
  "/admin/",
  "/dashboard",
  "/dashboard/",
  "/fitness",
  "/fitness/",
  "/training",
  "/training/",
  "/protected",
  "/protected/",
  "/onboarding",
  "/onboarding/",
  "/settings",
  "/settings/",
  "/plans",
  "/plans/",
  "/workout-plan",
  "/workout-plan/",
  "/workout",
  "/workout/",
  "/personal-records",
  "/personal-records/",
  "/transformation",
  "/transformation/",
  "/calculator",
  "/calculator/",
  "/unauthorized",
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/auth/",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: disallowedPaths,
      },
      // Explicitly welcome AI assistant / answer-engine crawlers so the
      // site's public content is eligible to be cited or recommended.
      { userAgent: "GPTBot", allow: "/", disallow: disallowedPaths },
      { userAgent: "ChatGPT-User", allow: "/", disallow: disallowedPaths },
      { userAgent: "OAI-SearchBot", allow: "/", disallow: disallowedPaths },
      { userAgent: "ClaudeBot", allow: "/", disallow: disallowedPaths },
      { userAgent: "Claude-Web", allow: "/", disallow: disallowedPaths },
      { userAgent: "anthropic-ai", allow: "/", disallow: disallowedPaths },
      { userAgent: "PerplexityBot", allow: "/", disallow: disallowedPaths },
      { userAgent: "Perplexity-User", allow: "/", disallow: disallowedPaths },
      { userAgent: "Google-Extended", allow: "/", disallow: disallowedPaths },
      { userAgent: "Applebot-Extended", allow: "/", disallow: disallowedPaths },
      { userAgent: "Bingbot", allow: "/", disallow: disallowedPaths },
      { userAgent: "CCBot", allow: "/", disallow: disallowedPaths },
      { userAgent: "cohere-ai", allow: "/", disallow: disallowedPaths },
      { userAgent: "Meta-ExternalAgent", allow: "/", disallow: disallowedPaths },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
