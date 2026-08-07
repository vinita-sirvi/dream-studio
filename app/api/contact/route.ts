import { NextRequest } from "next/server";

import { escapeEmailHtml, sendEmailQuietly } from "@/lib/email";
import { connectToDatabase } from "@/lib/mongodb";
import { errorResponse, successResponse } from "@/lib/http";
import { SupportTicket } from "@/lib/models";
import { contactSchema } from "@/lib/validators";
import { enforceRateLimit } from "@/lib/rate-limit";
import { getAdminEmails, env } from "@/lib/env";
import { generateReference } from "@/lib/reference";

export const dynamic = "force-dynamic";

/**
 * Contact form.
 *
 * Three fixes over the original: it is rate limited (it wrote a document and sent
 * an email per request, unthrottled); the submitted message is HTML-escaped before
 * going into the notification email; and a mail failure no longer 500s a request
 * whose ticket was saved successfully.
 */
export async function POST(request: NextRequest) {
  const limited = await enforceRateLimit("publicForm");
  if (limited) return limited;

  const payload = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(payload);

  if (!parsed.success) {
    return errorResponse(
      "Invalid contact form submission.",
      400,
      parsed.error.flatten(),
    );
  }

  await connectToDatabase();

  const ticket = await SupportTicket.create({
    ...parsed.data,
    ticketId: generateReference("TKT"),
    source: "contact-form",
  } as any);

  const adminTargets = getAdminEmails();
  const to =
    adminTargets.length > 0
      ? adminTargets
      : env.RESEND_FROM_EMAIL
        ? [env.RESEND_FROM_EMAIL]
        : [];

  if (to.length > 0) {
    await sendEmailQuietly({
      to,
      subject: `New contact ticket: ${parsed.data.subject}`,
      text:
        `${parsed.data.name} (${parsed.data.email}) sent a contact message.\n\n` +
        `${parsed.data.message}`,
      html:
        `<p><strong>${escapeEmailHtml(parsed.data.name)}</strong> ` +
        `(${escapeEmailHtml(parsed.data.email)}) sent a contact message.</p>` +
        `<p>${escapeEmailHtml(parsed.data.message).replace(/\n/g, "<br>")}</p>`,
    });
  }

  // Only the reference is returned. Echoing the whole stored document served no
  // purpose for the form and meant any future internal field on the model would
  // start leaking to the browser by default.
  return successResponse({ ticketId: (ticket as any).ticketId }, 201);
}
