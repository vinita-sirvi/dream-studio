import Link from "next/link";

import { AdminDeleteButton } from "@/components/admin/admin-delete-button";
import { ensureSeedData } from "@/lib/seed";
import { connectToDatabase } from "@/lib/mongodb";
import { Category, Collection, Product } from "@/lib/models";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  await ensureSeedData();
  await connectToDatabase();
  const [products, categories, collections] = await Promise.all([
    Product.find({}).sort({ createdAt: -1 }).populate("categoryId collectionId").lean(),
    Category.find({}).lean(),
    Collection.find({}).lean(),
  ]);

  return (
    <main className="grid gap-6">
      <section className="rounded-[2rem] border border-[#dce4e3] bg-white/85 p-8 shadow-[0_18px_42px_rgba(15,30,30,0.08)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#b23a17]">
              Admin / Products
            </p>
            <h1
              className="mt-3 text-4xl font-medium text-[#0f1e1e]"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Product catalog
            </h1>
          </div>
          <Link href="/admin/products/new" className="rounded-md bg-[#0b1717] px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white">
            New Product
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-[#dce4e3] bg-[#eef3f2] px-5 py-4">Products: {products.length}</div>
          <div className="rounded-2xl border border-[#dce4e3] bg-[#eef3f2] px-5 py-4">Categories: {categories.length}</div>
          <div className="rounded-2xl border border-[#dce4e3] bg-[#eef3f2] px-5 py-4">Collections: {collections.length}</div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[1.8rem] border border-[#dce4e3] bg-white/85 shadow-[0_16px_34px_rgba(15,30,30,0.08)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#eef3f2] text-xs uppercase tracking-[0.18em] text-[#b23a17]">
            <tr>
              <th className="px-4 py-4">Product</th>
              <th className="px-4 py-4">Category</th>
              <th className="px-4 py-4">Price</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: any) => (
              <tr key={String(product._id)} className="border-t border-[#dce4e3]">
                <td className="px-4 py-4">
                  <div className="font-medium text-[#0f1e1e]">{product.name}</div>
                  <div className="text-xs text-[#4a5d5d]">{product.sku}</div>
                </td>
                <td className="px-4 py-4">{product.categoryId?.name ?? "Uncategorized"}</td>
                <td className="px-4 py-4">₹{(product.pricing?.sellingPrice ?? 0).toLocaleString("en-IN")}</td>
                <td className="px-4 py-4">{product.status}</td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/admin/products/${String(product._id)}`} className="rounded-md border border-[#c3cfce] bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#0b1717]">
                      Edit
                    </Link>
                    <AdminDeleteButton resource="products" id={String(product._id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
