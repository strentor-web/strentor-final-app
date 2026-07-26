# STRENTOR Website Audit

Date: 2026-07-26
Scope: `strentor-web/strentor-final-app` (Next.js 15 App Router, TypeScript, Tailwind, Prisma/Supabase, Razorpay + PayPal), production domain `www.strentor.com`.

This audit reflects the actual state of the repository at the time of review. It does not restate the full repositioning brief — it documents what was found, what was changed in this pass, and what is still open. Claims about business facts (credentials, pricing, testimonials) are cross-referenced in `STRENTOR_Website_Content_Verification.md`, not repeated here.

## 1. Stack summary

- **Framework**: Next.js 15 (App Router), TypeScript, Tailwind CSS 3.4.
- **Data**: Prisma ORM against Supabase Postgres. Supabase also provides auth (`@supabase/ssr`).
- **Payments**: Razorpay (India, INR settlement) and PayPal (international, USD settlement), both live, with a PPP-tier + customer-segment pricing engine (`utils/pppPricing.ts`, `utils/pricing/sessionPricing.ts`) already covering all countries, not just the three named in the brief.
- **Motion**: `motion` (Framer Motion) — `ScrollReveal`, `ScrollStory` (pinned scroll-scrubbed hero), `HoverLift` (pointer-tracked 3D tilt), all with `prefers-reduced-motion` fallbacks already implemented.
- **SEO groundwork**: `app/robots.ts`, `app/sitemap.ts`, per-page metadata, JSON-LD, already built in an earlier phase of this project (not new in this pass).
- **Deployment**: Vercel, custom domain `www.strentor.com`.
- **No CMS**: content lives in TSX/config files, not a headless CMS. Pricing already centralized in `utils/pricing/sessionPricing.ts` and `config/regionalPlans.ts`.

## 2. What this pass actually changed

Given the size of the full 26-section brief this repo received, this pass implemented the single highest-leverage slice — the homepage repositioning — rather than attempting all 13 pages, a new multi-step form, and six documentation files in one shot. See "What was not done" below for the honest remainder.

Changed:

- **`app/page.tsx`** — full content rewrite following the brief's Section 8 homepage architecture: Hero ("Built for More."), More Than Rehabilitation, Who STRENTOR Is For (with a "this may not be right for you" panel), Four Dimensions (Physical/Mental/Emotional/Purpose — replacing the old generic feature list), The STRENTOR Method (Break/Build/Become), Built Around the Individual, Outcomes (with an explicit no-guarantee disclaimer), Transformation Stories (reused the existing, real `Testimonials` component), Founder Credibility teaser, Programs (assessment-first, no per-session pricing), International Relevance, Final CTA. Existing infra reused, not rebuilt: `ScrollStory`, `ScrollReveal`, `HoverLift`, `FloatingLogoScene`.
- **The interactive per-session `Pricing` calculator was removed from the homepage.** It previously sat directly on the homepage and led with a live ₹/session figure — in direct conflict with the brief's Section 12 ("The homepage should not frame STRENTOR as a ₹1,000-per-session service"). It is untouched and still live at `/pricing` and `/programs/fitness-training` for visitors who specifically want transactional detail.
- **`components/landing/Header.tsx`** — nav relabeled to the brief's Section 7 structure (Home / The STRENTOR Method / Programs / Transformation Stories / About / Resources / Corporate Partnerships), primary CTA changed from "Apply Now" to "Apply for Coaching" (still routes to the existing `/apply-for-access` — no URL/route changes made). "The STRENTOR Method" and "Transformation Stories" link to `#method` / `#stories` anchors on the new homepage, since dedicated pages for these don't exist yet (see below).
- **`components/programs/fitness/Transformations.tsx`** — removed a live medical claim ("Manage or **Reverse** Chronic Health Issues Like Diabetes or Thyroid Problems") that directly violated the brief's Section 24 constraint against medical claims. This was real, shipped copy on `/programs/fitness-training`, not a hypothetical.
- **`components/landing/Banner.tsx`** — deleted. It was dead code (not imported anywhere) and contained an unverifiable claim ("Join hundreds of individuals who have transformed their lives with STRENTOR") that the brief explicitly calls out as a category of claim not to make without evidence. Removing it now prevents it from being reintroduced later.

