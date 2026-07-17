import { notFound } from "next/navigation";

import { ProductCard } from "@/components/site/product-card";
import { getProductBySlug } from "@/lib/storefront";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { product } = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product not found | Divya & Design",
    };
  }

  return {
    title: `${product.name} | Divya & Design`,
    description: product.shortDescription ?? product.description,
  };
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { product, relatedProducts } = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-[1440px] px-4 py-10 md:px-8 lg:px-10">
      <section className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
        <div className="overflow-hidden rounded-[2rem] border border-[#eadccc] bg-white shadow-[0_18px_42px_rgba(103,73,47,0.08)]">
          <div className="aspect-[4/5] bg-[linear-gradient(135deg,#f7e6da,#f0d5ca_45%,#e8c9d2)]">
            <div className="flex h-full flex-col justify-between p-6">
              <div className="flex items-start justify-between">
                <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#2f2319]">
                  {product.category ?? "Shop"}
                </span>
                <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#2f2319]">
                  {product.stock} in stock
                </span>
              </div>
              <div className="mx-auto mb-6 h-[62%] w-[58%] rounded-[42%_42%_18%_18%/22%_22%_10%_10%] bg-white/35 shadow-[0_18px_42px_rgba(94,67,43,0.12)]" />
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#eadccc] bg-white/85 p-8 shadow-[0_18px_42px_rgba(103,73,47,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8a6b56]">
            Product Details
          </p>
          <h1
            className="mt-3 text-4xl font-medium text-[#2f2319] md:text-5xl"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            {product.name}
          </h1>
          <p className="mt-4 text-base leading-8 text-[#5f4f43]">
            {product.description}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-3xl font-semibold text-[#2f2319]">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.mrp && product.mrp > product.price ? (
              <span className="text-base text-[#8a7768] line-through">
                ₹{product.mrp.toLocaleString("en-IN")}
              </span>
            ) : null}
            {product.discountPercent ? (
              <span className="rounded-full bg-[#f0e1d4] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#7a4f2f]">
                {product.discountPercent}% off
              </span>
            ) : null}
          </div>

          <div className="mt-8 grid gap-3 text-sm text-[#49382d] md:grid-cols-2">
            <div className="rounded-2xl border border-[#eadccc] bg-[#fbf6ef] px-4 py-3">
              Fabric: {product.fabric ?? "Premium blend"}
            </div>
            <div className="rounded-2xl border border-[#eadccc] bg-[#fbf6ef] px-4 py-3">
              Color: {product.color ?? "Custom"}
            </div>
            <div className="rounded-2xl border border-[#eadccc] bg-[#fbf6ef] px-4 py-3">
              Stock: {product.stock}
            </div>
            <div className="rounded-2xl border border-[#eadccc] bg-[#fbf6ef] px-4 py-3">
              SKU: {product.sku}
            </div>
          </div>

          {product.highlights?.length ? (
            <div className="mt-8">
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#8a6b56]">
                Highlights
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {(product.highlights as string[]).map((item: string) => (
                  <span
                    key={item}
                    className="rounded-full border border-[#eadccc] bg-[#fcf8f2] px-3 py-2 text-sm text-[#49382d]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/custom-order"
              className="rounded-md bg-[#3b2417] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#533521]"
            >
              Customize
            </a>
            <a
              href="/shop"
              className="rounded-md border border-[#d8c5b0] bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#3b2417] transition hover:bg-[#faf5ee]"
            >
              Back to Shop
            </a>
          </div>
        </div>
      </section>

      {relatedProducts.length ? (
        <section className="mt-14">
          <h2
            className="text-2xl font-medium text-[#2f2319] md:text-3xl"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Related products
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {relatedProducts.map((item) => (
              <ProductCard key={item.slug} product={item} href={`/products/${item.slug}`} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
