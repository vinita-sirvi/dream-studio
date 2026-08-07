import type { MetadataRoute } from "next";

import { getShopData } from "@/lib/storefront";

const BASE = process.env.APP_URL ?? "http://localhost:3000";

/**
 * Sitemap.
 *
 * Public marketing routes plus one entry per published product. Signed-in
 * (customer) and admin routes are deliberately excluded — they are behind auth
 * and should not be indexed.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: Array<{
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }> = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/shop", priority: 0.9, changeFrequency: "daily" },
    { path: "/custom-order", priority: 0.9, changeFrequency: "monthly" },
    { path: "/collections", priority: 0.8, changeFrequency: "weekly" },
    { path: "/categories", priority: 0.8, changeFrequency: "monthly" },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" },
    { path: "/size-guide", priority: 0.7, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
    { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
    { path: "/blogs", priority: 0.6, changeFrequency: "weekly" },
    { path: "/track-order", priority: 0.5, changeFrequency: "yearly" },
    { path: "/return-policy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  ];

  const now = new Date();

  const entries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${BASE}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // Products. Wrapped because a missing/unreachable database must not fail the
  // build — the static routes above are still worth serving.
  try {
    const { products } = await getShopData();
    for (const product of products) {
      entries.push({
        url: `${BASE}/products/${product.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  } catch {
    // Static routes only.
  }

  return entries;
}