## 3. Pass 2 — Performance Assessment routing fix

The first pass pointed every new "Take the Performance Assessment" CTA at `/assessment` without first checking what that route actually does. On inspection it turned out to be the wrong tool for that CTA:

- `/assessment` is a **public**-in-name but **authenticated-only** "Readiness Assessment" — it hard-redirects anonymous visitors to sign up/sign in before they can answer a single question, and it scores physical training-safety red flags (pain, fatigue, medical clearance), not business/ambition fit. It's a real, working feature (built earlier in this project, with its own Prisma tables and a scoring engine), just not the right destination for a first-touch marketing CTA aimed at anonymous visitors.
- `/apply-for-access` turned out to be the actual match for the brief's Section 9 "Performance Assessment": it's public, no account required, and already runs a comprehensive multi-step intake (`components/forms/intake/IntakeForm.tsx`, 1,180 lines — contact details, coaching context, movement profile, health boundaries, recovery/nutrition, goals/identity, consent) backed by a real `intake_submissions` table and an admin review queue.

Fixed in this pass:

- All three homepage "Take the Performance Assessment" CTAs now point to `/apply-for-access` instead of `/assessment`.
- `/apply-for-access` itself (hero copy, 4-step process labels, eligibility list, form section heading, its `<title>`/meta description) was rewritten to match the new positioning — "Performance Assessment" / "Apply for Private Coaching" instead of "Access Application" / "Apply for a STRENTOR Access Seat", and the eligibility list no longer states "living with physical challenges, health realities, or long-term conditions" as a qualifying criterion (diagnosis-led framing the brief specifically asks to move away from). The 4-step labels now track the brief's Section 11 application process (Assessment → Review → Discovery Conversation → Coaching Begins).
- Added an explicit line under the form: "This is not a medical intake form, and STRENTOR coaching does not replace medical care" — directly addressing the brief's Section 9 instruction not to make it feel like one.

**Not done**: the underlying `IntakeForm.tsx` itself was intentionally left untouched. It is comprehensive, working infrastructure, and its "personal" pathway does dive into genuinely clinical territory (Section 6 of `types/intake.ts` — pressure injury history, catheter/bladder/bowel routine, dialysis/CKD instructions) that reads as more medical-intake-like than the brief's lighter Section 9 field list (occupation, ambition, investment readiness, etc.) describes. Rebuilding it as a lighter first-touch qualification step, with the clinical detail collected later at onboarding instead of at first contact, is a real product decision — not something to change unilaterally by editing a 1,180-line form. Flagged for a business decision, not fixed here.

## 4. Pass 3 — Programs page rebuilt as a real hub

`/programs` was still entirely built around a single legacy offer — "The 12-Week STRENTOR Holistic Strength Program" — with an "Access-Based Pricing" table (Fully Sponsored / Self-Funded / Pay-It-Forward seats, all at a flat ₹74,999). It did not link to any of the newer program pages that already exist in the codebase (`/programs/elite-mentorship`, `/programs/flagship-transformation`, `/programs/membership`, `/programs/starter-kit`, `/programs/ai-coaching`, `/programs/fitness-training`) — they were built in an earlier phase of this project but never surfaced from the main Programs page, so a visitor browsing `/programs` would never discover them.

Fixed in this pass:

- Rebuilt `/programs` as a real hub: hero reframed around "coaching matched to your goals and readiness" instead of one fixed 12-week product; the old pricing table replaced with a grid of 7 cards, each linking to a genuinely existing program page (Elite Mentorship, Flagship Transformation, Strength & Performance Coaching, Strength Circle, 7-Day Starter Kit, AI Coaching, Corporate & Institutional Programs via `/corporate`). No program on this grid was invented — every card links to a page that already exists and builds successfully.
- This directly implements the brief's Section 10 structure (tiered programs by support intensity, assessment-first rather than price-first) using only real, already-built pages, per Section 24's "do not invent program availability."
- Sponsorship ("Sponsor a Seat") demoted from a co-equal primary button to a smaller secondary text link in the final CTA — kept reachable (real, working pathway), but no longer presented as equally weighted against the core coaching offer, which is a partial, moderate answer to the still-open Section 4 item below (full resolution needs a business decision, not a copy tweak).
- Updated `/programs`'s metadata (title/description) off the old "12-Week Program, access-based pricing" framing.

