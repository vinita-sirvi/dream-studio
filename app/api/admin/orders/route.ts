import { NextRequest } from "next/server";

import { requireAdmin } from "@/lib/api-auth";
import { recordAudit } from "@/lib/audit";
import { generateOrderId } from "@/lib/checkout";
import { errorResponse, serialize, successResponse } from "@/lib/http";
import { Order } from "@/lib/models";
import { connectToDatabase } from "@/lib/mongodb";
import { round2 } from "@/lib/pricing";
import { enforceRateLimit } from "@/lib/rate-limit";
import { adminOrderSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

/**
 * Staff-entered orders — phone and walk-in trade.
 *
 * A dedicated route rather than the generic `/api/admin/[resource]` handler
 * because an order needs a generated `orderId`: the model marks it required and
 * unique, so a plain `Order.create(body)` from the generic handler would always
 * fail. The admin order form used to sidestep this by posting to the public
 * `/api/orders`, which is now a customer checkout endpoint that builds orders
 * from the caller's own cart.
 *
 * `/api/admin/orders/<id>` still resolves to the generic by-id handler, which is
 * where PATCH and DELETE live.
 */
export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  await connectToDatabase();

  const { searchParams } = new URL(request.url);
  const rawLimit = Number(searchParams.get("limit"));
  const limit =
    Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, 200) : 50;

  const status = searchParams.get("status");
  const filter = status ? { status } : {};

  const [items, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).limit(limit).lean(),
    Order.countDocuments(filter),
  ]);

  return successResponse({ items: serialize(items), total, limit });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const limited = await enforceRateLimit("mutation", auth.session.user.id);
  if (limited) return limited;

  const payload = await request.json().catch(() => null);
  const parsed = adminOrderSchema.safeParse(payload);

  if (!parsed.success) {
    return errorResponse("Validation failed.", 400, parsed.error.flatten());
  }

  await connectToDatabase();

  const data = parsed.data;

  // Derive the money from the line items the admin entered rather than trusting
  // the `totals` in the body, which the form sends as zeros.
  const subtotal = round2(
    data.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  );
  const shipping = round2(data.totals?.shipping ?? 0);
  const discount = round2(Math.min(data.totals?.discount ?? 0, subtotal));

  const totals = {
    subtotal,
    shipping,
    discount,
    tax: round2(data.totals?.tax ?? 0),
    grandTotal: round2(Math.max(0, subtotal - discount + shipping)),
  };

  const now = new Date();
  let created: any = null;

  for (let attempt = 0; attempt < 4 && !created; attempt += 1) {
    try {
      created = await Order.create({
        ...data,
        orderId: generateOrderId(now),
        email: data.email.toLowerCase(),
        totals,
        timeline: data.timeline?.length
          ? data.timeline
          : [
              {
                status: data.status ?? "pending",
                note: `Entered by ${auth.session.user.email}.`,
                at: now.toISOString(),
              },
            ],
      } as any);
    } catch (error: any) {
      if (error?.code !== 11000) throw error;
    }
  }

  if (!created) {
    return errorResponse("Could not allocate a unique order id.", 500);
  }

  await recordAudit({
    session: auth.session,
    action: "create",
    entity: "orders",
    entityId: String(created._id),
    metadata: { orderId: created.orderId, grandTotal: totals.grandTotal },
  });

  return successResponse(serialize(created), 201);
}
