import { NextRequest } from "next/server";

import { sendEmail } from "@/lib/email";
import { connectToDatabase } from "@/lib/mongodb";
import { errorResponse, serialize, successResponse } from "@/lib/http";
import { CustomOrder } from "@/lib/models";
import { customOrderSchema } from "@/lib/validators";
import { getAdminEmails, env } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  await connectToDatabase();
  const payload = await request.json().catch(() => null);
  const parsed = customOrderSchema.safeParse(payload);

  if (!parsed.success) {
    return errorResponse("Invalid custom order submission.", 400, parsed.error.flatten());
  }

  const order = await CustomOrder.create({
    ...parsed.data,
    orderId: `CO-${Date.now()}`,
    stage: "submitted",
  } as any);

  const adminTargets = getAdminEmails();
  const to = adminTargets.length > 0 ? adminTargets : env.RESEND_FROM_EMAIL ? [env.RESEND_FROM_EMAIL] : [];

  if (to.length > 0) {
    await sendEmail({
      to,
      subject: `New Custom Order Request: ${parsed.data.productType}`,
      text: `${parsed.data.name} submitted a custom order request.`,
      html: `<p><strong>${parsed.data.name}</strong> submitted a custom order request for <strong>${parsed.data.productType}</strong>.</p>`,
    });
  }

  return successResponse(serialize(order), 201);
}
