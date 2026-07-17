import { NextRequest } from "next/server";

import { sendEmail } from "@/lib/email";
import { connectToDatabase, tryConnectToDatabase } from "@/lib/mongodb";
import { errorResponse, serialize, successResponse } from "@/lib/http";
import { NewsletterSubscriber } from "@/lib/models";
import { newsletterSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);
  const parsed = newsletterSchema.safeParse(payload);

  if (!parsed.success) {
    return errorResponse("Invalid newsletter submission.", 400, parsed.error.flatten());
  }

  const email = parsed.data.email.toLowerCase();
  const source = parsed.data.source ?? "website";

  const connected = await tryConnectToDatabase();
  if (!connected) {
    await sendEmail({
      to: email,
      subject: "Welcome to Divya & Design",
      text: "Thanks for subscribing to Divya & Design updates.",
      html: "<p>Thanks for subscribing to <strong>Divya & Design</strong> updates.</p>",
    });

    return successResponse(
      {
        email,
        source,
        offline: true,
      },
      201,
    );
  }

  await connectToDatabase();

  const subscriber = await NewsletterSubscriber.findOneAndUpdate(
    { email },
    { email, source, status: "active" },
    { upsert: true, new: true },
  );

  await sendEmail({
    to: email,
    subject: "Welcome to Divya & Design",
    text: "Thanks for subscribing to Divya & Design updates.",
    html: "<p>Thanks for subscribing to <strong>Divya & Design</strong> updates.</p>",
  });

  return successResponse(serialize(subscriber), 201);
}
