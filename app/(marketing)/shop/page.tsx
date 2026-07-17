import Link from "next/link";

import { ProductCard } from "@/components/site/product-card";
import { getShopData } from "@/lib/storefront";

export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const category = typeof params.category === "string" ? params.category : "";
  const collection = typeof params.collection === "string" ? params.collection : "";
  const { products, categories, collections, featuredProducts } = await getShopData({
    q,
    category,
    collection,
  });

  return (
    <main className="mx-auto w-full max-w-[1440px] px-4 py-10 md:px-8 lg:px-10">
      <section className="rounded-[2rem] border border-[#eadccc] bg-[linear-gradient(135deg,#fbf4eb,#f2e2d4)] p-8 shadow-[0_18px_42px_rgba(103,73,47,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8a6b56]">
          Shop
        </p>
        <h1
          className="mt-3 text-4xl font-medium text-[#2f2319] md:text-6xl"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Browse the full catalog, filtered by category and collection.
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-[#5f4f43]">
          This page is powered by MongoDB seed data, so the catalog is visible
          even on a fresh install. Replace the demo data with your own catalog
          whenever you are ready.
        </p>

        <form className="mt-8 grid gap-3 rounded-[1.4rem] border border-[#e3d2bf] bg-white/85 p-4 md:grid-cols-[1.2fr_0.8fr_0.8fr_auto]">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search products"
            className="rounded-xl border border-[#d8c5b0] bg-[#fcf8f2] px-4 py-3 text-sm outline-none"
          />
          <select
            name="category"
            defaultValue={category}
            className="rounded-xl border border-[#d8c5b0] bg-[#fcf8f2] px-4 py-3 text-sm outline-none"
          >
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
          <select
            name="collection"
            defaultValue={collection}
            className="rounded-xl border border-[#d8c5b0] bg-[#fcf8f2] px-4 py-3 text-sm outline-none"
          >
            <option value="">All collections</option>
            {collections.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-md bg-[#3b2417] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#533521]"
          >
            Filter
          </button>
        </form>
      </section>

      <section className="mt-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2
              className="text-2xl font-medium text-[#2f2319] md:text-3xl"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Featured selections
            </h2>
            <p className="mt-2 text-sm text-[#6f5d50]">
              Curated from seeded catalog data.
            </p>
          </div>
          <Link href="/custom-order" className="text-sm font-medium text-[#3b2417]">
            Need something bespoke?
          </Link>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.slug}
              product={product}
              href={`/products/${product.slug}`}
            />
          ))}
        </div>
      </section>

      <section className="mt-14">
        <div className="flex items-end justify-between gap-4">
          <h2
            className="text-2xl font-medium text-[#2f2319] md:text-3xl"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            All products
          </h2>
          <span className="text-sm text-[#6f5d50]">{products.length} items</span>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.slug}
              product={product}
              href={`/products/${product.slug}`}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
