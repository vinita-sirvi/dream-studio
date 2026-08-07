import { NextRequest } from "next/server";

import { requireSession } from "@/lib/api-auth";
import { errorResponse, serialize, successResponse } from "@/lib/http";
import { Measurement } from "@/lib/models";
import { connectToDatabase } from "@/lib/mongodb";
import { enforceRateLimit } from "@/lib/rate-limit";
import { measurementSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

const MAX_PROFILES = 12;

/**
 * Saved measurement profiles.
 *
 * Made-to-measure is the core of this business, so these are the customer's most
 * valuable saved data — and the `Measurement` model existed with no customer-facing
 * endpoint at all, only the admin CRUD. Scoped to the session for the same reason
 * as addresses: `measurementSchema` has a `userId` field, and it is deliberately
 * discarded in favour of the session's.
 */
export async function GET() {
  const auth = await requireSession();
  if (!auth.ok) return auth.response;

  await connectToDatabase();

  const profiles = await Measurement.find({ userId: auth.session.user.id })
    .sort({ createdAt: -1 })
    .lean();

  return successResponse(serialize(profiles));
}

export async function POST(request: NextRequest) {
  const auth = await requireSession();
  if (!auth.ok) return auth.response;

  const limited = await enforceRateLimit("mutation", auth.session.user.id);
  if (limited) return limited;

  const payload = await request.json().catch(() => null);
  const parsed = measurementSchema.safeParse(payload);

  if (!parsed.success) {
    return errorResponse(
      "Please check the measurements.",
      400,
      parsed.error.flatten(),
    );
  }

  await connectToDatabase();

  const count = await Measurement.countDocuments({ userId: auth.session.user.id });
  if (count >= MAX_PROFILES) {
    return errorResponse(
      `You can save up to ${MAX_PROFILES} profiles. Remove one to add another.`,
      409,
    );
  }

  const { userId: _ignored, ...data } = parsed.data;

  const created = await Measurement.create({
    ...data,
    userId: auth.session.user.id,
  } as any);

  return successResponse(serialize(created), 201);
}
