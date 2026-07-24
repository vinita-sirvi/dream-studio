import { NextRequest } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import { errorResponse, successResponse } from "@/lib/http";
import { User } from "@/lib/models";
import { otpVerifySchema } from "@/lib/validators";
import { createSessionPayload, setSessionCookie } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  await connectToDatabase();
  const payload = await request.json().catch(() => null);
  const parsed = otpVerifySchema.safeParse(payload);

  if (!parsed.success) {
    return errorResponse("Invalid OTP verification payload.", 400, parsed.error.flatten());
  }

  const user = (await User.findOne({
    email: parsed.data.email.toLowerCase(),
  })) as any;
  if (!user?.otpHash || !user.otpExpiresAt) {
    return errorResponse("No OTP request found.", 400);
  }

  if (user.otpExpiresAt.getTime() < Date.now()) {
    return errorResponse("OTP expired.", 400);
  }

  if (user.otpHash !== parsed.data.code) {
    return errorResponse("Invalid OTP code.", 401);
  }

  user.otpHash = undefined;
  user.otpExpiresAt = undefined;
  user.emailVerifiedAt = new Date();
  await user.save();

  await setSessionCookie(
    createSessionPayload({
      id: String(user._id),
      email: user.email,
      name: user.name,
      role: user.role,
    }),
  );

  return successResponse({
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
  });
}
