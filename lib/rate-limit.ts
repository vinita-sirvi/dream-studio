import "server-only";

import { headers } from "next/headers";

import { errorResponse } from "./http";

/**
 * Fixed-window rate limiting, held in process memory.
 *
 * Scope and honest limitations: this counts per server instance. Behind several
 * instances an attacker gets `limit × instances`, and counters reset on deploy.
 * That is a real weakness, but the alternative was no limit at all, which left
 * `POST /api/auth/login` open to unbounded password guessing and
 * `POST /api/auth/otp/request` open to being used as a free mail cannon.
 *
 * If this platform is deployed to more than one instance, back `hit()` with
 * Redis (or Vercel KV / Upstash) — the call sites do not need to change.
 */
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/** Bound the map so a flood of distinct keys cannot grow it without limit. */
const MAX_KEYS = 20_000;

function sweep(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

export type RateLimitRule = {
  /** Requests allowed per window. */
  limit: number;
  /** Window length in seconds. */
  windowSeconds: number;
};

export const RATE_LIMITS = {
  login: { limit: 8, windowSeconds: 300 },
  register: { limit: 5, windowSeconds: 900 },
  otpRequest: { limit: 4, windowSeconds: 900 },
  otpVerify: { limit: 8, windowSeconds: 900 },
  publicForm: { limit: 6, windowSeconds: 600 },
  checkout: { limit: 12, windowSeconds: 600 },
  upload: { limit: 40, windowSeconds: 600 },
  mutation: { limit: 60, windowSeconds: 60 },
} satisfies Record<string, RateLimitRule>;

export type RateLimitName = keyof typeof RATE_LIMITS;

function check(key: string, rule: RateLimitRule) {
  const now = Date.now();

  if (buckets.size > MAX_KEYS) {
    sweep(now);
  }

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + rule.windowSeconds * 1000 });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  existing.count += 1;
  if (existing.count > rule.limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

/**
 * Best-effort client identity.
 *
 * `x-forwarded-for` is client-controllable in principle, but on a managed host
 * the edge rewrites it, so the left-most entry is the real peer. We deliberately
 * do not fall back to a single shared bucket for unknown clients — that would
 * let one attacker lock out every visitor.
 */
async function clientKey() {
  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return (
    headerList.get("x-real-ip") ??
    headerList.get("cf-connecting-ip") ??
    "unknown"
  );
}

/**
 * Apply a named limit. Returns a 429 response when the caller is over budget,
 * or null to continue.
 *
 * `discriminator` narrows the bucket beyond IP — pass the submitted email on
 * login so one attacker cannot lock a victim out of their own account by
 * exhausting the shared IP bucket.
 */
export async function enforceRateLimit(
  name: RateLimitName,
  discriminator?: string,
): Promise<Response | null> {
  const rule = RATE_LIMITS[name];
  const ip = await clientKey();
  const key = `${name}:${ip}:${discriminator?.toLowerCase() ?? ""}`;

  const result = check(key, rule);
  if (result.allowed) {
    return null;
  }

  const response = errorResponse(
    "Too many attempts. Please wait a moment and try again.",
    429,
  );
  response.headers.set("Retry-After", String(result.retryAfterSeconds));
  return response;
}