## 5. Pass 4 — Transformation Stories page built

"Transformation Stories" was a primary nav item pointing at `/#stories`, a homepage anchor — not a real, independently indexable page, and item #1 in the "not done" list below at the time.

Fixed in this pass:

- Built `/transformation-stories` (new page + layout with its own metadata), presenting the same real, named testimonials already live on the homepage — nothing invented. Per the brief's explicit instruction for this exact situation ("If the repository contains only basic testimonials, preserve the authentic quotes and present them cleanly without fabricating case-study information... use truthful placeholder labels where information is unavailable"), the page does not dress the three quotes up with invented starting points, durations, or measurable outcomes. It includes an honest "Detailed transformation stories... coming soon" note instead.
- Extracted the testimonial data out of `components/landing/Testimonials.tsx` into `data/testimonials.ts`, a single source of truth now shared by the homepage carousel and the new page — avoids the two ever drifting out of sync. (This required a build-time fix: importing a named export from a `"use client"` component file into a Server Component page failed at build with a runtime `TypeError`, not just a lint warning — moving the data to a plain, non-client module resolved it. Caught by running the full production build, not just typecheck.)
- Header's "Transformation Stories" nav link now points to the real page instead of the anchor; the homepage testimonials section gained a "Read all transformation stories" link to it; added to `app/sitemap.ts`.
- Fixed the item flagged in Pass 2 about `components/landing/Testimonials.tsx` not respecting `prefers-reduced-motion`: the carousel's `setInterval`-driven auto-scroll now stops under reduced motion, falling back to a static grid — consistent with every other motion primitive in this codebase.

## 6. Pass 5 — The STRENTOR Method page built

"The STRENTOR Method" was the last primary nav item still pointing at a homepage anchor (`/#method`) rather than a real page.

Fixed in this pass:

- Built `/the-strentor-method`: expands the homepage's compact Break/Build/Become summary into a full page — each stage gets four concrete sub-points (not just the one-line description used on the homepage), plus a recap of the four coaching dimensions (Physical/Mental/Emotional/Purpose).
- Cross-links to `/coaching` for visitors who want the operational detail (assessment process, session structure, safety principles, FAQ) — that page already covers this well and wasn't duplicated.
- Header's "The STRENTOR Method" nav link now points to the real page; homepage's own method section gained a "Read the full method" link to it; added to `app/sitemap.ts`.
- No new claims: every point on this page restates what's already asserted on the homepage or `/coaching`, just organized and expanded — nothing new was invented about the methodology.

With this, every item in the brief's Section 7 primary nav now has a real, dedicated page except where a nav item deliberately points to functioning existing pages (Programs, About, Resources, Corporate Partnerships).

## 7. Problems identified but NOT fixed in this pass

These are real, found during this audit, and require either more implementation time or business/legal input before they can be resolved:

