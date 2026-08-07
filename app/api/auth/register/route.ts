import { NextRequest } from "next/server";
import type { DbDoc, DbInput } from "@/lib/db-types";

import { mergeGuestCartIntoUser } from "@/lib/cart";
import { getAdminEmails } from "@/lib/env";
import { ensureDatabase } from "@/lib/mongodb";
import { errorResponse, successResponse } from "@/lib/http";
import { User } from "@/lib/models";
import { authRegisterSchema } from "@/lib/validators";
import { enforceRateLimit } from "@/lib/rate-limit";
import { hashPassword } from "@/lib/password";
import {
  createSessionPayload,
  getGuestId,
  setSessionCookie,
} from "@/lib/session";
import { mergeGuestWishlistIntoUser } from "@/lib/wishlist";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);
  const parsed = authRegisterSchema.safeParse(payload);

  if (!parsed.success) {
    return errorResponse(
      "Invalid registration payload.",
      400,
      parsed.error.flatten(),
    );
  }

  const email = parsed.data.email.toLowerCase().trim();

  const limited = await enforceRateLimit("register", email);
  if (limited) return limited;

  const offline = await ensureDatabase();
  if (offline) return offline;

  const existing = await User.findOne({ email }).select("_id passwordHash").lean();

  if (existing) {
    // An account can exist without a password if it was created by requesting an
    // OTP. Registering then sets the password on that same account rather than
    // reporting a conflict the person cannot resolve.
    if (!(existing as DbDoc).passwordHash) {
      const passwordHash = await hashPassword(parsed.data.password);
      const updated = (await User.findOneAndUpdate(
        { _id: (existing as DbDoc)._id },
        {
          $set: {
            name: parsed.data.name,
            passwordHash,
            role: adminRoleFor(email),
          },
        },
        { new: true },
      )) as DbDoc;

      return finish(updated, 200);
    }

    return errorResponse("An account with this email already exists.", 409);
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const user = (await User.create({
    name: parsed.data.name,
    email,
    passwordHash,
    role: adminRoleFor(email),
    // Email is not actually verified at this point. The OTP flow is what proves
    // ownership of an address, so this only records the account's creation route.
    emailVerifiedAt: undefined,
  } as DbInput)) as DbDoc;

  return finish(user, 201);
}

/**
 * Promote addresses listed in `ADMIN_EMAILS` to admin on sign-up.
 *
 * Without this there was no supported way to create the first admin: the demo
 * seed was the only source of an admin account, and it is now development-only.
 * `ADMIN_EMAILS` already existed but was read solely to decide who gets notified
 * about contact-form submissions.
 */
function adminRoleFor(email: string) {
  return getAdminEmails().includes(email) ? "admin" : "customer";
}

async function finish(user: DbDoc, status: number) {
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
    console.error("[auth] guest merge failed after registration", error);
  }

  return successResponse(
    {
      id: userId,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    status,
  );
}
