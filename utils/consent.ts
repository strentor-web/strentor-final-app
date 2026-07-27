"use client";

// Tracking-consent state, stored client-side only (localStorage) — no
// server round-trip, no cookie sent to the backend. Deliberately a plain
// three-state value (never decided / accepted / rejected) rather than
// per-category toggles (analytics vs. marketing) — see
// STRENTOR_Privacy_Review_Required.md for why a finer-grained model may
// ultimately be required, and why this file implements a conservative
// single accept/reject gate in the meantime.
export type ConsentStatus = "accepted" | "rejected" | null;

const STORAGE_KEY = "strentor_tracking_consent";

export function getStoredConsent(): ConsentStatus {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(STORAGE_KEY);
  return value === "accepted" || value === "rejected" ? value : null;
}

export function setStoredConsent(status: "accepted" | "rejected"): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, status);
}
