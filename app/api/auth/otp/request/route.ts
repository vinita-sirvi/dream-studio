import { NextRequest } from "next/server";

import { sendEmail } from "@/lib/email";
import { connectToDatabase } from "@/lib/mongodb";
import { errorResponse, successResponse } from "@/lib/http";
import { User } from "@/lib/models";
import { createOtpCode } from "@/lib/password";
import { otpRequestSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  await connectToDatabase();
  const payload = await request.json().catch(() => null);
  const parsed = otpRequestSchema.safeParse(payload);

  if (!parsed.success) {
    return errorResponse("Invalid OTP request.", 400, parsed.error.flatten());
  }

  const user = (await User.findOneAndUpdate(
    { email: parsed.data.email.toLowerCase() },
    { $setOnInsert: { name: parsed.data.email.split("@")[0], role: "customer" } } as any,
    { upsert: true, new: true },
  )) as any;

  const code = createOtpCode();
  user.otpHash = code;
  user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  await sendEmail({
    to: user.email,
    subject: "Your Divya & Design login code",
    text: `Your login code is ${code}`,
    html: `<p>Your login code is <strong>${code}</strong>. It expires in 10 minutes.</p>`,
  });

  return successResponse({ sent: true });
}
