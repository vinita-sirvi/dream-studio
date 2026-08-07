import { env } from "./env";

export type EmailMessage = {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
};

/**
 * Escape a value before interpolating it into an email's HTML body.
 *
 * The notification emails for the contact form and custom-order brief built their
 * HTML by interpolating submitted fields directly, so a visitor could inject
 * markup — including a link or a form — into a message the studio's staff read and
 * trust. Escaping is cheap; treating any submitted text as HTML is not.
 */
export function escapeEmailHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Send an email, swallowing any failure.
 *
 * Use this for anything sent *after* a database write has already succeeded — an
 * order confirmation, an OTP. `sendEmail` throws on a non-2xx from Resend, so
 * awaiting it directly in a route handler turns "the mail provider is having a
 * bad minute" into a 500 for a customer whose order was in fact saved. The
 * failure is logged so it is still visible in server logs.
 */
export async function sendEmailQuietly(message: EmailMessage) {
  try {
    await sendEmail(message);
    return { ok: true as const };
  } catch (error) {
    console.error("[email] delivery failed", {
      subject: message.subject,
      error: error instanceof Error ? error.message : error,
    });
    return { ok: false as const };
  }
}

export async function sendEmail(message: EmailMessage) {
  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL) {
    return { skipped: true as const };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.RESEND_FROM_EMAIL,
      to: message.to,
      subject: message.subject,
      html: message.html,
      text: message.text,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend request failed: ${response.status} ${body}`);
  }

  return response.json();
}
