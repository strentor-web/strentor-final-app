import Link from "next/link";
import { getPublishedPosts } from "@/lib/blog";
import { ScrollReveal, StaggerGroup } from "@/components/motion/ScrollReveal";
import { HoverLift } from "@/components/motion/HoverLift";

const GOLD = "#D4AF37";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

// Server component — getPublishedPosts() reads content/blog/*.mdx off disk.
// Only one real post exists today; the empty/coming-soon state mirrors the
// pattern already used on /blog rather than inventing more posts.
export function KnowledgeHub() {
  const posts = getPublishedPosts();

  return (
    <section className="relative bg-black px-6 py-24 md:px-12 lg:px-20 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <p className="mb-4 text-sm font-medium tracking-[0.3em]" style={{ color: GOLD }}>
            KNOWLEDGE HUB
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <h2 className="mb-16 max-w-2xl text-4xl font-normal leading-tight text-[#FAFAFA] md:text-5xl lg:text-6xl">
            Learn From the Method
          </h2>
        </ScrollReveal>

        {posts.length === 0 ? (
          <p className="text-[#B8B8B8]">New posts are on the way. Check back soon.</p>
        ) : (
          <StaggerGroup className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {posts.map((post) => (
              <ScrollReveal key={post.slug}>
                <HoverLift tilt={false} className="h-full rounded-2xl">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="liquid-glass block h-full rounded-2xl p-8"
                  >
                    <p className="mb-3 text-xs font-medium tracking-[0.2em]" style={{ color: GOLD }}>
                      {formatDate(post.publishedAt).toUpperCase()}
                    </p>
                    <h3 className="mb-3 text-2xl font-medium text-[#FAFAFA]">{post.title}</h3>
                    <p className="text-sm leading-relaxed text-[#B8B8B8]">{post.excerpt}</p>
                  </Link>
                </HoverLift>
              </ScrollReveal>
            ))}
            <ScrollReveal>
              <div className="flex h-full min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 p-8 text-center">
                <p className="text-sm text-[#B8B8B8]">More guides coming soon.</p>
                <Link
                  href="/blog"
                  className="mt-3 text-sm font-medium"
                  style={{ color: GOLD }}
                >
                  Visit the blog →
                </Link>
              </div>
            </ScrollReveal>
          </StaggerGroup>
        )}
      </div>
    </section>
  );
}

export default KnowledgeHub;
