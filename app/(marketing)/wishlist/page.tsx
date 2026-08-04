import type { Metadata } from "next";

import { EmptyState } from "@/components/site/empty-state";
import { PageHero } from "@/components/site/page-hero";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Pieces you have saved.",
};

/**
 * Wishlist.
 *
 * The heart control on product cards is local, unpersisted UI — there is no
 * wishlist API in this codebase, so saved items cannot survive a reload. This
 * page states that plainly instead of appearing broken.
 */
export default function WishlistPage() {
  return (
    <>
      <PageHero
        eyebrow="Wishlist"
        title="Your saved pieces"
        description="Keep a running list of what you are considering, and share it with us when you are ready to order."
        crumbs={[{ label: "Wishlist" }]}
      />
      <EmptyState
        icon="heart"
        title="No saved pieces yet"
        description="Tap the heart on any piece to shortlist it while you browse."
        primaryCta={{ label: "Browse the catalogue", href: "/shop" }}
        secondaryCta={{ label: "View collections", href: "/collections" }}
        note="Saving is not yet synced to your account, so a shortlist will not survive a page reload. Sign in and it will once accounts support it."
      />
    </>
  );
}
