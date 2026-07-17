import { env } from "./env";

export type EmailMessage = {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
};

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
