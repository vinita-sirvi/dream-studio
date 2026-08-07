import Link from "next/link";

import { ProductForm } from "@/components/admin/product-form";
import { Category, Collection } from "@/lib/models";
import { connectToDatabase } from "@/lib/mongodb";
import { ensureSeedData } from "@/lib/seed";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  await ensureSeedData();
  await connectToDatabase();
  const [categories, collections] = await Promise.all([
    Category.find({}).lean(),
    Collection.find({}).lean(),
  ]);

  return (
    <main className="grid gap-6">
      <section className="rounded-[2rem] border border-[#dce4e3] bg-white/85 p-8 shadow-[0_18px_42px_rgba(15,30,30,0.08)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#b23a17]">
              Admin / Products / New
            </p>
            <h1 className="mt-3 text-4xl font-medium text-[#0f1e1e]" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
              Create product
            </h1>
          </div>
          <Link href="/admin/products" className="rounded-md border border-[#c3cfce] bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#0b1717]">
            Back
          </Link>
        </div>
      </section>
      <section className="rounded-[1.8rem] border border-[#dce4e3] bg-white/85 p-8 shadow-[0_16px_34px_rgba(15,30,30,0.08)]">
        <ProductForm
          mode="create"
          categories={categories.map((item: any) => ({ id: String(item._id), name: item.name }))}
          collections={collections.map((item: any) => ({ id: String(item._id), name: item.name }))}
        />
      </section>
    </main>
  );
}
