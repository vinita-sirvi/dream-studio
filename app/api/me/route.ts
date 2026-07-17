import { jsonResponse } from "@/lib/http";
import { getCurrentSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getCurrentSession();
  return jsonResponse({
    ok: true,
    session,
  });
}