1. **"Sponsor a Seat" / donor-funded seat language still exists** (`/sponsor-a-seat`, `config/accessTiers.ts`, `config/sponsorshipOptions.ts`) and is real, functioning business infrastructure (an actual donor-funded-seat program), not fabricated content. It's now a secondary link rather than a co-primary CTA on `/programs`, but the page itself, its nav visibility, and its underlying ₹74,999 flat pricing (which may or may not still be current — see the content verification doc) were not touched. This needs an explicit call from STRENTOR on whether sponsorship stays as a secondary pathway (recommended) or is phased out.
2. **The `/assessment` "Readiness Assessment" tool now has no inbound marketing links from the homepage**, since its actual purpose (post-signup training-safety screening) doesn't match a first-touch CTA. It's still reachable from wherever it was linked before this pass (e.g. post-onboarding flows) — that was not audited in this session.
3. **Individual program pages themselves were not rewritten** — `/programs/elite-mentorship`, `/programs/flagship-transformation`, etc. keep whatever copy they already had. Only the hub page linking to them was rebuilt in this pass.
4. **Regional form fields (timezone, preferred communication method) from Section 12 were not added.** The existing `IntakeForm` already collects city and country; the checkout flow separately collects city and customer segment (built earlier in this project). Neither collects timezone or communication preference.
5. **`IntakeForm.tsx`'s single, undifferentiated consent checkbox** (covering both operational contact and the form's genuinely clinical fields) was not split into separate operational/marketing/health-specific consent as the brief's Section 9 asks for — this needs a legal decision on required wording first. See `STRENTOR_Privacy_Review_Required.md`.

## 9. Pass 6 — Corporate/Resources/FAQ, analytics events, and metadata fallback fix

- **`/corporate`**: reviewed against the brief in full — it already avoided charity framing and fabricated numbers (explicitly states "STRENTOR is deliberately not positioned as a charity initiative"). Only its CTA label was aligned to "Discuss a Partnership" for consistency with the Programs hub.
- **`/resources`**: found and fixed two real broken/misdirected internal links — "STRENTOR Readiness Checklist" and "Adaptive Strength Readiness Assessment" cards linked to a generic `/contact` form instead of the real, already-built `/readiness-checklist` and `/assessment` pages.
- **`/faq`**: new page built from scratch, answering the brief's exact Section 16 question list. The old `components/landing/FAQSection.tsx` was dead code (unused anywhere) carrying badly stale, diagnosis-led copy ("built primarily for wheelchair users... with spina bifida, CKD... chronic health realities") and was deleted.
- **`components/landing/Footer.tsx`**: found still running the pre-repositioning "Quick Links" structure (12-Week Program, Apply for Access, Sponsor a Seat, Impact, Partner With Us) several passes after the Header was rebuilt — brought back in sync, with FAQ added.
- **`app/layout.tsx`**: the root fallback title/description (used by any page without its own, and inherited into Open Graph/Twitter cards by any page that sets its own `title`/`description` but not its own `openGraph`/`twitter`) was still the old diagnosis-led copy. Fixed. The homepage now also sets its own explicit `openGraph`/`twitter` block — before this fix, sharing the homepage link on social media would have shown the *old* stale title/description in the preview card even though the on-page title had already been rewritten in Pass 1.
- **Real analytics events implemented** (not just specified): `utils/analytics.ts` (a type-safe `trackEvent` helper) and `components/analytics/TrackedLink.tsx`, wired into 6 real call sites — the homepage's 3 Performance Assessment CTAs, the Programs hub's card links, and Corporate's 2 "Discuss a Partnership" CTAs. Full taxonomy, including events specified but not wired, in `STRENTOR_Analytics_Events.md`.
- Also flagged, not fixed: a likely site-wide title-templating issue (`"%s | Strentor"` template applied to page titles that already contain "STRENTOR", potentially producing "STRENTOR ... | Strentor" duplication) — too broad and unverifiable without a live browser to fix blind in this pass.

## 10. What was verified before shipping

- `npx tsc --noEmit --skipLibCheck` — clean, after every pass.
- `npm run build` — clean after every pass, all routes (including every new page) prerender/build successfully.
- Manual read-through of every new/changed section against the brief's explicit "do not invent" constraints (Section 24) — no new numeric claims, no new credentials, no new testimonials, no program-availability claims were introduced anywhere in this engagement.
- Grepped the full public-facing codebase for forbidden claim patterns ("hundreds", "% success rate", "spots left", "guaranteed", "cure", "reverse") at multiple points across this engagement — found and fixed the two real hits documented above and in `STRENTOR_Website_Content_Verification.md`.

No broken-link check, no cross-browser check, no Lighthouse/Core Web Vitals run, and no screen-reader pass were performed in this session — flagged here rather than silently skipped.
