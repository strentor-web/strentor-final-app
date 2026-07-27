import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/utils/prisma/prismaClient";
import { sendIntakeNotification } from "@/utils/email/resend";

// Public, unauthenticated endpoint — no login required, backing the
// /transformation-stories/share form. Writes to site_testimonials, not the
// authenticated "testimonials" table (that one is for logged-in clients
// via /community and goes through admin moderation — see
// app/api/testimonials/submit/route.ts). This endpoint publishes
// immediately on submission, so the rate limit and honeypot below are the
// only things standing between this and open spam.
const payloadSchema = z.object({
  name: z.string().trim().min(1).max(200),
  testimonial: z.string().trim().min(20).max(2000),
  context: z.string().trim().max(300).optional(),
  consent: z.literal(true),
  sourcePage: z.string().max(200).optional(),
  // Honeypot — real visitors never see or fill this field (hidden via CSS
  // in the form). A bot filling in every field will fill this one too.
  website: z.string().max(0).optional().or(z.literal("")),
});

// Same per-instance rate-limit pattern as /api/intake/submit — see that
// file's comment for why this approach (not distributed, no new infra).
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const MAX_TRACKED_ENTRIES = 5000;

const rateLimitHits = new Map<string, number[]>();

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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
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

  const { name, testimonial, context, sourcePage, website } = parsed.data;

  // Honeypot tripped — pretend success so the bot doesn't learn to avoid
  // this field, but don't write anything to the database.
  if (website) {
    return NextResponse.json({ success: true });
  }

  const created = await prisma.site_testimonials.create({
    data: {
      name_display: name,
      testimonial_text: testimonial,
      context: context || undefined,
      consent_given: true,
      is_published: true,
      source_page: sourcePage,
    },
  });

  // Best-effort notification so the team knows a new story went live —
  // non-fatal, the testimonial is already published regardless.
  try {
    await sendIntakeNotification({
      to: "adityamandan@strentor.com",
      subject: `New testimonial published: ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 560px;">
          <p>A new testimonial was submitted and published immediately on <strong>/transformation-stories</strong>.</p>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          ${context ? `<p><strong>Context:</strong> ${escapeHtml(context)}</p>` : ""}
          <p><strong>Testimonial:</strong></p>
          <p style="white-space: pre-wrap;">${escapeHtml(testimonial)}</p>
          <p style="color:#666;font-size:13px;">Submitted from: ${escapeHtml(sourcePage || "unknown")}. Record id: ${created.id}. To unpublish, set is_published=false on this row.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send testimonial notification email:", error);
  }

  return NextResponse.json({ success: true, id: created.id });
}
