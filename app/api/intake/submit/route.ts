import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendIntakeNotification } from "@/utils/email/resend";
import { PATHWAY_PRIMARY_EMAIL } from "@/utils/intake-routing";
import { PATHWAY_LABELS, EnquiryPathway } from "@/types/intake";

// Internal CC routing — deliberately not exported/shared with client code.
const PATHWAY_CC: Partial<Record<EnquiryPathway, string[]>> = {
  referral: ["intake@strentor.com"],
  corporate: ["csrpartnerships@strentor.com"],
};

const contactSchema = z.object({
  fullName: z.string().trim().min(1).max(200),
  age: z.string().trim().max(10).optional(),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(1).max(50),
  city: z.string().trim().min(1).max(100),
  country: z.string().trim().min(1).max(100),
  socialPlatform: z.string().trim().max(100).optional(),
  socialUrl: z.string().trim().max(500).optional(),
  preferredName: z.string().trim().max(200).optional(),
  height: z.string().trim().max(50).optional(),
  weight: z.string().trim().max(50).optional(),
  emergencyContact: z.string().trim().max(200).optional(),
  preferredContactMethod: z.array(z.string()).optional(),
});

const payloadSchema = z.object({
  pathway: z.enum([
    "personal",
    "family",
    "corporate",
    "referral",
    "sponsor",
    "sponsored_support",
    "referred_candidate",
    "general",
  ]),
  contact: contactSchema,
  coachingContext: z.any().optional(),
  movementProfile: z.any().optional(),
  healthBoundaries: z.any().optional(),
  recoveryNutrition: z.any().optional(),
  adaptiveSpecialistNotes: z.any().optional(),
  goalsIdentity: z.any().optional(),
  signatureName: z.string().trim().max(200).optional(),
  corporate: z.any().optional(),
  referral: z.any().optional(),
  sponsor: z.any().optional(),
  general: z.any().optional(),
  region: z.string().max(10).optional(),
  plan: z.string().max(100).optional(),
  sourcePage: z.string().max(200).optional(),
  consent: z.literal(true),
  submittedAt: z.string().trim().min(1).max(50),
});

// Best-effort, per-instance rate limiting and duplicate-submission guard.
// Not distributed (no Redis/Upstash configured for this project), but
// meaningfully raises the bar against basic spam and double-submits for
// a public contact form without adding new infra dependencies.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 8;
const DUPLICATE_WINDOW_MS = 60 * 1000;
const MAX_TRACKED_ENTRIES = 5000;

const rateLimitHits = new Map<string, number[]>();
const recentSubmissions = new Map<string, number>();

function pruneMap(map: Map<string, unknown>) {
  if (map.size <= MAX_TRACKED_ENTRIES) return;
  const keys = map.keys();
  for (let i = 0; i < map.size - MAX_TRACKED_ENTRIES; i++) {
    const next = keys.next();
    if (next.done) break;
    map.delete(next.value);
  }
}

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (rateLimitHits.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  hits.push(now);
  rateLimitHits.set(ip, hits);
  pruneMap(rateLimitHits);
  return hits.length > RATE_LIMIT_MAX_REQUESTS;
}

function isDuplicateSubmission(key: string): boolean {
  const now = Date.now();
  const last = recentSubmissions.get(key);
  recentSubmissions.set(key, now);
  pruneMap(recentSubmissions);
  return last !== undefined && now - last < DUPLICATE_WINDOW_MS;
}

