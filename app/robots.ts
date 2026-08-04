import type { MetadataRoute } from "next";

const BASE = process.env.APP_URL ?? "http://localhost:3000";

/**
 * Crawl rules.
 *
 * Blocks the admin panel, API routes, and the signed-in account pages — none of
 * which are useful in an index, and all of which sit behind auth anyway.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api/",
          "/account",
          "/orders",
          "/saved-addresses",
          "/saved-measurements",
          "/track-order",
          "/cart",
          "/checkout",
          "/wishlist",
          "/verify-otp",
        ],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
