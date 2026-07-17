import { Resend } from "resend";

const resendClient = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Strentor <noreply@strentor.com>";
const SITE_URL = "https://www.strentor.com";

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

  return resendClient.emails.send({
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

  return resendClient.emails.send({
    from: FROM_EMAIL,
    to,
    cc,
    replyTo,
    subject,
    html,
  });
}
