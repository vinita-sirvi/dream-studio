import { isValidObjectId } from "mongoose";
import { NextRequest } from "next/server";

import { requireSession } from "@/lib/api-auth";
import { errorResponse, serialize, successResponse } from "@/lib/http";
import { Address } from "@/lib/models";
import { connectToDatabase } from "@/lib/mongodb";
import { enforceRateLimit } from "@/lib/rate-limit";
import { addressSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

/**
 * Edit or delete one saved address.
 *
 * The `userId` is part of the query filter rather than checked after loading the
 * document. That is what makes this safe against IDOR: a request for someone
 * else's address id simply matches nothing and returns 404, and there is no
 * moment where the wrong document is in hand.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireSession();
  if (!auth.ok) return auth.response;

  const limited = await enforceRateLimit("mutation", auth.session.user.id);
  if (limited) return limited;

  const { id } = await params;
  if (!isValidObjectId(id)) {
    return errorResponse("Invalid identifier.", 400);
  }

  const payload = await request.json().catch(() => null);
  const parsed = addressSchema.partial().safeParse(payload);

  if (!parsed.success) {
    return errorResponse(
      "Please check the address details.",
      400,
      parsed.error.flatten(),
    );
  }

  await connectToDatabase();

  const { userId: _ignored, ...data } = parsed.data;

  if (data.defaultShipping) {
    await Address.updateMany(
      { userId: auth.session.user.id },
      { $set: { defaultShipping: false } },
    );
  }
  if (data.defaultBilling) {
    await Address.updateMany(
      { userId: auth.session.user.id },
      { $set: { defaultBilling: false } },
    );
  }

  const updated = await Address.findOneAndUpdate(
    { _id: id, userId: auth.session.user.id },
    { $set: data },
    { new: true, runValidators: true },
  );

  if (!updated) {
    return errorResponse("Address not found.", 404);
  }

  return successResponse(serialize(updated));
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireSession();
  if (!auth.ok) return auth.response;

  const limited = await enforceRateLimit("mutation", auth.session.user.id);
  if (limited) return limited;

  const { id } = await params;
  if (!isValidObjectId(id)) {
    return errorResponse("Invalid identifier.", 400);
  }

  await connectToDatabase();

  const deleted = await Address.findOneAndDelete({
    _id: id,
    userId: auth.session.user.id,
  });

  if (!deleted) {
    return errorResponse("Address not found.", 404);
  }

  // Promote another address so the account is never left with no default.
  if (deleted.defaultShipping || deleted.defaultBilling) {
    const next = await Address.findOne({ userId: auth.session.user.id }).sort({
      createdAt: -1,
    });
    if (next) {
      if (deleted.defaultShipping) next.defaultShipping = true;
      if (deleted.defaultBilling) next.defaultBilling = true;
      await next.save();
    }
  }

  return successResponse({ deleted: true });
}
