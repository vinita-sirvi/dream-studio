import { NextRequest } from "next/server";
import type { DbDoc, DbInput } from "@/lib/db-types";

import { escapeEmailHtml, sendEmailQuietly } from "@/lib/email";
import { ensureDatabase } from "@/lib/mongodb";
import { errorResponse, successResponse } from "@/lib/http";
import { CustomOrder } from "@/lib/models";
import { customOrderSchema } from "@/lib/validators";
import { enforceRateLimit } from "@/lib/rate-limit";
import { getAdminEmails, env } from "@/lib/env";
import { generateReference } from "@/lib/reference";
import { getCurrentSession } from "@/lib/session";

export const dynamic = "force-dynamic";

/**
 * Public commission brief.
 *
 * Rate limited, with escaped notification email and a collision-safe reference —
 * see `/api/contact` for the same three fixes. Additionally links the brief to the
 * signed-in user where there is one, so it can appear in their account.
 */
export async function POST(request: NextRequest) {
  const limited = await enforceRateLimit("publicForm");
  if (limited) return limited;

  const payload = await request.json().catch(() => null);
  const parsed = customOrderSchema.safeParse(payload);

  if (!parsed.success) {
    return errorResponse(
      "Invalid custom order submission.",
      400,
      parsed.error.flatten(),
    );
  }

  const offline = await ensureDatabase();
  if (offline) return offline;

  const session = await getCurrentSession();

  const order = await CustomOrder.create({
    ...parsed.data,
    userId: session?.user.id,
    orderId: generateReference("CO"),
    stage: "submitted",
  } as DbInput);

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
      subject: `New commission brief: ${parsed.data.productType}`,
      text:
        `${parsed.data.name} (${parsed.data.email}, ${parsed.data.phone}) ` +
        `submitted a commission brief for ${parsed.data.productType}.`,
      html:
        `<p><strong>${escapeEmailHtml(parsed.data.name)}</strong> ` +
        `(${escapeEmailHtml(parsed.data.email)}, ${escapeEmailHtml(parsed.data.phone)}) ` +
        `submitted a commission brief for ` +
        `<strong>${escapeEmailHtml(parsed.data.productType)}</strong>.</p>` +
        (parsed.data.specialInstructions
          ? `<p>${escapeEmailHtml(parsed.data.specialInstructions).replace(/\n/g, "<br>")}</p>`
          : ""),
    });
  }

  // Confirmation to the customer, so a brief does not feel like it vanished.
  await sendEmailQuietly({
    to: parsed.data.email,
    subject: `We have your brief — ${(order as DbDoc).orderId}`,
    text:
      `Thank you, ${parsed.data.name}.\n\n` +
      `Your commission brief ${(order as DbDoc).orderId} is with us. ` +
      `A tailor will review it and come back with a quotation.`,
    html:
      `<p>Thank you, ${escapeEmailHtml(parsed.data.name)}.</p>` +
      `<p>Your commission brief <strong>${(order as DbDoc).orderId}</strong> is with us. ` +
      `A tailor will review it and come back with a quotation before any work begins.</p>`,
  });

  return successResponse({ orderId: (order as DbDoc).orderId }, 201);
}
