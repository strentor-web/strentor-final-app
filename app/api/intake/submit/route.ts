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
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(1).max(50),
  city: z.string().trim().min(1).max(100),
  country: z.string().trim().min(1).max(100),
  socialPlatform: z.string().trim().max(100).optional(),
  socialUrl: z.string().trim().max(500).optional(),
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
  adaptiveTrainingProfile: z.any().optional(),
  healthSafety: z.any().optional(),
  nutrition: z.any().optional(),
  goals: z.any().optional(),
  corporate: z.any().optional(),
  referral: z.any().optional(),
  sponsor: z.any().optional(),
  general: z.any().optional(),
  region: z.string().max(10).optional(),
  plan: z.string().max(100).optional(),
  sourcePage: z.string().max(200).optional(),
});

function classifyReviewLevel(healthSafety: any): "standard_fit_review" | "strentor_safety_review_needed" | "medical_clearance_likely_needed" {
  const urgentFlags: string[] = healthSafety?.urgentFlags || [];
  const hasUrgent = urgentFlags.some((flag) => flag !== "none");
  if (hasUrgent) return "medical_clearance_likely_needed";

  const categories: string[] = healthSafety?.categories || [];
  const hasCategory = categories.some((c) => c !== "none_known");
  if (hasCategory) return "strentor_safety_review_needed";

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

  const primaryEmail = PATHWAY_PRIMARY_EMAIL[pathway];
  const ccEmails = PATHWAY_CC[pathway];
  const reviewLevel = classifyReviewLevel(data.healthSafety);

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 640px; color: #111;">
      <h2 style="color:#C9A96A;">New ${escapeHtml(PATHWAY_LABELS[pathway])}</h2>
      <p style="color:#666;font-size:13px;">Internal review level: <strong>${reviewLevel}</strong></p>
      ${renderSection("Contact", contact)}
      ${renderSection("Adaptive Training Profile", data.adaptiveTrainingProfile)}
      ${renderSection("Health & Safety Screening", data.healthSafety)}
      ${renderSection("Nutrition Context", data.nutrition)}
      ${renderSection("Goals", data.goals)}
      ${renderSection("Corporate / CSR / NGO", data.corporate)}
      ${renderSection("Professional Referral", data.referral)}
      ${renderSection("Pay It Forward Sponsor", data.sponsor)}
      ${renderSection("General Enquiry", data.general)}
      ${renderSection("Context", { region: data.region, plan: data.plan, sourcePage: data.sourcePage })}
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
