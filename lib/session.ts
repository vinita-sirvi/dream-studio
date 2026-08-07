import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";

import { env } from "./env";

export type SessionRole = "guest" | "customer" | "admin" | "super_admin";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: SessionRole;
};

export type SessionPayload = {
  sid: string;
  user: SessionUser;
  issuedAt: number;
  /** Absolute expiry, epoch ms. Verified server-side on every decode. */
  expiresAt: number;
};

const SESSION_COOKIE = "dream_studio_session";
const GUEST_COOKIE = "dream_studio_guest";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;
const GUEST_MAX_AGE = 60 * 60 * 24 * 180;

/**
 * The signing secret.
 *
 * There is deliberately no fallback in production: a known default would let
 * anyone forge a cookie for `role: "super_admin"`, which is a full compromise of
 * the admin API. Development keeps a fixed local value so `npm run dev` works
 * with no .env file.
 */
function getSessionSecret() {
  if (env.SESSION_SECRET) {
    return env.SESSION_SECRET;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "SESSION_SECRET is not set. Generate one with `openssl rand -base64 32` " +
        "and set it before starting the server — sessions cannot be signed safely without it.",
    );
  }

  return "dream-studio-local-development-only-secret";
}

function base64UrlEncode(value: string) {
  return Buffer.from(value).toString("base64url");
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

/** Constant-time string compare, so signature checks leak no timing signal. */
function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) {
    return false;
  }
  return timingSafeEqual(left, right);
}

export function createSessionPayload(user: SessionUser): SessionPayload {
  const now = Date.now();
  return {
    sid: randomUUID(),
    user,
    issuedAt: now,
    expiresAt: now + SESSION_MAX_AGE * 1000,
  };
}

export function encodeSession(payload: SessionPayload) {
  const raw = JSON.stringify(payload);
  const encoded = base64UrlEncode(raw);
  return `${encoded}.${sign(encoded)}`;
}

const ROLES: SessionRole[] = ["guest", "customer", "admin", "super_admin"];

/**
 * Verify and decode a session cookie.
 *
 * Returns null for anything that is not a well-formed, correctly signed,
 * unexpired session with a recognised role. Cookie `maxAge` alone is not an
 * expiry check — the client controls how long it keeps sending the value — so
 * the signed `expiresAt` is enforced here.
 */
export function decodeSession(token: string | undefined | null) {
  if (!token) {
    return null;
  }

  const [encoded, signature, ...rest] = token.split(".");
  if (!encoded || !signature || rest.length) {
    return null;
  }

  if (!safeEqual(sign(encoded), signature)) {
    return null;
  }

  let payload: SessionPayload;
  try {
    payload = JSON.parse(base64UrlDecode(encoded)) as SessionPayload;
  } catch {
    return null;
  }

  if (
    !payload ||
    typeof payload !== "object" ||
    typeof payload.sid !== "string" ||
    typeof payload.user?.id !== "string" ||
    typeof payload.user?.email !== "string" ||
    !ROLES.includes(payload.user?.role)
  ) {
    return null;
  }

  // Sessions issued before `expiresAt` existed are treated as expired rather
  // than immortal.
  if (typeof payload.expiresAt !== "number" || payload.expiresAt < Date.now()) {
    return null;
  }

  return payload;
}

export async function getCurrentSession() {
  const cookieStore = await cookies();
  return decodeSession(cookieStore.get(SESSION_COOKIE)?.value ?? null);
}

export async function setSessionCookie(payload: SessionPayload) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, encodeSession(payload), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(payload.expiresAt),
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export function isAdminRole(role: SessionRole | undefined) {
  return role === "admin" || role === "super_admin";
}

/**
 * A stable, signed identifier for a signed-out visitor, so a cart or wishlist
 * survives a reload without an account. Created on first use.
 *
 * Signed for the same reason the session is: the value keys server-side rows, so
 * an attacker who could set it arbitrarily could read another visitor's basket
 * by guessing or replaying an id.
 */
export async function getOrCreateGuestId() {
  const cookieStore = await cookies();
  const existing = cookieStore.get(GUEST_COOKIE)?.value;

  if (existing) {
    const [value, signature, ...rest] = existing.split(".");
    if (value && signature && !rest.length && safeEqual(sign(value), signature)) {
      return value;
    }
  }

  const id = randomUUID();
  cookieStore.set(GUEST_COOKIE, `${id}.${sign(id)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: GUEST_MAX_AGE,
  });

  return id;
}

/** Read the guest id without creating one. Used by read-only paths. */
export async function getGuestId() {
  const cookieStore = await cookies();
  const existing = cookieStore.get(GUEST_COOKIE)?.value;
  if (!existing) return null;

  const [value, signature, ...rest] = existing.split(".");
  if (!value || !signature || rest.length) return null;
  return safeEqual(sign(value), signature) ? value : null;
}
