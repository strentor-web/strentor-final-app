# STRENTOR Privacy Review Required

Date: 2026-07-26

This is a developer-facing list of implementation areas that need review by qualified counsel before production release, aimed at India (DPDP Act), UAE, and Singapore (PDPA) — the three primary markets named in the repositioning brief. **Nothing in this document constitutes legal advice or a compliance determination.** Every item below was found by reading the actual code in this repository, not assumed.

## 1. Third-party trackers fire unconditionally, site-wide, with no consent mechanism

`app/layout.tsx` loads, on every single page load across the entire application (marketing pages, the multi-step intake form, the authenticated dashboard, checkout):

- **Google Analytics** (`@next/third-parties/google`, `gaId="G-MBX9B1QQXM"`)
- **Meta/Facebook Pixel** (`fbq('init', ...)`, `fbq('track', 'PageView')`, plus a `<noscript>` tracking pixel `<img>`)

Both load via `strategy="afterInteractive"` / the Next.js third-party script pattern — neither is gated behind a cookie-consent banner or any opt-in mechanism. **Searched the codebase for a consent-banner component and found none.** This means every visitor, including one mid-way through submitting the health-related sections of the intake form (see item 2), is being tracked by two third-party ad/analytics platforms by default.

**Needs legal review**: whether this requires a consent banner (GDPR-style, relevant if any EU visitors occur despite the primary markets being India/UAE/Singapore), what DPDP Act and PDPA actually require here, and whether Meta Pixel specifically needs to be gated or removed from pages where sensitive data is being entered.

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
