import Link from "next/link";
import { notFound } from "next/navigation";

import { CategoryForm } from "@/components/admin/category-form";
import { Category } from "@/lib/models";
import { connectToDatabase } from "@/lib/mongodb";
import { ensureSeedData } from "@/lib/seed";

export const dynamic = "force-dynamic";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await ensureSeedData();
  await connectToDatabase();
  const [category, categories] = await Promise.all([
    Category.findById(id).lean(),
    Category.find({}).lean(),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <main className="grid gap-6">
      <section className="rounded-[2rem] border border-[#eadccc] bg-white/85 p-8 shadow-[0_18px_42px_rgba(103,73,47,0.08)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8a6b56]">Admin / Categories / Edit</p>
            <h1 className="mt-3 text-4xl font-medium text-[#2f2319]" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
              Edit category
            </h1>
          </div>
          <Link href="/admin/categories" className="rounded-md border border-[#d8c5b0] bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#3b2417]">
            Back
          </Link>
        </div>
      </section>
      <section className="rounded-[1.8rem] border border-[#eadccc] bg-white/85 p-8 shadow-[0_16px_34px_rgba(103,73,47,0.08)]">
        <CategoryForm
          mode="edit"
          categoryId={id}
          initialValues={{
            name: category.name,
            slug: category.slug,
            description: category.description,
            parentId: category.parentId ? String(category.parentId) : "",
            image: category.image,
            sortOrder: category.sortOrder,
            featured: category.featured,
            hidden: category.hidden,
          }}
          parentOptions={categories.map((item: any) => ({ id: String(item._id), name: item.name }))}
        />
      </section>
    </main>
  );
}
