import type { Metadata } from "next";

import {
  AccountEmpty,
  AccountHeader,
} from "@/components/site/account/account-panel";

export const metadata: Metadata = { title: "My Orders" };

/**
 * Order history.
 *
 * There is no per-user order query in lib/storefront.ts — orders are only read in
 * aggregate for the admin dashboard — so this shows a real empty state instead of
 * placeholder rows. Wiring it up needs a `getOrdersForUser(userId)` helper.
 */
export default function OrdersPage() {
  return (
    <>
      <AccountHeader
        eyebrow="Orders"
        title="Your order history"
        description="Every commission and purchase, with its current stage in the workroom."
        action={{ label: "Track a parcel", href: "/track-order" }}
      />

      <AccountEmpty
        icon="box"
        title="No orders yet"
        description="Once you place an order it will appear here, with its stage from cutting through to dispatch."
        primaryCta={{ label: "Browse the catalogue", href: "/shop" }}
        secondaryCta={{ label: "Commission a piece", href: "/custom-order" }}
      />
    </>
  );
}