function classifyReviewLevel(
  healthBoundaries: any,
  movementProfile: any
): "standard_fit_review" | "strentor_safety_review_needed" | "medical_clearance_likely_needed" {
  const clearanceFlags = [
    healthBoundaries?.medicalConditionAffectsTraining,
    healthBoundaries?.medicalClearance,
    healthBoundaries?.cardioMetabolicConcerns,
    healthBoundaries?.kidneyBladderConcerns,
    healthBoundaries?.woundSkinConcern,
  ];
  if (clearanceFlags.some((flag) => flag === "yes")) return "medical_clearance_likely_needed";

  const safetyFlags = [
    healthBoundaries?.medicationConsiderations,
    healthBoundaries?.allergyConsiderations,
    movementProfile?.balanceFallConcern,
    movementProfile?.painTriggersKnown,
    movementProfile?.transferDifficulty,
  ];
  if (safetyFlags.some((flag) => flag === "yes")) return "strentor_safety_review_needed";

  const unsureFlags = [
    healthBoundaries?.medicalConditionAffectsTraining,
    healthBoundaries?.medicalClearance,
    healthBoundaries?.cardioMetabolicConcerns,
  ];
  if (unsureFlags.some((flag) => flag === "unsure")) return "strentor_safety_review_needed";

  return "standard_fit_review";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderSection(title: string, data: Record<string, unknown> | undefined): string {
  if (!data) return "";
  const rows = Object.entries(data)
    .filter(([, value]) => value !== undefined && value !== null && value !== "" && !(Array.isArray(value) && value.length === 0))
    .map(([key, value]) => {
      const displayValue = Array.isArray(value) ? value.join(", ") : String(value);
      return `<tr><td style="padding:4px 12px 4px 0;color:#666;vertical-align:top;white-space:nowrap;">${escapeHtml(key)}</td><td style="padding:4px 0;">${escapeHtml(displayValue)}</td></tr>`;
    })
    .join("");
  if (!rows) return "";
  return `<h3 style="margin:20px 0 8px;color:#C9A96A;">${escapeHtml(title)}</h3><table style="border-collapse:collapse;font-size:14px;">${rows}</table>`;
}

export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request);
  if (isRateLimited(clientIp)) {
    return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = payloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }

  const data = parsed.data;
  const { pathway, contact } = data;

  const duplicateKey = `${clientIp}:${contact.email.toLowerCase()}:${pathway}`;
  if (isDuplicateSubmission(duplicateKey)) {
    // Same enquiry resubmitted within the window (double-click, retry) —
    // treat as a successful no-op rather than sending a duplicate email.
    return NextResponse.json({ success: true });
  }

  const primaryEmail = PATHWAY_PRIMARY_EMAIL[pathway];
  const ccEmails = PATHWAY_CC[pathway];
  const reviewLevel = classifyReviewLevel(data.healthBoundaries, data.movementProfile);

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 640px; color: #111;">
      <h2 style="color:#C9A96A;">New ${escapeHtml(PATHWAY_LABELS[pathway])}</h2>
      <p style="color:#666;font-size:13px;">Internal review level: <strong>${reviewLevel}</strong></p>
      ${renderSection("Contact", contact)}
      ${renderSection("Coaching Context & Goals", data.coachingContext)}
      ${renderSection("Movement Profile", data.movementProfile)}
      ${renderSection("Health Boundaries", data.healthBoundaries)}
      ${renderSection("Recovery & Nutrition", data.recoveryNutrition)}
      ${renderSection("Adaptive Specialist Notes", data.adaptiveSpecialistNotes)}
      ${renderSection("Goals & Identity", data.goalsIdentity)}
      ${renderSection("Signature", data.signatureName ? { signatureName: data.signatureName } : undefined)}
      ${renderSection("Corporate / CSR / NGO", data.corporate)}
      ${renderSection("Professional Referral", data.referral)}
      ${renderSection("Pay It Forward Sponsor", data.sponsor)}
      ${renderSection("General Enquiry", data.general)}
      ${renderSection("Context", {
        region: data.region,
        plan: data.plan,
        sourcePage: data.sourcePage,
        consentStatus: data.consent ? "Confirmed" : "Not confirmed",
        timestamp: data.submittedAt,
      })}
    </div>
  `;

  try {
    await sendIntakeNotification({
      to: primaryEmail,
      cc: ccEmails,
      replyTo: contact.email,
      subject: `[STRENTOR Intake] ${PATHWAY_LABELS[pathway]} — ${contact.fullName}`,
      html,
    });
  } catch (error) {
    console.error("Failed to send intake notification email:", error);
    return NextResponse.json({ error: "Failed to submit enquiry" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
