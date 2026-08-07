import { NextRequest } from "next/server";

import { ensureDatabase } from "@/lib/mongodb";
import { errorResponse, serialize, successResponse } from "@/lib/http";
import { Product } from "@/lib/models";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const offline = await ensureDatabase();
  if (offline) return offline;
  const { slug } = await params;
  const product = await Product.findOne({ slug }).populate("categoryId collectionId");

  if (!product) {
    return errorResponse("Product not found.", 404);
  }

  return successResponse(serialize(product));
}
