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
      <section className="rounded-[2rem] border border-[#eadccc] bg-white/85 p-8 shadow-[0_18px_42px_rgba(103,73,47,0.08)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8a6b56]">
              Admin / Products
            </p>
            <h1
              className="mt-3 text-4xl font-medium text-[#2f2319]"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Product catalog
            </h1>
          </div>
          <Link href="/admin/products/new" className="rounded-md bg-[#3b2417] px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white">
            New Product
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-[#eadccc] bg-[#fbf6ef] px-5 py-4">Products: {products.length}</div>
          <div className="rounded-2xl border border-[#eadccc] bg-[#fbf6ef] px-5 py-4">Categories: {categories.length}</div>
          <div className="rounded-2xl border border-[#eadccc] bg-[#fbf6ef] px-5 py-4">Collections: {collections.length}</div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[1.8rem] border border-[#eadccc] bg-white/85 shadow-[0_16px_34px_rgba(103,73,47,0.08)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#fbf6ef] text-xs uppercase tracking-[0.18em] text-[#8a6b56]">
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
              <tr key={String(product._id)} className="border-t border-[#f0e3d6]">
                <td className="px-4 py-4">
                  <div className="font-medium text-[#2f2319]">{product.name}</div>
                  <div className="text-xs text-[#6f5d50]">{product.sku}</div>
                </td>
                <td className="px-4 py-4">{product.categoryId?.name ?? "Uncategorized"}</td>
                <td className="px-4 py-4">₹{(product.pricing?.sellingPrice ?? 0).toLocaleString("en-IN")}</td>
                <td className="px-4 py-4">{product.status}</td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/admin/products/${String(product._id)}`} className="rounded-md border border-[#d8c5b0] bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#3b2417]">
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
