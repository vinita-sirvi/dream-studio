import { NextRequest } from "next/server";

import { mergeGuestCartIntoUser } from "@/lib/cart";
import { getAdminEmails } from "@/lib/env";
import { connectToDatabase } from "@/lib/mongodb";
import { errorResponse, successResponse } from "@/lib/http";
import { User } from "@/lib/models";
import { verifyOtpCode } from "@/lib/password";
import { enforceRateLimit } from "@/lib/rate-limit";
import {
  createSessionPayload,
  getGuestId,
  setSessionCookie,
} from "@/lib/session";
import { otpVerifySchema } from "@/lib/validators";
import { mergeGuestWishlistIntoUser } from "@/lib/wishlist";

export const dynamic = "force-dynamic";

const MAX_ATTEMPTS = 5;

/**
 * Verify a one-time login code.
 *
 * The comparison is now against a hash, in constant time, with a per-code attempt
 * ceiling. Previously `user.otpHash !== parsed.data.code` compared a stored
 * plaintext code with `!==` and allowed unlimited attempts, so a six-digit code
 * was brute-forceable within its ten-minute window.
 */
export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);
  const parsed = otpVerifySchema.safeParse(payload);

  if (!parsed.success) {
    return errorResponse(
      "Enter the six-digit code from your email.",
      400,
      parsed.error.flatten(),
    );
  }

  const email = parsed.data.email.toLowerCase().trim();

  const limited = await enforceRateLimit("otpVerify", email);
  if (limited) return limited;

  await connectToDatabase();

  const user = (await User.findOne({ email })) as any;

  // One message for every failure mode below, so the response cannot be used to
  // learn whether an address has an account or a code outstanding.
  const invalid = () => errorResponse("That code is not valid or has expired.", 401);

  if (!user?.otpHash || !user.otpExpiresAt) {
    return invalid();
  }

  if (user.otpExpiresAt.getTime() < Date.now()) {
    user.otpHash = undefined;
    user.otpExpiresAt = undefined;
    user.otpAttempts = 0;
    await user.save();
    return invalid();
  }

  if ((user.otpAttempts ?? 0) >= MAX_ATTEMPTS) {
    // Burn the code rather than leaving it live for the next attacker.
    user.otpHash = undefined;
    user.otpExpiresAt = undefined;
    user.otpAttempts = 0;
    await user.save();
    return errorResponse(
      "Too many incorrect attempts. Please request a new code.",
      429,
    );
  }

  if (!verifyOtpCode(parsed.data.code, user.otpHash)) {
    user.otpAttempts = (user.otpAttempts ?? 0) + 1;
    await user.save();
    return invalid();
  }

  user.otpHash = undefined;
  user.otpExpiresAt = undefined;
  user.otpAttempts = 0;
  user.emailVerifiedAt = new Date();
  user.lastLoginAt = new Date();

  // Bootstrap path for the first admin — see `adminRoleFor` in the register
  // route. Only ever an upgrade: an existing admin is never demoted by dropping
  // out of the list, since that would be a surprising way to lose access.
  if (user.role === "customer" && getAdminEmails().includes(email)) {
    user.role = "admin";
  }

  await user.save();

  // Carry anything gathered while signed out into the account. Read the guest id
  // before the session cookie is written, and never let a merge failure block the
  // sign-in itself.
  const guestId = await getGuestId();
  const userId = String(user._id);

  await setSessionCookie(
    createSessionPayload({
      id: userId,
      email: user.email,
      name: user.name,
      role: user.role,
    }),
  );

  try {
    await mergeGuestCartIntoUser(guestId, userId);
    await mergeGuestWishlistIntoUser(guestId, userId);
  } catch (error) {
    console.error("[auth] guest merge failed after OTP sign-in", error);
  }

  return successResponse({
    id: userId,
    name: user.name,
    email: user.email,
    role: user.role,
  });
}
