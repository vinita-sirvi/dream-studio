import { NextRequest } from "next/server";
import type { DbInput } from "@/lib/db-types";

import { requireSession } from "@/lib/api-auth";
import { errorResponse, serialize, successResponse } from "@/lib/http";
import { Address } from "@/lib/models";
import { ensureDatabase } from "@/lib/mongodb";
import { enforceRateLimit } from "@/lib/rate-limit";
import { addressSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

const MAX_ADDRESSES = 20;

/**
 * Saved delivery addresses.
 *
 * Always scoped to the signed-in user. Note that `userId` is stripped from the
 * request body and taken from the session instead — `addressSchema` accepts a
 * `userId` field (the admin API uses it), and honouring it here would let anyone
 * write an address into another customer's account.
 */
export async function GET() {
  const auth = await requireSession();
  if (!auth.ok) return auth.response;

  const offline = await ensureDatabase();
  if (offline) return offline;

  const addresses = await Address.find({ userId: auth.session.user.id })
    .sort({ defaultShipping: -1, createdAt: -1 })
    .lean();

  return successResponse(serialize(addresses));
}

export async function POST(request: NextRequest) {
  const auth = await requireSession();
  if (!auth.ok) return auth.response;

  const limited = await enforceRateLimit("mutation", auth.session.user.id);
  if (limited) return limited;

  const payload = await request.json().catch(() => null);
  const parsed = addressSchema.safeParse(payload);

  if (!parsed.success) {
    return errorResponse(
      "Please check the address details.",
      400,
      parsed.error.flatten(),
    );
  }

  const offline = await ensureDatabase();
  if (offline) return offline;

  const count = await Address.countDocuments({ userId: auth.session.user.id });
  if (count >= MAX_ADDRESSES) {
    return errorResponse(
      `You can save up to ${MAX_ADDRESSES} addresses. Remove one to add another.`,
      409,
    );
  }

  // Any `userId` in the body is dropped and the session's used instead. Deleting
  // the key rather than setting it to undefined matters: an undefined value
  // surviving into a $set would unset the owner and orphan the row.
  const data: DbInput = { ...parsed.data };
  delete data.userId;
  const isFirst = count === 0;

  // Exactly one default of each kind.
  if (data.defaultShipping || isFirst) {
    await Address.updateMany(
      { userId: auth.session.user.id },
      { $set: { defaultShipping: false } },
    );
  }
  if (data.defaultBilling || isFirst) {
    await Address.updateMany(
      { userId: auth.session.user.id },
      { $set: { defaultBilling: false } },
    );
  }

  const created = await Address.create({
    ...data,
    userId: auth.session.user.id,
    defaultShipping: data.defaultShipping || isFirst,
    defaultBilling: data.defaultBilling || isFirst,
  } as DbInput);

  return successResponse(serialize(created), 201);
}
