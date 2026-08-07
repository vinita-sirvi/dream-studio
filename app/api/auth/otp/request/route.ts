import { NextRequest } from "next/server";

import { sendEmailQuietly } from "@/lib/email";
import { connectToDatabase } from "@/lib/mongodb";
import { errorResponse, successResponse } from "@/lib/http";
import { User } from "@/lib/models";
import { createOtpCode, hashOtpCode } from "@/lib/password";
import { enforceRateLimit } from "@/lib/rate-limit";
import { otpRequestSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

const OTP_TTL_MS = 10 * 60 * 1000;

/**
 * Request a one-time login code.
 *
 * Hardened in three ways:
 *
 *  - Rate limited per IP *and* per email. Without a limit this endpoint sends an
 *    email on every request to an address the caller chooses, which is both a way
 *    to harass someone and a fast route to getting the sending domain blocklisted.
 *  - The code is stored as a SHA-256 hash. It was previously written to `otpHash`
 *    in plain text.
 *  - Delivery failures no longer 500. `sendEmail` throws on a non-2xx from Resend,
 *    so a provider hiccup used to surface as a server error after the code had
 *    already been saved.
 */
export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);
  const parsed = otpRequestSchema.safeParse(payload);

  if (!parsed.success) {
    return errorResponse("Enter a valid email address.", 400, parsed.error.flatten());
  }

  const email = parsed.data.email.toLowerCase().trim();

  const limited = await enforceRateLimit("otpRequest", email);
  if (limited) return limited;

  await connectToDatabase();

  const user = (await User.findOneAndUpdate(
    { email },
    {
      $setOnInsert: {
        email,
        name: email.split("@")[0],
        role: "customer",
      },
    } as any,
    { upsert: true, new: true },
  )) as any;

  const code = createOtpCode();
  user.otpHash = hashOtpCode(code);
  user.otpExpiresAt = new Date(Date.now() + OTP_TTL_MS);
  user.otpAttempts = 0;
  await user.save();

  await sendEmailQuietly({
    to: email,
    subject: "Your Divya & Design login code",
    text: `Your login code is ${code}. It expires in 10 minutes.`,
    html: `<p>Your login code is <strong>${code}</strong>. It expires in 10 minutes.</p><p>If you did not ask for this, you can ignore it.</p>`,
  });

  // Always the same response, whether or not the address was already registered:
  // a different answer here would turn this into an account-enumeration endpoint.
  return successResponse({ sent: true });
}
