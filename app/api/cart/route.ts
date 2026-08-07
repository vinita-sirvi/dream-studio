import { NextRequest } from "next/server";
import type { DbDoc } from "@/lib/db-types";

import { getOwnerScope } from "@/lib/api-auth";
import {
  addToCart,
  applyCartCoupon,
  clearCart,
  readCart,
  removeCartCoupon,
  removeCartLine,
  setCartLineQuantity,
} from "@/lib/cart";
import { errorResponse, successResponse } from "@/lib/http";
import { ensureDatabase } from "@/lib/mongodb";
import { enforceRateLimit } from "@/lib/rate-limit";
import {
  cartAddSchema,
  cartRemoveSchema,
  cartUpdateSchema,
  couponValidateSchema,
} from "@/lib/validators";

export const dynamic = "force-dynamic";

/**
 * Cart API.
 *
 * The cart is owned by the session (user id when signed in, signed guest cookie
 * otherwise) — never by an id in the request body, which would let anyone read or
 * edit someone else's bag. Every response returns the whole re-priced cart so the
 * client never has to compute money itself.
 */
export async function GET() {
  const offline = await ensureDatabase();
  if (offline) return offline;

  const scope = await getOwnerScope();
  return successResponse(await readCart(scope));
}

export async function POST(request: NextRequest) {
  const limited = await enforceRateLimit("mutation");
  if (limited) return limited;

  const payload = await request.json().catch(() => null);
  const parsed = cartAddSchema.safeParse(payload);

  if (!parsed.success) {
    return errorResponse(
      "That piece could not be added.",
      400,
      parsed.error.flatten(),
    );
  }

  const offline = await ensureDatabase();
  if (offline) return offline;

  const scope = await getOwnerScope();
  const result = await addToCart(scope, parsed.data);

  if (!result.ok) {
    return errorResponse(result.message, 409);
  }

  return successResponse(result.cart, 201);
}

/** Change a line quantity, or apply/remove a coupon. */
export async function PATCH(request: NextRequest) {
  const limited = await enforceRateLimit("mutation");
  if (limited) return limited;

  const payload: DbDoc = await request.json().catch(() => null);
  if (!payload || typeof payload !== "object") {
    return errorResponse("Invalid request body.", 400);
  }

  const offline = await ensureDatabase();
  if (offline) return offline;

  const scope = await getOwnerScope();

  if (payload.action === "apply-coupon") {
    const parsed = couponValidateSchema.safeParse(payload);
    if (!parsed.success) {
      return errorResponse("Enter a valid code.", 400);
    }

    const result = await applyCartCoupon(scope, parsed.data.code);
    if (!result.ok) {
      return errorResponse(result.message, 422);
    }
    return successResponse(result.cart);
  }

  if (payload.action === "remove-coupon") {
    return successResponse(await removeCartCoupon(scope));
  }

  const parsed = cartUpdateSchema.safeParse(payload);
  if (!parsed.success) {
    return errorResponse("Invalid quantity.", 400, parsed.error.flatten());
  }

  return successResponse(
    await setCartLineQuantity(scope, parsed.data.lineId, parsed.data.quantity),
  );
}

/** Remove one line, or the whole cart with `?all=1`. */
export async function DELETE(request: NextRequest) {
  const limited = await enforceRateLimit("mutation");
  if (limited) return limited;

  const offline = await ensureDatabase();
  if (offline) return offline;

  const scope = await getOwnerScope();
  const { searchParams } = new URL(request.url);

  if (searchParams.get("all") === "1") {
    await clearCart(scope);
    return successResponse(await readCart(scope));
  }

  const payload = await request.json().catch(() => null);
  const parsed = cartRemoveSchema.safeParse(payload);

  if (!parsed.success) {
    return errorResponse("Nothing to remove.", 400);
  }

  return successResponse(await removeCartLine(scope, parsed.data.lineId));
}
