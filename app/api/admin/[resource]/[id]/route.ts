import { isValidObjectId } from "mongoose";
import { NextRequest } from "next/server";

import { requireAdmin } from "@/lib/api-auth";
import type { DbInput } from "@/lib/db-types";
import { recordAudit, redactForAudit } from "@/lib/audit";
import { ensureDatabase } from "@/lib/mongodb";
import { errorResponse, serialize, successResponse } from "@/lib/http";
import { enforceRateLimit } from "@/lib/rate-limit";
import {
  getResourceModel,
  getResourceSchema,
  getResourceSelect,
} from "@/lib/resource-registry";

export const dynamic = "force-dynamic";

/**
 * Resolve the resource and id for a request, rejecting unknown resources and
 * malformed ids.
 *
 * An id that is not a valid ObjectId used to reach Mongoose and throw a
 * CastError, surfacing as an unhandled 500. It is a client mistake, so it gets a
 * 400.
 */
async function resolveTarget(params: Promise<{ resource: string; id: string }>) {
  const { resource, id } = await params;

  const model = getResourceModel(resource);
  if (!model) {
    return { error: errorResponse("Unknown resource.", 404) };
  }

  if (!isValidObjectId(id)) {
    return { error: errorResponse("Invalid identifier.", 400) };
  }

  return { model, resource, id };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ resource: string; id: string }> },
) {
  // Same omission as the list endpoint: this had no authorization check, so any
  // document in any registered collection was readable by id.
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const target = await resolveTarget(params);
  if (target.error) return target.error;

  const offline = await ensureDatabase();
  if (offline) return offline;

  const select = getResourceSelect(target.resource);
  const query = target.model.findById(target.id);
  if (select) query.select(select);

  const item = await query.lean();
  if (!item) {
    return errorResponse("Item not found.", 404);
  }

  return successResponse(serialize(item));
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string; id: string }> },
) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const limited = await enforceRateLimit("mutation", auth.session.user.id);
  if (limited) return limited;

  const target = await resolveTarget(params);
  if (target.error) return target.error;

  const offline = await ensureDatabase();
  if (offline) return offline;

  const payload = await request.json().catch(() => null);
  if (!payload || typeof payload !== "object") {
    return errorResponse("Invalid JSON body.", 400);
  }

  const schema = getResourceSchema(target.resource);
  let data: DbInput = payload;

  if (schema) {
    const parsed = schema.safeParse(payload);
    if (!parsed.success) {
      return errorResponse("Validation failed.", 400, parsed.error.flatten());
    }
    // This is the fix for a subtle one: the previous handler validated the body,
    // then passed the *raw* `payload` to findByIdAndUpdate and discarded
    // `parsed.data` entirely. Validation was decorative — any extra field in the
    // body was written straight to the document.
    data = parsed.data as DbInput;
  }

  const updated = await target.model.findByIdAndUpdate(
    target.id,
    { $set: data },
    { new: true, runValidators: true },
  );

  if (!updated) {
    return errorResponse("Item not found.", 404);
  }

  await recordAudit({
    session: auth.session,
    action: "update",
    entity: target.resource,
    entityId: target.id,
    metadata: redactForAudit(data),
  });

  const select = getResourceSelect(target.resource);
  const output = select
    ? await target.model.findById(target.id).select(select).lean()
    : updated;

  return successResponse(serialize(output));
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ resource: string; id: string }> },
) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const limited = await enforceRateLimit("mutation", auth.session.user.id);
  if (limited) return limited;

  const target = await resolveTarget(params);
  if (target.error) return target.error;

  const offline = await ensureDatabase();
  if (offline) return offline;

  // An admin deleting their own account would leave them signed in with a session
  // for a user that no longer exists.
  if (target.resource === "users" && target.id === auth.session.user.id) {
    return errorResponse("You cannot delete your own account.", 400);
  }

  const deleted = await target.model.findByIdAndDelete(target.id);
  if (!deleted) {
    return errorResponse("Item not found.", 404);
  }

  await recordAudit({
    session: auth.session,
    action: "delete",
    entity: target.resource,
    entityId: target.id,
  });

  return successResponse({ deleted: true });
}
