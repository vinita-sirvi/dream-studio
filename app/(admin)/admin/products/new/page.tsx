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
      <section className="rounded-[2rem] border border-[#eadccc] bg-white/85 p-8 shadow-[0_18px_42px_rgba(103,73,47,0.08)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8a6b56]">
              Admin / Products / New
            </p>
            <h1 className="mt-3 text-4xl font-medium text-[#2f2319]" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
              Create product
            </h1>
          </div>
          <Link href="/admin/products" className="rounded-md border border-[#d8c5b0] bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#3b2417]">
            Back
          </Link>
        </div>
      </section>
      <section className="rounded-[1.8rem] border border-[#eadccc] bg-white/85 p-8 shadow-[0_16px_34px_rgba(103,73,47,0.08)]">
        <ProductForm
          mode="create"
          categories={categories.map((item: any) => ({ id: String(item._id), name: item.name }))}
          collections={collections.map((item: any) => ({ id: String(item._id), name: item.name }))}
        />
      </section>
    </main>
  );
}
