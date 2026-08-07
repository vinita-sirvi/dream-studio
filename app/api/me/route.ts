import { jsonResponse } from "@/lib/http";
import { getCurrentSession } from "@/lib/session";

export const dynamic = "force-dynamic";

/**
 * The current viewer.
 *
 * Returns only the fields a client needs, rather than the whole decoded session.
 * The session payload also carries `sid` and issue/expiry timestamps, which are
 * internal to session handling and have no business being readable by page scripts.
 */
export async function GET() {
  const session = await getCurrentSession();

  if (!session) {
    return jsonResponse({ ok: true, user: null });
  }

  return jsonResponse({
    ok: true,
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role,
    },
  });
}
