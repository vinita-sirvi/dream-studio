import Link from "next/link";

import { AdminDeleteButton } from "@/components/admin/admin-delete-button";
import { tryConnectToDatabase } from "@/lib/mongodb";
import { CustomOrder } from "@/lib/models";

export const dynamic = "force-dynamic";

type CustomOrderRow = {
  _id: string;
  orderId: string;
  name?: string;
  email?: string;
  productType?: string;
  stage?: string;
};

export default async function AdminCustomOrdersPage() {
  const connected = await tryConnectToDatabase();
  const customOrders = connected
    ? ((await CustomOrder.find({}).sort({ createdAt: -1 }).lean()) as CustomOrderRow[])
    : [];

  return (
    <main className="grid gap-6">
      <section className="rounded-[2rem] border border-[#eadccc] bg-white/85 p-8 shadow-[0_18px_42px_rgba(103,73,47,0.08)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8a6b56]">Admin / Custom Orders</p>
            <h1 className="mt-3 text-4xl font-medium text-[#2f2319]" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
              Custom order requests
            </h1>
          </div>
          <Link href="/custom-order" className="rounded-md bg-[#3b2417] px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white">
            Public Form
          </Link>
        </div>
      </section>

      <section className="overflow-hidden rounded-[1.8rem] border border-[#eadccc] bg-white/85 shadow-[0_16px_34px_rgba(103,73,47,0.08)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#fbf6ef] text-xs uppercase tracking-[0.18em] text-[#8a6b56]">
            <tr>
              <th className="px-4 py-4">Request</th>
              <th className="px-4 py-4">Customer</th>
              <th className="px-4 py-4">Stage</th>
              <th className="px-4 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customOrders.length ? (
              customOrders.map((order) => (
                <tr key={String(order._id)} className="border-t border-[#f0e3d6]">
                  <td className="px-4 py-4">
                    <div className="font-medium text-[#2f2319]">{order.orderId}</div>
                    <div className="text-xs text-[#6f5d50]">{order.productType}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="font-medium text-[#2f2319]">{order.name}</div>
                    <div className="text-xs text-[#6f5d50]">{order.email}</div>
                  </td>
                  <td className="px-4 py-4">{order.stage}</td>
                  <td className="px-4 py-4 flex gap-2">
                    <Link
                      href={`/admin/custom-orders/${String(order._id)}`}
                      className="rounded-md border border-[#d8c5b0] bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#3b2417]"
                    >
                      View
                    </Link>
                    <AdminDeleteButton resource="custom-orders" id={String(order._id)} />
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-t border-[#f0e3d6]">
                <td className="px-4 py-8 text-[#6f5d50]" colSpan={4}>
                  No custom orders found yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
