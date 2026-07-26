"use client";

// Canonical event names — see STRENTOR_Analytics_Events.md for the full
// taxonomy, including events specified but not yet wired into a call site.
export type AnalyticsEvent =
  | "hero_cta_click"
  | "program_view"
  | "corporate_enquiry_intent"
  | "assessment_form_intent";

// Deliberately narrow: only primitive, non-identifying values are accepted.
// This file is the single choke point analytics events pass through before
// reaching Google Analytics, so it doubles as a type-level guarantee that no
// name, email, phone number, or free-text (possibly health-related) field
// can be sent from a call site — see STRENTOR_Privacy_Review_Required.md.
export type AnalyticsParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(event: AnalyticsEvent, params?: AnalyticsParams): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", event, params);
}
