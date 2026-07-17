import { NextRequest } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import {
  errorResponse,
  serialize,
  successResponse,
} from "@/lib/http";
import {
  getResourceModel,
  getResourceSchema,
  isPublicWriteResource,
} from "@/lib/resource-registry";
import { isAdminRole, getCurrentSession } from "@/lib/session";

export const dynamic = "force-dynamic";

function canWrite(resource: string, role: string | undefined) {
  return isPublicWriteResource(resource) || isAdminRole(role as never);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string }> },
) {
  await connectToDatabase();
  const { resource } = await params;
  const model = getResourceModel(resource);

  if (!model) {
    return errorResponse("Unknown resource.", 404);
  }

  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") ?? 50);
  const items = await model.find({}).sort({ createdAt: -1 }).limit(limit);
  return successResponse(serialize(items));
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string }> },
) {
  await connectToDatabase();
  const { resource } = await params;
  const model = getResourceModel(resource);

  if (!model) {
    return errorResponse("Unknown resource.", 404);
  }

  const session = await getCurrentSession();
  if (!canWrite(resource, session?.user.role)) {
    return errorResponse("Unauthorized.", 401);
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

    const created = await model.create(parsed.data as Record<string, any>);
    return successResponse(serialize(created), 201);
  }

  const created = await model.create(payload);
  return successResponse(serialize(created), 201);
}
