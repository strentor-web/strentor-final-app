# STRENTOR Privacy Review Required

Date: 2026-07-26

This is a developer-facing list of implementation areas that need review by qualified counsel before production release, aimed at India (DPDP Act), UAE, and Singapore (PDPA) — the three primary markets named in the repositioning brief. **Nothing in this document constitutes legal advice or a compliance determination.** Every item below was found by reading the actual code in this repository, not assumed.

## 1. Third-party trackers — RESOLVED (mechanism live; wording/model still needs counsel)

**Status update**: `app/layout.tsx` previously loaded Google Analytics and Meta/Facebook Pixel unconditionally, site-wide, with no consent mechanism. This is now fixed at the mechanism level: **`components/consent/AnalyticsConsent.tsx`** gates both trackers behind an explicit accept/reject banner (state stored client-side only, in `localStorage`, via `utils/consent.ts`). Neither tracker script loads, and no tracking request leaves the browser, until the visitor clicks "Accept." "Reject" is an equally-prominent button, not a dark pattern.

This was implemented as a **conservative, site-wide default** (block-until-consent everywhere) rather than trying to geo-detect which specific jurisdiction's rules apply to each visitor — this sandboxed environment has no way to reliably do that, and blocking-by-default is the safer failure mode if a stricter regime turns out to apply than expected.

**Still needs legal review**:
- The banner's exact wording (currently: "We use analytics and marketing cookies to understand site usage. They only load if you accept.") — a plain-English placeholder, not vetted copy.
- Whether a single accept/reject choice is sufficient, or whether DPDP Act / PDPA / any other applicable regime requires **per-category** consent (e.g. analytics vs. marketing/ads decided separately) — Meta Pixel and Google Analytics are currently gated together as one decision.
- Whether the current mechanism (client-side `localStorage`, no server record of consent) is sufficient, or whether a given jurisdiction requires a server-side, auditable consent record.

## 2. The intake form collects genuinely sensitive health data through a single, undifferentiated consent checkbox

`components/forms/intake/IntakeForm.tsx` (public, no login required, live at `/apply-for-access` among other places) collects, for the "personal" coaching track: movement/mobility/pain details, cardio-metabolic and kidney/bladder health concerns, medication and allergy considerations, and — in its "Adaptive Specialist Notes" section — pressure injury history, catheter/bladder/bowel routine, and dialysis/CKD instructions (see `types/intake.ts`, `AdaptiveSpecialistNotes` interface).

All of this is gated behind exactly **one** checkbox: `"I agree to be contacted by STRENTOR regarding this enquiry and consent to the information above"` (`IntakeForm.tsx` line ~1160). There is:

- No separate marketing-consent checkbox (the brief's Section 9 explicitly asks for operational consent and marketing consent to be separate, with marketing unticked by default).
- No distinctly-labeled consent specifically for the health-related fields, separate from general operational consent.
- A typed e-signature (`signatureName`) is collected for the personal track, which provides some acknowledgment trail, but it's tied to the same single checkbox.

**This was deliberately not modified in this pass** — `IntakeForm.tsx` is a large (1,180-line), working, unmodified component, and splitting its consent model is a data-model and legal-requirements decision, not a copy fix.

**Needs legal review**: whether DPDP Act / PDPA require explicit, separated consent for health data specifically (this is a common requirement in health-adjacent data protection regimes), and if so, the exact wording and UI split required.

## 3. Third-party data processors

Per `app/(public-pages)/privacy-policy/page.tsx`, the following third parties already process user data: **Resend** (transactional email), **Supabase** (auth + data storage), and unnamed **payment processors** (Razorpay confirmed live in code — India settlement; PayPal confirmed live in code — international settlement). Add to this list, not currently mentioned in the visible Privacy Policy copy as far as this review checked: **Google Analytics** and **Meta/Facebook Pixel** (see item 1).

**Needs legal review**: confirm the Privacy Policy's list of processors is complete and accurate, including the two ad/analytics trackers.

## 4. Cross-border data flow

Given the three primary markets (India, UAE, Singapore) plus "selected international markets," and Supabase/Resend/Razorpay/PayPal/Google/Meta all being non-domestic infrastructure relative to at least some of those markets:

**Needs legal review**: whether DPDP Act (India), UAE data protection law, and PDPA (Singapore) impose specific cross-border transfer requirements, and whether the current Privacy Policy addresses them.

## 5. Analytics events — verified safe by construction, not just by policy

This pass added real custom analytics events (see `STRENTOR_Analytics_Events.md`). They are implemented so that only fixed, non-identifying string params (e.g. `location: "hero"`) can be sent — the `AnalyticsParams` type in `utils/analytics.ts` makes it a type error to pass free text, names, or contact details through `trackEvent()`. This does **not** retroactively fix items 1–2 above (GA and Meta Pixel's own automatic behavior is unrelated to this custom-events layer), but it does mean nothing newly added in this pass introduces a fresh PII-to-analytics leak.

## 6. Data retention

No retention policy or automated deletion job was found in the codebase for `intake_submissions`, `assessments`, `checkout_attempts`, or other tables that accumulate personal/health-adjacent data over time.

**Needs a business/legal decision**: a defined retention period, and whether it needs to be implemented as code (a scheduled deletion job) or handled manually/administratively for now.

## 7. What this document does not cover

This review is scoped to what a code-level audit can surface (trackers, consent UI, data flows visible in source). It cannot and does not assess: the legal sufficiency of the Terms of Service or Privacy Policy's actual wording, DPDP Act/PDPA registration or grievance-officer requirements, payment processor PCI-DSS scope beyond what's already stated in the Privacy Policy, or any jurisdiction-specific licensing question about offering coaching services (as opposed to medical services) across India, the UAE, and Singapore. All of that requires qualified counsel, not a code review.
