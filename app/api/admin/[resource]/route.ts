import { NextRequest } from "next/server";

import { requireAdmin } from "@/lib/api-auth";
import { recordAudit, redactForAudit } from "@/lib/audit";
import { connectToDatabase } from "@/lib/mongodb";
import { errorResponse, serialize, successResponse } from "@/lib/http";
import { enforceRateLimit } from "@/lib/rate-limit";
import {
  getResourceModel,
  getResourceSchema,
  getResourceSelect,
  isPublicWriteResource,
} from "@/lib/resource-registry";

export const dynamic = "force-dynamic";

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

/**
 * Clamp pagination. `Number(searchParams.get("limit"))` alone yields NaN for
 * `?limit=abc`, which Mongoose passes through as "no limit" — an easy way to ask
 * for the entire collection in one request.
 */
function readPagination(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const rawLimit = Number(searchParams.get("limit"));
  const limit = Number.isFinite(rawLimit) && rawLimit > 0
    ? Math.min(Math.trunc(rawLimit), MAX_LIMIT)
    : DEFAULT_LIMIT;

  const rawPage = Number(searchParams.get("page"));
  const page = Number.isFinite(rawPage) && rawPage > 1 ? Math.trunc(rawPage) : 1;

  return { limit, skip: (page - 1) * limit, page };
}

/**
 * List a resource.
 *
 * This handler previously had no authorization check whatsoever — only POST did.
 * `GET /api/admin/users` returned every user document including `passwordHash`
 * and `otpHash`, and `GET /api/admin/orders` returned every customer's name,
 * email, phone and address, to anyone who asked. Both are now admin-only, and
 * credential fields are stripped by the registry's `select` projection as a second
 * layer in case a new resource forgets.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string }> },
) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { resource } = await params;
  const model = getResourceModel(resource);
  if (!model) {
    return errorResponse("Unknown resource.", 404);
  }

  await connectToDatabase();

  const { limit, skip, page } = readPagination(request);
  const select = getResourceSelect(resource);

  const query = model.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit);
  if (select) query.select(select);

  const [items, total] = await Promise.all([
    query.lean(),
    model.countDocuments({}),
  ]);

  return successResponse({
    items: serialize(items),
    page,
    limit,
    total,
    hasMore: skip + items.length < total,
  });
}

/**
 * Create a resource.
 *
 * Public-write resources (the contact form, newsletter signup and the public
 * custom-order brief) stay open but are rate limited — they insert a document per
 * request, so without a limit they are a free way to fill the database.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string }> },
) {
  const { resource } = await params;
  const model = getResourceModel(resource);
  if (!model) {
    return errorResponse("Unknown resource.", 404);
  }

  const isPublic = isPublicWriteResource(resource);
  let session = null;

  if (isPublic) {
    const limited = await enforceRateLimit("publicForm");
    if (limited) return limited;
  } else {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;
    session = auth.session;

    const limited = await enforceRateLimit("mutation", session.user.id);
    if (limited) return limited;
  }

  await connectToDatabase();

  const payload = await request.json().catch(() => null);
  if (!payload || typeof payload !== "object") {
    return errorResponse("Invalid JSON body.", 400);
  }

  const schema = getResourceSchema(resource);
  // Only the parsed result is written. Writing the raw body would let a caller
  // set fields the schema does not know about — `role` on a user, say.
  const data = schema ? schema.safeParse(payload) : null;

  if (data && !data.success) {
    return errorResponse("Validation failed.", 400, data.error.flatten());
  }

  const created = await model.create(
    (data ? data.data : payload) as Record<string, any>,
  );

  if (session) {
    await recordAudit({
      session,
      action: "create",
      entity: resource,
      entityId: String(created._id),
      metadata: redactForAudit(data ? data.data : payload),
    });
  }

  const select = getResourceSelect(resource);
  const output = select
    ? await model.findById(created._id).select(select).lean()
    : created;

  return successResponse(serialize(output), 201);
}
