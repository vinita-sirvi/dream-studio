import type { MetadataRoute } from "next";

const BASE = process.env.APP_URL ?? "http://localhost:3000";

/**
 * Crawl rules.
 *
 * Blocks the admin panel, API routes, and the signed-in account pages — none of
 * which are useful in an index, and all of which sit behind auth anyway.
 *
 * `/track-order` is deliberately *not* blocked: it is a public page that people
 * genuinely search for, it holds no order data of its own, and looking anything up
 * there requires both an order number and the matching email. It is listed in the
 * sitemap, so blocking it here would have been a contradiction.
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
          "/cart",
          "/checkout",
          "/wishlist",
          "/order-confirmed",
          "/verify-otp",
        ],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
