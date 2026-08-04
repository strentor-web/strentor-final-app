import Link from "next/link"
import { Metadata } from "next"
import Header from "@/components/landing/Header"
import Footer from "@/components/landing/Footer"
import { getPublishedPosts } from "@/lib/blog"
import { ScrollReveal, StaggerGroup } from "@/components/motion/ScrollReveal"
import { HoverLift } from "@/components/motion/HoverLift"

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Practical guidance on adaptive strength training, wheelchair fitness, mindset, and coaching for wheelchair users in India, the UAE, and Singapore.",
  alternates: { canonical: "/blog" },
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
}

export default function BlogIndexPage() {
  const posts = getPublishedPosts()

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="relative bg-black py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A96A]/10 via-black to-black" />
        <div className="container relative mx-auto px-4 text-center">
          <ScrollReveal direction="none">
            <span className="text-sm font-bold uppercase tracking-widest text-[#C9A96A]">Blog</span>
          </ScrollReveal>
          <ScrollReveal delay={0.1} scale={0.96}>
            <h1 className="mt-4 text-4xl font-bold font-display text-white sm:text-5xl md:text-6xl">
              Guidance for <span className="text-[#C9A96A]">wheelchair strength & performance</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300 md:text-xl">
              Practical writing on adaptive training, mindset, and coaching — no fabricated claims, no medical
              advice.
            </p>
          </ScrollReveal>
        </div>
      </div>

      <section className="container mx-auto px-4 py-16 md:py-24">
        {posts.length === 0 ? (
          <p className="mx-auto max-w-xl text-center text-muted-foreground">
            New posts are on the way. Check back soon.
          </p>
        ) : (
          <StaggerGroup className="mx-auto grid max-w-4xl gap-6">
            {posts.map((post) => (
              <ScrollReveal key={post.slug} as="div">
                <HoverLift tilt={false}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block rounded-2xl border border-border bg-card p-6 transition-colors hover:border-[#C9A96A] sm:p-8"
                  >
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#C9A96A]">
                      {formatDate(post.publishedAt)}
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-card-foreground">{post.title}</h2>
                    <p className="mt-3 text-muted-foreground">{post.excerpt}</p>
                  </Link>
                </HoverLift>
              </ScrollReveal>
            ))}
          </StaggerGroup>
        )}
      </section>

      <Footer />
    </div>
  )
}
