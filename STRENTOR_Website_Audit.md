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

## 3. Problems identified but NOT fixed in this pass

These are real, found during this audit, and require either more implementation time or business/legal input before they can be resolved:

1. **No dedicated "Transformation Stories" or "The STRENTOR Method" pages exist.** The new header links to homepage anchors as an interim measure. Building these as standalone pages (with their own metadata, and in the Stories case, more testimonial detail than currently exists) is unbuilt.
2. **No multi-step "Performance Assessment" intake exists as specified in Section 9.** `/assessment` exists and is functional (a "Readiness Assessment" with a deterministic scoring engine, built earlier in this project), and every new CTA on the homepage now points to it — but it does not collect the specific fields the brief lists (occupation, wheelchair type, investment-readiness range, etc.). It has not been rebuilt.
3. **`components/landing/Testimonials.tsx` auto-scrolls on a `setInterval` regardless of `prefers-reduced-motion`.** Every other motion primitive in this codebase (`ScrollReveal`, `ScrollStory`, `HoverLift`) respects it; this one, which predates that work, does not. Flagged, not fixed, in this pass.
4. **"Sponsor a Seat" / donor-funded seat language still exists** (`/sponsor-a-seat`, `config/accessTiers.ts`, `config/sponsorshipOptions.ts`) and is real, functioning business infrastructure (an actual donor-funded-seat program), not fabricated content. The brief asks the site to lead with premium-performance positioning rather than charity framing — this pass did not touch that page or remove it from navigation, because doing so would remove a live, working funding pathway without a business decision to do so. This needs an explicit call from STRENTOR on whether sponsorship stays as a secondary pathway (recommended) or is phased out.
5. **Twelve of the thirteen pages listed in Section 20 were not rebuilt**: The STRENTOR Method, Transformation Stories, Programs (structural rework per Section 10's tiering), Performance Assessment (rebuild), Corporate Partnerships, Resources, FAQ (redesign per Section 16), and others exist in some form already but were not rewritten to match the brief's specific copy and structure in this pass.
6. **No analytics event taxonomy, privacy review, or prelaunch checklist docs were produced.** `STRENTOR_Analytics_Events.md` and `STRENTOR_Privacy_Review_Required.md` and `STRENTOR_Prelaunch_Checklist.md` from the brief's Section 22 are not included in this pass — see the top-level conversation summary for why.
7. **Accessibility**: nothing in this pass regressed existing accessibility (the homepage rebuild reused the same accessible motion primitives), but no dedicated WCAG 2.2 AA audit was run against the new homepage content specifically (heading order, contrast on new copy blocks, etc.) beyond what a normal build/typecheck catches.
8. **Regional form fields (country/city/timezone/currency/communication preference) from Section 12 were not added anywhere** — the existing `/checkout` flow already collects city and customer segment (built earlier in this project) but not timezone or preferred communication method, and the assessment form wasn't touched.

## 4. What was verified before shipping

- `npx tsc --noEmit --skipLibCheck` — clean.
- `npm run build` — clean, all routes (including the rebuilt homepage) prerender/build successfully.
- Manual read-through of every new homepage section against the brief's explicit "do not invent" constraints (Section 24) — no new numeric claims, no new credentials, no new testimonials, no program-availability claims were introduced.

No broken-link check, no cross-browser check, no Lighthouse/Core Web Vitals run, and no screen-reader pass were performed in this session — flagged here rather than silently skipped.
