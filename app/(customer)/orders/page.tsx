import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AccountHeader } from "@/components/site/account/account-panel";
import { OrderHistory } from "@/components/site/account/order-history";
import { getCurrentSession } from "@/lib/session";
import { getOrdersForUser } from "@/lib/storefront";

export const metadata: Metadata = { title: "My Orders" };

/**
 * Order history.
 *
 * Backed by `getOrdersForUser()`, which this page previously had no equivalent of.
 * The session is verified here rather than relying only on the group layout:
 * layouts do not re-render on every navigation, so a check there alone is not a
 * dependable guard for the data a page reads.
 */
export default async function OrdersPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login?next=/orders");

  const orders = await getOrdersForUser({
    userId: session.user.id,
    email: session.user.email,
  });

  return (
    <>
      <AccountHeader
        eyebrow="Orders"
        title="Your order history"
        description="Every commission and purchase, with its current stage in the workroom."
        action={{ label: "Track a parcel", href: "/track-order" }}
      />

      <OrderHistory orders={orders} />
    </>
  );
}
