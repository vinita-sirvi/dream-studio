import { NextRequest } from "next/server";

import { mergeGuestCartIntoUser } from "@/lib/cart";
import { connectToDatabase } from "@/lib/mongodb";
import { errorResponse, successResponse } from "@/lib/http";
import { User } from "@/lib/models";
import { authLoginSchema } from "@/lib/validators";
import { enforceRateLimit } from "@/lib/rate-limit";
import { verifyPassword } from "@/lib/password";
import {
  createSessionPayload,
  getGuestId,
  setSessionCookie,
} from "@/lib/session";
import { mergeGuestWishlistIntoUser } from "@/lib/wishlist";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);
  const parsed = authLoginSchema.safeParse(payload);

  if (!parsed.success) {
    return errorResponse("Invalid login payload.", 400, parsed.error.flatten());
  }

  const email = parsed.data.email.toLowerCase().trim();

  // Bucketed per IP *and* per email. Password guessing was previously unlimited.
  const limited = await enforceRateLimit("login", email);
  if (limited) return limited;

  await connectToDatabase();

  const user = (await User.findOne({ email })) as any;
  if (!user?.passwordHash) {
    return errorResponse("Invalid email or password.", 401);
  }

  const valid = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!valid) {
    return errorResponse("Invalid email or password.", 401);
  }

  const guestId = await getGuestId();
  const userId = String(user._id);

  user.lastLoginAt = new Date();
  await user.save();

  await setSessionCookie(
    createSessionPayload({
      id: userId,
      email: user.email,
      name: user.name,
      role: user.role,
    }),
  );

  // A cart or wishlist built before signing in should survive the login step.
  try {
    await mergeGuestCartIntoUser(guestId, userId);
    await mergeGuestWishlistIntoUser(guestId, userId);
  } catch (error) {
    console.error("[auth] guest merge failed after login", error);
  }

  return successResponse({
    id: userId,
    name: user.name,
    email: user.email,
    role: user.role,
  });
}
