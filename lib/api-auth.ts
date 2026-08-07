import "server-only";

import { errorResponse } from "./http";
import {
  getCurrentSession,
  getOrCreateGuestId,
  isAdminRole,
  type SessionPayload,
} from "./session";

/**
 * Authorization helpers for route handlers.
 *
 * Route handlers are public HTTP endpoints — a page-level layout guard does
 * nothing for them. Centralising the checks here means a handler is either
 * explicitly public or it calls one of these, rather than each one re-deriving
 * the rule (which is how `GET /api/admin/[resource]` came to have no check at
 * all while `PATCH` on the same resource had one).
 *
 * Each returns a discriminated union so the caller must handle the failure:
 *
 *   const auth = await requireAdmin();
 *   if (!auth.ok) return auth.response;
 *   auth.session // typed, non-null
 */
export type AuthResult =
  | { ok: true; session: SessionPayload }
  | { ok: false; response: Response };

export async function requireSession(): Promise<AuthResult> {
  const session = await getCurrentSession();
  if (!session) {
    return {
      ok: false,
      response: errorResponse("You need to be signed in to do that.", 401),
    };
  }
  return { ok: true, session };
}

export async function requireAdmin(): Promise<AuthResult> {
  const session = await getCurrentSession();
  if (!session) {
    return {
      ok: false,
      response: errorResponse("You need to be signed in to do that.", 401),
    };
  }

  // 403 not 401: the caller is authenticated, they simply lack the role. Using
  // 401 here would tell a signed-in customer to sign in again, which they cannot
  // fix by doing.
  if (!isAdminRole(session.user.role)) {
    return {
      ok: false,
      response: errorResponse("You do not have access to this resource.", 403),
    };
  }

  return { ok: true, session };
}

/**
 * The database scope for cart/wishlist rows: the signed-in user when there is
 * one, otherwise the signed guest cookie. Never accept an owner id from the
 * request body — that would let anyone read or edit another visitor's basket.
 */
export type OwnerScope =
  | { userId: string; guestSessionId?: undefined }
  | { guestSessionId: string; userId?: undefined };

export async function getOwnerScope(): Promise<OwnerScope> {
  const session = await getCurrentSession();
  if (session) {
    return { userId: session.user.id };
  }
  return { guestSessionId: await getOrCreateGuestId() };
}
