import Link from "next/link";

import { AdminDeleteButton } from "@/components/admin/admin-delete-button";
import { connectToDatabase } from "@/lib/mongodb";
import { ensureSeedData } from "@/lib/seed";
import { Order } from "@/lib/models";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  await ensureSeedData();
  await connectToDatabase();
  const orders = await Order.find({}).sort({ createdAt: -1 }).lean();

  return (
    <main className="grid gap-6">
      <section className="rounded-[2rem] border border-[#dce4e3] bg-white/85 p-8 shadow-[0_18px_42px_rgba(15,30,30,0.08)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#b23a17]">Admin / Orders</p>
            <h1 className="mt-3 text-4xl font-medium text-[#0f1e1e]" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
              Order management
            </h1>
          </div>
          <Link href="/admin/orders/new" className="rounded-md bg-[#0b1717] px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white">
            New Order
          </Link>
        </div>
      </section>

      <section className="overflow-hidden rounded-[1.8rem] border border-[#dce4e3] bg-white/85 shadow-[0_16px_34px_rgba(15,30,30,0.08)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#eef3f2] text-xs uppercase tracking-[0.18em] text-[#b23a17]">
            <tr>
              <th className="px-4 py-4">Order</th>
              <th className="px-4 py-4">Customer</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: any) => (
              <tr key={String(order._id)} className="border-t border-[#dce4e3]">
                <td className="px-4 py-4">
                  <div className="font-medium text-[#0f1e1e]">{order.orderId}</div>
                  <div className="text-xs text-[#4a5d5d]">{order.paymentMethod ?? "No payment"}</div>
                </td>
                <td className="px-4 py-4">{order.customerName}</td>
                <td className="px-4 py-4">{order.status}</td>
                <td className="px-4 py-4 flex gap-2">
                  <Link href={`/admin/orders/${String(order._id)}`} className="rounded-md border border-[#c3cfce] bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#0b1717]">
                    Edit
                  </Link>
                  <AdminDeleteButton resource="orders" id={String(order._id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
