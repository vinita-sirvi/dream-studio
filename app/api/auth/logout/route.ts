import { jsonResponse } from "@/lib/http";
import { clearSessionCookie } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST() {
  await clearSessionCookie();
  return jsonResponse({ ok: true });
}
