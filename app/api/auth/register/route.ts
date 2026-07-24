import { NextRequest } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import { errorResponse, successResponse } from "@/lib/http";
import { User } from "@/lib/models";
import { authRegisterSchema } from "@/lib/validators";
import { hashPassword } from "@/lib/password";
import { createSessionPayload, setSessionCookie } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  await connectToDatabase();
  const payload = await request.json().catch(() => null);
  const parsed = authRegisterSchema.safeParse(payload);

  if (!parsed.success) {
    return errorResponse("Invalid registration payload.", 400, parsed.error.flatten());
  }

  const existing = (await User.findOne({
    email: parsed.data.email.toLowerCase(),
  })) as any;
  if (existing) {
    return errorResponse("An account with this email already exists.", 409);
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const user = (await User.create({
    name: parsed.data.name,
    email: parsed.data.email.toLowerCase(),
    passwordHash,
    role: "customer",
    emailVerifiedAt: new Date(),
  } as any)) as any;

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
  }, 201);
}
