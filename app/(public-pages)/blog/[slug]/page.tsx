import Link from "next/link"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import Header from "@/components/landing/Header"
import Footer from "@/components/landing/Footer"
import { Button } from "@/components/ui/button"
import { getPublishedPostBySlug, getPublishedPosts } from "@/lib/blog"

const siteUrl = "https://www.strentor.com"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPublishedPostBySlug(slug)
  if (!post) return {}

  const title = post.seoTitle || post.title
  const description = post.seoDescription || post.excerpt

  return {
    title,
    description,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      url: `${siteUrl}/blog/${post.slug}`,
      publishedTime: post.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = getPublishedPostBySlug(slug)
  if (!post) notFound()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: { "@type": "Organization", name: "Strentor" },
    publisher: { "@type": "Organization", name: "Strentor" },
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
  }

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />

      <article className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#C9A96A]">
            {formatDate(post.publishedAt)}
          </p>
          <h1 className="mt-3 text-3xl font-bold font-display text-foreground sm:text-4xl md:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>

          <div className="prose prose-invert prose-headings:font-display prose-a:text-[#C9A96A] mt-10 max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </div>

          <div className="mt-16 rounded-2xl border border-[#C9A96A]/30 bg-card p-8 text-center">
            <h2 className="text-xl font-bold text-card-foreground">Ready to build a plan around your goals?</h2>
            <p className="mt-2 text-muted-foreground">
              Start with the Performance Assessment — no diagnosis assumptions, no generic templates.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild className="h-12 rounded-full bg-[#C9A96A] px-8 hover:bg-[#C9A96A]/90">
                <Link href="/apply-for-access">Take the Performance Assessment</Link>
              </Button>
              {post.relatedProgram && (
                <Button asChild variant="outline" className="h-12 rounded-full">
                  <Link href={post.relatedProgram}>Related Program</Link>
                </Button>
              )}
            </div>
          </div>

          <div className="mt-8">
            <Link href="/blog" className="text-sm text-muted-foreground hover:text-[#C9A96A]">
              ← Back to all posts
            </Link>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  )
}

export function generateStaticParams() {
  return getPublishedPosts().map((post) => ({ slug: post.slug }))
}
