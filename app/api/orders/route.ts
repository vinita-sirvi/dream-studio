import { NextRequest } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import { errorResponse, serialize, successResponse } from "@/lib/http";
import { Order } from "@/lib/models";
import { orderSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectToDatabase();
  const orders = await Order.find({}).sort({ createdAt: -1 }).limit(20);
  return successResponse(serialize(orders));
}

export async function POST(request: NextRequest) {
  await connectToDatabase();
  const payload = await request.json().catch(() => null);
  const parsed = orderSchema.safeParse(payload);

  if (!parsed.success) {
    return errorResponse("Invalid order submission.", 400, parsed.error.flatten());
  }

  const created = await Order.create({
    ...parsed.data,
    orderId: `ORD-${Date.now()}`,
  } as any);

  return successResponse(serialize(created), 201);
}
