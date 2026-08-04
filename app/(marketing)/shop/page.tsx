import type { Metadata } from "next";

import { IMAGES } from "@/data/home";
import { PageHero } from "@/components/site/page-hero";
import { ShopGrid } from "@/components/site/shop/shop-grid";
import { getShopData, type ShopSort } from "@/lib/storefront";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse the full atelier catalogue — kurtis, blouses, dresses, co-ord sets and lehengas, all available made to measure.",
};

const VALID_SORTS: ShopSort[] = [
  "newest",
  "price-asc",
  "price-desc",
  "name-asc",
];

function readString(
  params: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = params[key];
  return typeof value === "string" ? value : "";
}

function readNumber(
  params: Record<string, string | string[] | undefined>,
  key: string,
) {
  const raw = readString(params, key);
  if (!raw) return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
}

/**
 * Shop.
 *
 * All filtering, sorting and searching happens server-side from `searchParams`,
 * so every filtered view has a real, shareable, crawlable URL. The client layer
 * only makes navigating between those URLs feel instant.
 */
export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  const sortParam = readString(params, "sort");
  const sort = VALID_SORTS.includes(sortParam as ShopSort)
    ? (sortParam as ShopSort)
    : "newest";

  const query = readString(params, "q");

  const { products, categories, collections, priceRange } = await getShopData({
    q: query,
    category: readString(params, "category"),
    collection: readString(params, "collection"),
    minPrice: readNumber(params, "minPrice"),
    maxPrice: readNumber(params, "maxPrice"),
    sort,
  });

  return (
    <>
      <PageHero
        eyebrow="The Catalogue"
        title={
          query ? `Results for “${query}”` : "Every piece, made to your measure"
        }
        description="Each design below can be ordered as shown, or cut to your own measurements at no extra cost. Filter by category, collection or price."
        image={IMAGES.ethnic}
        crumbs={[{ label: "Shop" }]}
      />

      <div className="shell">
        <ShopGrid
          products={products}
          categories={categories}
          collections={collections}
          priceRange={priceRange}
        />
      </div>
    </>
  );
}
