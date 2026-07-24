import { NextRequest } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import { errorResponse, successResponse } from "@/lib/http";
import { User } from "@/lib/models";
import { authLoginSchema } from "@/lib/validators";
import { verifyPassword } from "@/lib/password";
import { createSessionPayload, setSessionCookie } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  await connectToDatabase();
  const payload = await request.json().catch(() => null);
  const parsed = authLoginSchema.safeParse(payload);

  if (!parsed.success) {
    return errorResponse("Invalid login payload.", 400, parsed.error.flatten());
  }

  const user = (await User.findOne({
    email: parsed.data.email.toLowerCase(),
  })) as any;
  if (!user?.passwordHash) {
    return errorResponse("Invalid email or password.", 401);
  }

  const valid = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!valid) {
    return errorResponse("Invalid email or password.", 401);
  }

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
