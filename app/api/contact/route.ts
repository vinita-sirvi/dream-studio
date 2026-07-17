import { NextRequest } from "next/server";

import { sendEmail } from "@/lib/email";
import { connectToDatabase } from "@/lib/mongodb";
import { errorResponse, serialize, successResponse } from "@/lib/http";
import { SupportTicket } from "@/lib/models";
import { contactSchema } from "@/lib/validators";
import { getAdminEmails, env } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  await connectToDatabase();
  const payload = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(payload);

  if (!parsed.success) {
    return errorResponse("Invalid contact form submission.", 400, parsed.error.flatten());
  }

  const ticket = await SupportTicket.create({
    ...parsed.data,
    ticketId: `TKT-${Date.now()}`,
    source: "contact-form",
  } as any);

  const adminTargets = getAdminEmails();
  const to = adminTargets.length > 0 ? adminTargets : env.RESEND_FROM_EMAIL ? [env.RESEND_FROM_EMAIL] : [];

  if (to.length > 0) {
    await sendEmail({
      to,
      subject: `New Contact Ticket: ${parsed.data.subject}`,
      text: `${parsed.data.name} (${parsed.data.email}) sent a contact message.`,
      html: `<p><strong>${parsed.data.name}</strong> (${parsed.data.email}) sent a contact message.</p><p>${parsed.data.message}</p>`,
    });
  }

  return successResponse(serialize(ticket), 201);
}
