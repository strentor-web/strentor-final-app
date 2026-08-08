import { Resend } from "resend";
import type { CreateEmailResponseSuccess } from "resend";

const resendClient = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Strentor <noreply@strentor.com>";
const SITE_URL = "https://www.strentor.com";

// resend.emails.send() resolves normally even when the API rejects the
// send (bad/unverified from-address, invalid or restricted API key,
// quota exceeded, etc.) — it never throws for those, it just returns
// { data: null, error: {...} }. Every call site below awaited the promise
// and returned it directly without checking `.error`, so a real send
// failure looked identical to success: the intake route (and the
// subscription-reminder cron) would log nothing useful and report success
// upstream while no email ever went out. This turns that into a thrown
// error carrying Resend's actual error message, so callers' existing
// try/catch blocks actually catch it.
async function sendOrThrow(payload: Parameters<Resend["emails"]["send"]>[0]): Promise<CreateEmailResponseSuccess> {
  const result = await resendClient!.emails.send(payload);
  if (result.error) {
    throw new Error(`Resend API error (${result.error.name}): ${result.error.message}`);
  }
  return result.data;
}

interface RenewalReminderParams {
  to: string;
  name: string;
  planName: string;
  amount: number;
  chargeDate: Date;
  daysUntilCharge: 3 | 1;
}

export async function sendSubscriptionRenewalReminder({
  to,
  name,
  planName,
  amount,
  chargeDate,
  daysUntilCharge,
}: RenewalReminderParams) {
  if (!resendClient) {
    console.error("RESEND_API_KEY is not configured; skipping renewal reminder email.");
    return { skipped: true };
  }

  const formattedDate = chargeDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const formattedAmount = amount.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
  const dayLabel = daysUntilCharge === 3 ? "in 3 days" : "tomorrow";

  const subject = `Your Strentor ${planName} plan renews ${dayLabel}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #111;">
      <h2 style="color: #C9A96A;">Your subscription renews ${dayLabel}</h2>
      <p>Hi ${name},</p>
      <p>
        This is a reminder that your <strong>${planName}</strong> subscription will
        automatically renew on <strong>${formattedDate}</strong> for
        <strong>${formattedAmount}</strong>.
      </p>
      <p>No action is needed if you'd like to continue. If you want to change your plan or cancel, you can do so anytime from your subscription settings.</p>
      <p style="margin: 24px 0;">
        <a href="${SITE_URL}/settings/subscription" style="background: #C9A96A; color: #000; padding: 12px 24px; border-radius: 999px; text-decoration: none; font-weight: bold;">
          Manage Subscription
        </a>
      </p>
      <p style="color: #666; font-size: 14px;">— The Strentor Team</p>
    </div>
  `;

  return sendOrThrow({
    from: FROM_EMAIL,
    to,
    subject,
    html,
  });
}

interface IntakeNotificationParams {
  to: string;
  cc?: string[];
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendIntakeNotification({ to, cc, subject, html, replyTo }: IntakeNotificationParams) {
  if (!resendClient) {
    console.error("RESEND_API_KEY is not configured; skipping intake notification email.");
    return { skipped: true };
  }

  return sendOrThrow({
    from: FROM_EMAIL,
    to,
    cc,
    replyTo,
    subject,
    html,
  });
}

interface WebinarRegistrationConfirmationParams {
  to: string;
  name: string;
  webinarTitle: string;
  startsAt: Date;
  joinUrl: string;
}

function formatWebinarTime(startsAt: Date) {
  return startsAt.toLocaleString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
    timeZoneName: "short",
  });
}

export async function sendWebinarRegistrationConfirmation({
  to,
  name,
  webinarTitle,
  startsAt,
  joinUrl,
}: WebinarRegistrationConfirmationParams) {
  if (!resendClient) {
    console.error("RESEND_API_KEY is not configured; skipping webinar registration confirmation email.");
    return { skipped: true };
  }

  const subject = `You're registered: ${webinarTitle}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #111;">
      <h2 style="color: #C9A96A;">You're registered!</h2>
      <p>Hi ${name},</p>
      <p>
        You're confirmed for <strong>${webinarTitle}</strong> on
        <strong>${formatWebinarTime(startsAt)}</strong>.
      </p>
      <p>We'll email you a reminder before it starts. You can join using the link below at the scheduled time.</p>
      <p style="margin: 24px 0;">
        <a href="${joinUrl}" style="background: #C9A96A; color: #000; padding: 12px 24px; border-radius: 999px; text-decoration: none; font-weight: bold;">
          Join Link
        </a>
      </p>
      <p style="color: #666; font-size: 14px;">— The Strentor Team</p>
    </div>
  `;

  return sendOrThrow({ from: FROM_EMAIL, to, subject, html });
}

interface LeadFollowUpEmailParams {
  to: string;
  subject: string;
  bodyHtml: string;
  unsubscribeToken: string;
}

// The unsubscribe footer is built in here, not left to each caller to
// remember — every automated lead follow-up email must carry it. See
// app/api/unsubscribe/route.ts for the endpoint this links to.
export async function sendLeadFollowUpEmail({ to, subject, bodyHtml, unsubscribeToken }: LeadFollowUpEmailParams) {
  if (!resendClient) {
    console.error("RESEND_API_KEY is not configured; skipping lead follow-up email.");
    return { skipped: true };
  }

  const unsubscribeUrl = `${SITE_URL}/api/unsubscribe?token=${unsubscribeToken}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #111;">
      ${bodyHtml}
      <p style="margin-top: 32px; color: #999; font-size: 12px; border-top: 1px solid #eee; padding-top: 12px;">
        You're receiving this because you enquired with STRENTOR.
        <a href="${unsubscribeUrl}" style="color: #999;">Unsubscribe from follow-up emails</a>.
      </p>
    </div>
  `;

  return sendOrThrow({ from: FROM_EMAIL, to, subject, html });
}

interface WebinarReminderParams {
  to: string;
  name: string;
  webinarTitle: string;
  startsAt: Date;
  joinUrl: string;
  hoursUntil: 24 | 1;
}

export async function sendWebinarReminder({
  to,
  name,
  webinarTitle,
  startsAt,
  joinUrl,
  hoursUntil,
}: WebinarReminderParams) {
  if (!resendClient) {
    console.error("RESEND_API_KEY is not configured; skipping webinar reminder email.");
    return { skipped: true };
  }

  const whenLabel = hoursUntil === 24 ? "tomorrow" : "in about an hour";
  const subject = `Reminder: ${webinarTitle} starts ${whenLabel}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #111;">
      <h2 style="color: #C9A96A;">${webinarTitle} starts ${whenLabel}</h2>
      <p>Hi ${name},</p>
      <p>
        Just a reminder that <strong>${webinarTitle}</strong> starts
        <strong>${formatWebinarTime(startsAt)}</strong>.
      </p>
      <p style="margin: 24px 0;">
        <a href="${joinUrl}" style="background: #C9A96A; color: #000; padding: 12px 24px; border-radius: 999px; text-decoration: none; font-weight: bold;">
          Join Now
        </a>
      </p>
      <p style="color: #666; font-size: 14px;">— The Strentor Team</p>
    </div>
  `;

  return sendOrThrow({ from: FROM_EMAIL, to, subject, html });
}
