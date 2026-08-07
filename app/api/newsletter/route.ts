import { NextRequest } from "next/server";

import { sendEmailQuietly } from "@/lib/email";
import { connectToDatabase, tryConnectToDatabase } from "@/lib/mongodb";
import { errorResponse, successResponse } from "@/lib/http";
import { NewsletterSubscriber } from "@/lib/models";
import { newsletterSchema } from "@/lib/validators";
import { enforceRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const WELCOME = {
  subject: "Welcome to Divya & Design",
  text: "Thanks for subscribing to Divya & Design updates.",
  html: "<p>Thanks for subscribing to <strong>Divya &amp; Design</strong> updates.</p>",
};

/**
 * Newsletter signup.
 *
 * Rate limited per IP and per submitted address. Anyone can type anyone's email
 * into this form, and it sends a message to whatever it is given — unthrottled,
 * that is a way to bombard a third party's inbox using the studio's sending domain,
 * which is also how a sending domain ends up on a blocklist.
 *
 * Mail failures are swallowed rather than 500ing a request whose subscriber row was
 * stored, and the stored document is no longer echoed back.
 */
export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);
  const parsed = newsletterSchema.safeParse(payload);

  if (!parsed.success) {
    return errorResponse(
      "Invalid newsletter submission.",
      400,
      parsed.error.flatten(),
    );
  }

  const email = parsed.data.email.toLowerCase().trim();

  const limited = await enforceRateLimit("publicForm", email);
  if (limited) return limited;

  const source = parsed.data.source ?? "website";

  const connected = await tryConnectToDatabase();
  if (!connected) {
    // No database configured: still acknowledge so the form works on a fresh
    // checkout, but report plainly that nothing was stored.
    await sendEmailQuietly({ to: email, ...WELCOME });
    return successResponse({ subscribed: true, stored: false }, 201);
  }

  await connectToDatabase();

  await NewsletterSubscriber.findOneAndUpdate(
    { email },
    { $set: { email, source, status: "active" } },
    { upsert: true, new: true },
  );

  await sendEmailQuietly({ to: email, ...WELCOME });

  return successResponse({ subscribed: true, stored: true }, 201);
}
