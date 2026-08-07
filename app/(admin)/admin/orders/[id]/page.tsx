import Link from "next/link";
import { notFound } from "next/navigation";

import { OrderForm } from "@/components/admin/order-form";
import { Order } from "@/lib/models";
import { connectToDatabase } from "@/lib/mongodb";
import { ensureSeedData } from "@/lib/seed";

export const dynamic = "force-dynamic";

export default async function EditOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await ensureSeedData();
  await connectToDatabase();
  const order = await Order.findById(id).lean();

  if (!order) {
    notFound();
  }

  return (
    <main className="grid gap-6">
      <section className="rounded-[2rem] border border-[#dce4e3] bg-white/85 p-8 shadow-[0_18px_42px_rgba(15,30,30,0.08)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#b23a17]">Admin / Orders / Edit</p>
            <h1 className="mt-3 text-4xl font-medium text-[#0f1e1e]" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
              Edit order
            </h1>
          </div>
          <Link href="/admin/orders" className="rounded-md border border-[#c3cfce] bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#0b1717]">
            Back
          </Link>
        </div>
      </section>
      <section className="rounded-[1.8rem] border border-[#dce4e3] bg-white/85 p-8 shadow-[0_16px_34px_rgba(15,30,30,0.08)]">
        <OrderForm
          mode="edit"
          orderId={id}
          initialValues={{
            customerName: order.customerName,
            email: order.email,
            phone: order.phone,
            status: order.status,
            notes: order.notes,
            shippingMethod: order.shippingMethod,
            paymentMethod: order.paymentMethod,
            itemsJson: JSON.stringify(order.items ?? [], null, 2),
          }}
        />
      </section>
    </main>
  );
}
