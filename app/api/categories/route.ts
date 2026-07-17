import { NextRequest } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import { errorResponse, serialize, successResponse } from "@/lib/http";
import { Category } from "@/lib/models";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectToDatabase();
  const categories = await Category.find({ hidden: { $ne: true } }).sort({
    sortOrder: 1,
    createdAt: -1,
  });
  return successResponse(serialize(categories));
}

export async function POST(request: NextRequest) {
  await connectToDatabase();
  const payload = await request.json().catch(() => null);
  if (!payload) {
    return errorResponse("Invalid JSON body.", 400);
  }
  const created = await Category.create(payload);
  return successResponse(serialize(created), 201);
}
