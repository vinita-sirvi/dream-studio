import { NextRequest } from "next/server";

import { getOwnerScope } from "@/lib/api-auth";
import { errorResponse, successResponse } from "@/lib/http";
import { enforceRateLimit } from "@/lib/rate-limit";
import { wishlistToggleSchema } from "@/lib/validators";
import { readWishlist, readWishlistIds, toggleWishlist } from "@/lib/wishlist";

export const dynamic = "force-dynamic";

/** `?ids=1` returns just the saved ids, for setting the heart state on a grid. */
export async function GET(request: NextRequest) {
  const scope = await getOwnerScope();
  const { searchParams } = new URL(request.url);

  if (searchParams.get("ids") === "1") {
    return successResponse({ ids: await readWishlistIds(scope) });
  }

  return successResponse({ items: await readWishlist(scope) });
}

export async function POST(request: NextRequest) {
  const limited = await enforceRateLimit("mutation");
  if (limited) return limited;

  const payload = await request.json().catch(() => null);
  const parsed = wishlistToggleSchema.safeParse(payload);

  if (!parsed.success) {
    return errorResponse("Invalid product.", 400);
  }

  const scope = await getOwnerScope();
  const result = await toggleWishlist(scope, parsed.data.productId);

  if (!result.ok) {
    return errorResponse(result.message, 404);
  }

  return successResponse({ saved: result.saved, count: result.count });
}
