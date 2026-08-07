import { NextRequest } from "next/server";

import { errorResponse, successResponse } from "@/lib/http";
import { Order } from "@/lib/models";
import { connectToDatabase } from "@/lib/mongodb";
import { enforceRateLimit } from "@/lib/rate-limit";
import { trackOrderSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

/**
 * Public order tracking.
 *
 * Guests can order, so tracking cannot require an account — but it must not turn
 * into an order-lookup oracle either. Two defences:
 *
 *  - The order id alone is not enough; the email on the order must match too.
 *  - It is rate limited, and a wrong pair returns the same 404 as an unknown id,
 *    so the response cannot be used to test whether an order exists.
 *
 * POST rather than GET so the id and email stay out of URLs, server access logs
 * and `Referer` headers.
 */
export async function POST(request: NextRequest) {
  const limited = await enforceRateLimit("publicForm");
  if (limited) return limited;

  const payload = await request.json().catch(() => null);
  const parsed = trackOrderSchema.safeParse(payload);

  if (!parsed.success) {
    return errorResponse(
      "Enter both your order number and the email you used.",
      400,
      parsed.error.flatten(),
    );
  }

  await connectToDatabase();

  const order: any = await Order.findOne({
    orderId: parsed.data.orderId.trim().toUpperCase(),
    email: parsed.data.email.trim().toLowerCase(),
  })
    .select("orderId status createdAt updatedAt items totals timeline shippingMethod")
    .lean();

  if (!order) {
    return errorResponse(
      "We could not find an order with those details. Check the order number and email.",
      404,
    );
  }

  // A deliberately narrow projection: enough to show progress, without echoing
  // the delivery address or phone number back to whoever asked.
  return successResponse({
    orderId: order.orderId,
    status: order.status,
    placedAt: order.createdAt,
    updatedAt: order.updatedAt,
    shippingMethod: order.shippingMethod ?? null,
    grandTotal: order.totals?.grandTotal ?? 0,
    items: (order.items ?? []).map((item: any) => ({
      name: item.name,
      quantity: item.quantity,
    })),
    timeline: (order.timeline ?? []).map((entry: any) => ({
      status: entry.status,
      note: entry.note ?? null,
      at: entry.at ?? null,
    })),
  });
}
