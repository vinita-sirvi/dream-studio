import { NextRequest } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import { errorResponse, serialize, successResponse } from "@/lib/http";
import { getResourceModel, getResourceSchema } from "@/lib/resource-registry";
import { getCurrentSession, isAdminRole } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ resource: string; id: string }> },
) {
  await connectToDatabase();
  const { resource, id } = await params;
  const model = getResourceModel(resource);

  if (!model) {
    return errorResponse("Unknown resource.", 404);
  }

  const item = await model.findOne({ _id: id });
  if (!item) {
    return errorResponse("Item not found.", 404);
  }

  return successResponse(serialize(item));
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string; id: string }> },
) {
  await connectToDatabase();
  const session = await getCurrentSession();
  if (!isAdminRole(session?.user.role)) {
    return errorResponse("Unauthorized.", 401);
  }

  const { resource, id } = await params;
  const model = getResourceModel(resource);

  if (!model) {
    return errorResponse("Unknown resource.", 404);
  }

  const payload = await request.json().catch(() => null);
  if (!payload) {
    return errorResponse("Invalid JSON body.", 400);
  }

  const schema = getResourceSchema(resource);
  if (schema) {
    const parsed = schema.safeParse(payload);
    if (!parsed.success) {
      return errorResponse("Validation failed.", 400, parsed.error.flatten());
    }
  }

  const updated = await model.findByIdAndUpdate(id, payload, { new: true });
  if (!updated) {
    return errorResponse("Item not found.", 404);
  }

  return successResponse(serialize(updated));
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ resource: string; id: string }> },
) {
  await connectToDatabase();
  const session = await getCurrentSession();
  if (!isAdminRole(session?.user.role)) {
    return errorResponse("Unauthorized.", 401);
  }

  const { resource, id } = await params;
  const model = getResourceModel(resource);

  if (!model) {
    return errorResponse("Unknown resource.", 404);
  }

  const deleted = await model.findByIdAndDelete(id);
  if (!deleted) {
    return errorResponse("Item not found.", 404);
  }

  return successResponse({ deleted: true });
}
