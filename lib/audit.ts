import "server-only";
import type { DbInput } from "./db-types";

import { headers } from "next/headers";

import { AuditLog } from "./models";
import type { SessionPayload } from "./session";

/**
 * Admin action logging.
 *
 * The `AuditLog` model and its `/api/admin/audit-logs` endpoint both existed, but
 * nothing ever wrote a row — so the admin could read an audit trail that was
 * permanently empty. Every mutation through the admin API now records who did
 * what, from where.
 *
 * Never throws: an audit write failing must not roll back or 500 the action the
 * admin actually asked for.
 */
export async function recordAudit({
  session,
  action,
  entity,
  entityId,
  metadata,
}: {
  session: SessionPayload;
  action: "create" | "update" | "delete";
  entity: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    const headerList = await headers();
    await AuditLog.create({
      actorId: session.user.id,
      actorEmail: session.user.email,
      action,
      entity,
      entityId,
      metadata: metadata ?? {},
      ip:
        headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        headerList.get("x-real-ip") ??
        undefined,
      userAgent: headerList.get("user-agent") ?? undefined,
    } as DbInput);
  } catch (error) {
    console.error("[audit] failed to record action", { action, entity, error });
  }
}

/**
 * Field names that must never be written into an audit payload, since audit rows
 * are readable through the admin API.
 */
const REDACTED = new Set([
  "password",
  "passwordHash",
  "otp",
  "otpHash",
  "token",
  "secret",
]);

/** Shallow copy of a payload with credential-ish fields masked. */
export function redactForAudit(payload: unknown): Record<string, unknown> {
  if (!payload || typeof payload !== "object") return {};

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload as Record<string, unknown>)) {
    result[key] = REDACTED.has(key) ? "[redacted]" : value;
  }
  return result;
}
