import { isValidObjectId } from "mongoose";
import { NextRequest } from "next/server";

import { requireSession } from "@/lib/api-auth";
import { errorResponse, serialize, successResponse } from "@/lib/http";
import { Measurement } from "@/lib/models";
import { connectToDatabase } from "@/lib/mongodb";
import { enforceRateLimit } from "@/lib/rate-limit";
import { measurementSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

/** Ownership is enforced through the query filter, so a foreign id 404s. */
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
  const parsed = measurementSchema.partial().safeParse(payload);

  if (!parsed.success) {
    return errorResponse(
      "Please check the measurements.",
      400,
      parsed.error.flatten(),
    );
  }

  await connectToDatabase();

  const { userId: _ignored, ...data } = parsed.data;

  const updated = await Measurement.findOneAndUpdate(
    { _id: id, userId: auth.session.user.id },
    { $set: data },
    { new: true, runValidators: true },
  );

  if (!updated) {
    return errorResponse("Profile not found.", 404);
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

  const deleted = await Measurement.findOneAndDelete({
    _id: id,
    userId: auth.session.user.id,
  });

  if (!deleted) {
    return errorResponse("Profile not found.", 404);
  }

  return successResponse({ deleted: true });
}
