import { createHmac, randomUUID } from "node:crypto";

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
};

const SESSION_COOKIE = "dream_studio_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

function getSessionSecret() {
  return env.SESSION_SECRET || "dream-studio-local-session-secret-please-change";
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

export function createSessionPayload(user: SessionUser): SessionPayload {
  return {
    sid: randomUUID(),
    user,
    issuedAt: Date.now(),
  };
}

export function encodeSession(payload: SessionPayload) {
  const raw = JSON.stringify(payload);
  const encoded = base64UrlEncode(raw);
  return `${encoded}.${sign(encoded)}`;
}

export function decodeSession(token: string | undefined | null) {
  if (!token) {
    return null;
  }

  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) {
    return null;
  }

  if (sign(encoded) !== signature) {
    return null;
  }

  try {
    return JSON.parse(base64UrlDecode(encoded)) as SessionPayload;
  } catch {
    return null;
  }
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
    maxAge: SESSION_MAX_AGE,
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
