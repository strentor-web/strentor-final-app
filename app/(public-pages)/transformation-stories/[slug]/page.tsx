import Link from "next/link"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import Header from "@/components/landing/Header"
import Footer from "@/components/landing/Footer"
import { Button } from "@/components/ui/button"
import { Quote } from "lucide-react"
import { getPublishedCaseStudyBySlug, getPublishedCaseStudies } from "@/lib/caseStudies"
import { ScrollReveal } from "@/components/motion/ScrollReveal"

const siteUrl = "https://www.strentor.com"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const study = getPublishedCaseStudyBySlug(slug)
  if (!study) return {}

  const title = `${study.name} — Transformation Story`
  return {
    title,
    description: study.excerpt,
    alternates: { canonical: `/transformation-stories/${study.slug}` },
    openGraph: {
      title,
      description: study.excerpt,
      type: "article",
      url: `${siteUrl}/transformation-stories/${study.slug}`,
      publishedTime: study.publishedAt,
    },
  }
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params
  const study = getPublishedCaseStudyBySlug(slug)
  if (!study) notFound()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${study.name} — Transformation Story`,
    description: study.excerpt,
    datePublished: study.publishedAt,
    author: { "@type": "Organization", name: "Strentor" },
    publisher: { "@type": "Organization", name: "Strentor" },
    mainEntityOfPage: `${siteUrl}/transformation-stories/${study.slug}`,
  }

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />

      <article className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-2xl">
          <ScrollReveal>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#C9A96A]">
              {study.role === "Founder" ? "Founder Story" : "Client Story"}
            </p>
            <h1 className="mt-3 text-3xl font-bold font-display text-foreground sm:text-4xl md:text-5xl">
              {study.name}
            </h1>
            <p className="mt-2 text-sm font-medium text-muted-foreground">{study.condition}</p>
            <p className="mt-4 text-lg text-muted-foreground">{study.excerpt}</p>
          </ScrollReveal>

          <div className="prose prose-invert prose-headings:font-display prose-a:text-[#C9A96A] mt-10 max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{study.content}</ReactMarkdown>
          </div>

          {study.quote && (
            <ScrollReveal className="mt-10 rounded-2xl border border-border bg-card p-8">
              <Quote className="h-7 w-7 text-[#B8935A]" />
              <p className="mt-4 text-lg font-medium leading-relaxed text-card-foreground">
                &ldquo;{study.quote}&rdquo;
              </p>
              <p className="mt-4 font-semibold text-[#C9A96A]">— {study.name}</p>
            </ScrollReveal>
          )}

          <ScrollReveal className="mt-10 rounded-2xl border border-dashed border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
            STRENTOR is fitness and performance coaching — not medical treatment, not physiotherapy, and not a
            substitute for care from a doctor, physiotherapist, or dietitian. This story describes one
            individual&apos;s experience and is not a guarantee of similar results for anyone else. See the{" "}
            <Link href="/medical-disclaimer" className="font-semibold text-[#C9A96A] hover:underline">
              medical disclaimer
            </Link>{" "}
            for detail.
          </ScrollReveal>

          <ScrollReveal className="mt-10 rounded-2xl border border-[#C9A96A]/30 bg-card p-8 text-center">
            <h2 className="text-xl font-bold text-card-foreground">Ready to write your own story?</h2>
            <p className="mt-2 text-muted-foreground">
              Take the Performance Assessment and STRENTOR will recommend the right coaching pathway for you.
            </p>
            <div className="mt-6 flex justify-center">
              <Button asChild className="h-12 rounded-full bg-[#C9A96A] px-8 hover:bg-[#C9A96A]/90">
                <Link href="/apply-for-access">Take the Performance Assessment</Link>
              </Button>
            </div>
          </ScrollReveal>

          <div className="mt-8">
            <Link href="/transformation-stories" className="text-sm text-muted-foreground hover:text-[#C9A96A]">
              ← Back to all stories
            </Link>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  )
}

export function generateStaticParams() {
  return getPublishedCaseStudies().map((study) => ({ slug: study.slug }))
}
