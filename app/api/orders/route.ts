import { NextRequest } from "next/server";

import { getOwnerScope } from "@/lib/api-auth";
import { placeOrder } from "@/lib/checkout";
import { errorResponse, serialize, successResponse } from "@/lib/http";
import { Order } from "@/lib/models";
import { connectToDatabase } from "@/lib/mongodb";
import { enforceRateLimit } from "@/lib/rate-limit";
import { getCurrentSession } from "@/lib/session";
import { checkoutSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

/**
 * The caller's own orders.
 *
 * This endpoint used to be `Order.find({})` with no authentication: a plain
 * `GET /api/orders` returned the twenty most recent orders belonging to anyone,
 * complete with names, emails, phone numbers and delivery addresses. It is now
 * scoped to the signed-in user. Staff read orders through `/api/admin/orders`,
 * which requires an admin role.
 */
export async function GET(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return errorResponse("You need to be signed in to view your orders.", 401);
  }

  await connectToDatabase();

  const { searchParams } = new URL(request.url);
  const rawLimit = Number(searchParams.get("limit"));
  const limit =
    Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, 50) : 20;

  // Orders placed before signing in are matched on the verified session email as
  // well as the user id, so a guest checkout still shows up in the account.
  const orders = await Order.find({
    $or: [{ userId: session.user.id }, { email: session.user.email.toLowerCase() }],
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return successResponse(serialize(orders));
}

/**
 * Place an order from the caller's cart.
 *
 * The body carries contact and address details only. Items, prices, discounts and
 * totals all come from the server-side cart — see `lib/checkout.ts`.
 */
export async function POST(request: NextRequest) {
  const limited = await enforceRateLimit("checkout");
  if (limited) return limited;

  const payload = await request.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(payload);

  if (!parsed.success) {
    return errorResponse(
      "Please check the highlighted details.",
      400,
      parsed.error.flatten(),
    );
  }

  const session = await getCurrentSession();
  const scope = await getOwnerScope();

  const result = await placeOrder({
    scope,
    input: parsed.data,
    userId: session?.user.id,
  });

  if (!result.ok) {
    return errorResponse(result.message, result.status);
  }

  return successResponse(
    { orderId: result.orderId, grandTotal: result.grandTotal },
    201,
  );
}
