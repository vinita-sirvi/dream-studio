import Link from "next/link";

import { getAdminSummary } from "@/lib/storefront";

export default async function AdminDashboardPage() {
  const summary = await getAdminSummary();

  return (
    <main className="grid gap-6">
      <section className="rounded-[2rem] border border-[#dce4e3] bg-[linear-gradient(135deg,#0b1717,#b23a17)] p-8 text-[#f5f9f8] shadow-[0_18px_42px_rgba(15,30,30,0.12)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#ffb199]">
          Admin Dashboard
        </p>
        <h1
          className="mt-4 text-4xl font-medium md:text-6xl"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Manage the boutique storefront, orders, and catalog.
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-[#a9bdbb]">
          This dashboard is connected to MongoDB and seeded with demo content,
          so you can edit products, categories, collections, and orders
          immediately after login.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/admin/products" className="rounded-md bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#0b1717]">
            Products
          </Link>
          <Link href="/admin/categories" className="rounded-md border border-white/20 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white">
            Categories
          </Link>
          <Link href="/admin/collections" className="rounded-md border border-white/20 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white">
            Collections
          </Link>
          <Link href="/admin/orders" className="rounded-md border border-white/20 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white">
            Orders
          </Link>
          <Link href="/admin/custom-orders" className="rounded-md border border-white/20 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white">
            Custom Orders
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Products", value: summary.productCount },
          { label: "Categories", value: summary.categoryCount },
          { label: "Collections", value: summary.collectionCount },
          { label: "Orders", value: summary.orderCount },
          { label: "Custom Orders", value: summary.customOrderCount ?? 0 },
        ].map((item) => (
          <div key={item.label} className="rounded-[1.5rem] border border-[#dce4e3] bg-white/85 p-6 shadow-[0_16px_34px_rgba(15,30,30,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b23a17]">
              {item.label}
            </p>
            <p className="mt-3 text-4xl font-semibold text-[#0f1e1e]">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[1.8rem] border border-[#dce4e3] bg-white/85 p-6 shadow-[0_16px_34px_rgba(15,30,30,0.08)]">
          <h2
            className="text-2xl font-medium text-[#0f1e1e]"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Recent products
          </h2>
          <div className="mt-5 space-y-3">
            {summary.recentProducts.map((product) => (
              <div key={product.slug} className="flex items-center justify-between rounded-2xl border border-[#dce4e3] bg-[#eef3f2] px-4 py-3">
                <div>
                  <p className="font-medium text-[#0f1e1e]">{product.name}</p>
                  <p className="text-sm text-[#4a5d5d]">{product.category ?? "Uncategorized"}</p>
                </div>
                <p className="text-sm font-semibold text-[#0f1e1e]">₹{product.price.toLocaleString("en-IN")}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.8rem] border border-[#dce4e3] bg-white/85 p-6 shadow-[0_16px_34px_rgba(15,30,30,0.08)]">
          <h2
            className="text-2xl font-medium text-[#0f1e1e]"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Recent orders
          </h2>
          <div className="mt-5 space-y-3">
            {summary.recentOrders.length ? summary.recentOrders.map((order) => (
              <div key={order.orderId} className="flex items-center justify-between rounded-2xl border border-[#dce4e3] bg-[#eef3f2] px-4 py-3">
                <div>
                  <p className="font-medium text-[#0f1e1e]">{order.customerName}</p>
                  <p className="text-sm text-[#4a5d5d]">{order.orderId}</p>
                </div>
                <p className="text-sm font-semibold text-[#0f1e1e]">{order.status}</p>
              </div>
            )) : (
              <p className="text-sm text-[#4a5d5d]">No recent orders yet.</p>
            )}
          </div>
        </div>

        <div className="rounded-[1.8rem] border border-[#dce4e3] bg-white/85 p-6 shadow-[0_16px_34px_rgba(15,30,30,0.08)]">
          <h2
            className="text-2xl font-medium text-[#0f1e1e]"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Recent custom orders
          </h2>
          <div className="mt-5 space-y-3">
            {summary.recentCustomOrders?.length ? summary.recentCustomOrders.map((order) => (
              <div key={order.orderId} className="flex items-center justify-between rounded-2xl border border-[#dce4e3] bg-[#eef3f2] px-4 py-3">
                <div>
                  <p className="font-medium text-[#0f1e1e]">{order.name}</p>
                  <p className="text-sm text-[#4a5d5d]">{order.productType}</p>
                </div>
                <p className="text-sm font-semibold text-[#0f1e1e]">{order.stage}</p>
              </div>
            )) : (
              <p className="text-sm text-[#4a5d5d]">No custom orders yet.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
