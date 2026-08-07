import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductForm } from "@/components/admin/product-form";
import { Category, Collection, Product } from "@/lib/models";
import { connectToDatabase } from "@/lib/mongodb";
import { ensureSeedData } from "@/lib/seed";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await ensureSeedData();
  await connectToDatabase();
  const [product, categories, collections] = await Promise.all([
    Product.findById(id).lean(),
    Category.find({}).lean(),
    Collection.find({}).lean(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <main className="grid gap-6">
      <section className="rounded-[2rem] border border-[#dce4e3] bg-white/85 p-8 shadow-[0_18px_42px_rgba(15,30,30,0.08)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#b23a17]">
              Admin / Products / Edit
            </p>
            <h1 className="mt-3 text-4xl font-medium text-[#0f1e1e]" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
              Edit product
            </h1>
          </div>
          <Link href="/admin/products" className="rounded-md border border-[#c3cfce] bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#0b1717]">
            Back
          </Link>
        </div>
      </section>
      <section className="rounded-[1.8rem] border border-[#dce4e3] bg-white/85 p-8 shadow-[0_16px_34px_rgba(15,30,30,0.08)]">
        <ProductForm
          mode="edit"
          productId={id}
          initialValues={{
            name: product.name,
            slug: product.slug,
            sku: product.sku,
            description: product.description,
            shortDescription: product.shortDescription,
            categoryId: product.categoryId ? String(product.categoryId) : "",
            collectionId: product.collectionId ? String(product.collectionId) : "",
            brand: product.brand,
            color: product.color,
            fabric: product.fabric,
            status: product.status,
            visibility: product.visibility,
            mrp: product.pricing?.mrp,
            sellingPrice: product.pricing?.sellingPrice,
            discountPercent: product.pricing?.discountPercent,
            stock: product.inventory?.stock,
            tags: (product.tags ?? []).join(", "),
            images: (product.images ?? []).map((image: any, index: number) => ({
              url: image.url ?? "",
              alt: image.alt ?? "",
              type: image.type ?? "image",
              isPrimary: Boolean(image.isPrimary) || index === 0,
              sortOrder: image.sortOrder ?? index,
            })),
            highlights: product.highlights ?? [],
            specifications: (product.specifications ?? []).map((item: any) => ({
              label: item.label ?? "",
              value: item.value ?? "",
            })),
            customizationEnabled: product.customization?.enabled,
            measurementsEnabled: product.customization?.measurements,
          }}
          categories={categories.map((item: any) => ({ id: String(item._id), name: item.name }))}
          collections={collections.map((item: any) => ({ id: String(item._id), name: item.name }))}
        />
      </section>
    </main>
  );
}
