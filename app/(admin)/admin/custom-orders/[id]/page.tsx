import Link from "next/link";
import { notFound } from "next/navigation";

import { connectToDatabase } from "@/lib/mongodb";
import { CustomOrder } from "@/lib/models";

export const dynamic = "force-dynamic";

type CustomOrderDetails = {
  orderId: string;
  name?: string;
  email?: string;
  phone?: string;
  productType?: string;
  stage?: string;
  budget?: string;
  occasion?: string;
  deliveryDate?: string | Date;
  fabricPreference?: string;
  colorPreference?: string;
  embroideryPreference?: string;
  specialInstructions?: string;
};

export default async function AdminCustomOrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connectToDatabase();
  const { id } = await params;
  const order = (await CustomOrder.findOne({ _id: id }).lean()) as CustomOrderDetails | null;

  if (!order) {
    notFound();
  }

  const fields = [
    ["Order ID", order.orderId],
    ["Customer", order.name],
    ["Email", order.email],
    ["Phone", order.phone],
    ["Product Type", order.productType],
    ["Stage", order.stage],
    ["Budget", order.budget],
    ["Occasion", order.occasion],
    ["Delivery Date", order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString("en-IN") : "N/A"],
    ["Fabric", order.fabricPreference],
    ["Color", order.colorPreference],
    ["Embroidery", order.embroideryPreference],
    ["Special Instructions", order.specialInstructions],
  ] as const;

  return (
    <main className="grid gap-6">
      <section className="rounded-[2rem] border border-[#eadccc] bg-white/85 p-8 shadow-[0_18px_42px_rgba(103,73,47,0.08)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8a6b56]">Admin / Custom Orders</p>
            <h1
              className="mt-3 text-4xl font-medium text-[#2f2319]"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              {order.orderId}
            </h1>
          </div>
          <Link href="/admin/custom-orders" className="rounded-md border border-[#d8c5b0] bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#3b2417]">
            Back to list
          </Link>
        </div>
      </section>

      <section className="grid gap-4 rounded-[1.8rem] border border-[#eadccc] bg-white/85 p-6 shadow-[0_16px_34px_rgba(103,73,47,0.08)] md:grid-cols-2">
        {fields.map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-[#eadccc] bg-[#fbf6ef] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a6b56]">{label}</p>
            <p className="mt-2 text-sm leading-7 text-[#2f2319]">{value || "N/A"}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
