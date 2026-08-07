import { NextRequest } from "next/server";

import { ensureDatabase } from "@/lib/mongodb";
import { errorResponse, serialize, successResponse } from "@/lib/http";
import { Product } from "@/lib/models";
import { getCurrentSession, isAdminRole } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const offline = await ensureDatabase();
  if (offline) return offline;

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  const categoryId = searchParams.get("categoryId");
  const collectionId = searchParams.get("collectionId");
  const status = searchParams.get("status");
  const limit = Number(searchParams.get("limit") ?? 20);

  const query: Record<string, unknown> = {};
  if (q) {
    query.$or = [
      { name: new RegExp(q, "i") },
      { shortDescription: new RegExp(q, "i") },
      { tags: new RegExp(q, "i") },
    ];
  }
  if (categoryId) query.categoryId = categoryId;
  if (collectionId) query.collectionId = collectionId;
  if (status) query.status = status;

  const products = await Product.find(query).sort({ createdAt: -1 }).limit(limit);
  return successResponse(serialize(products));
}

export async function POST(request: NextRequest) {
  const offline = await ensureDatabase();
  if (offline) return offline;
  const session = await getCurrentSession();
  if (!isAdminRole(session?.user.role)) {
    return errorResponse("Unauthorized.", 401);
  }
  const payload = await request.json().catch(() => null);
  if (!payload) {
    return errorResponse("Invalid JSON body.", 400);
  }

  const created = await Product.create(payload);
  return successResponse(serialize(created), 201);
}
