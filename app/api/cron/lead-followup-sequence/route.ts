import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma/prismaClient";
import { sendLeadFollowUpEmail } from "@/utils/email/resend";

function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

function fillMergeTags(template: string, submission: { full_name: string; pathway: string; city: string | null; country: string | null }) {
  return template
    .replaceAll("{{full_name}}", submission.full_name)
    .replaceAll("{{pathway}}", submission.pathway)
    .replaceAll("{{city}}", submission.city || "")
    .replaceAll("{{country}}", submission.country || "");
}

const ACTIVE_STATUSES = ["new", "contacted"];

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  const templates = await prisma.lead_followup_templates.findMany({ where: { is_active: true } });

  let checked = 0;
  let sent = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const template of templates) {
    const cutoff = new Date(now.getTime() - template.delay_days * 24 * 60 * 60 * 1000);

    const candidates = await prisma.intake_submissions.findMany({
      where: {
        ...(template.pathway ? { pathway: template.pathway } : {}),
        status: { in: ACTIVE_STATUSES },
        sequence_paused: false,
        created_at: { lte: cutoff },
        lead_followup_sends: { none: { template_id: template.id } },
      },
    });

    for (const submission of candidates) {
      checked++;

      const suppressed = await prisma.email_suppressions.findUnique({ where: { email: submission.email } });
      if (suppressed) {
        skipped++;
        continue;
      }

      try {
        await sendLeadFollowUpEmail({
          to: submission.email,
          subject: fillMergeTags(template.subject, submission),
          bodyHtml: fillMergeTags(template.body, submission).replace(/\n/g, "<br />"),
          unsubscribeToken: submission.unsubscribe_token,
        });

        await prisma.lead_followup_sends.create({
          data: { submission_id: submission.id, template_id: template.id, status: "sent" },
        });

        sent++;
      } catch (error) {
        const message = error instanceof Error ? error.message : "unknown error";
        errors.push(`submission ${submission.id} / template ${template.id}: ${message}`);
        // Record the failed attempt too — without this, a persistently
        // failing send (bad address, etc.) would be retried every run
        // forever since there'd never be a lead_followup_sends row to dedup
        // against.
        await prisma.lead_followup_sends
          .create({
            data: { submission_id: submission.id, template_id: template.id, status: "failed", error_message: message },
          })
          .catch(() => {});
      }
    }
  }

  return NextResponse.json({
    success: true,
    checked,
    sent,
    skipped,
    errors,
    timestamp: now.toISOString(),
  });
}
