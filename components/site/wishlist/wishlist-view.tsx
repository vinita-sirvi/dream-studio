"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Icon } from "@/components/site/icons";
import { Button, ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { formatRupees } from "@/lib/product";

type WishlistItem = {
  id: string;
  name: string;
  slug: string;
  price: number;
  mrp: number;
  image: string | null;
  inStock: boolean;
};

/**
 * Saved pieces.
 *
 * Server-rendered from the `Wishlist` collection, so the list survives a reload and
 * follows the customer between devices once signed in. Removing or moving to the
 * bag calls the API and refreshes the server render rather than mutating a local
 * copy, which keeps this in step with the header badge.
 */
export function WishlistView({ items }: { items: WishlistItem[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function remove(item: WishlistItem) {
    setBusyId(item.id);
    setNotice(null);

    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: item.id }),
      });
      if (!response.ok) {
        setNotice("Could not update your list. Please try again.");
        return;
      }
      router.refresh();
    } catch {
      setNotice("Could not reach the studio. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  async function moveToBag(item: WishlistItem) {
    setBusyId(item.id);
    setNotice(null);

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: item.id, quantity: 1 }),
      });
      const body = await response.json();

      if (!response.ok) {
        setNotice(body?.message ?? "Could not add that to your bag.");
        return;
      }

      // Adding to the bag also clears it from the saved list — leaving it in both
      // places invites ordering the same piece twice.
      await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: item.id }),
      });

      router.refresh();
    } catch {
      setNotice("Could not reach the studio. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  if (!items.length) {
    return (
      <section className="shell py-20 md:py-28">
        <div className="mx-auto max-w-2xl rounded-panel border border-line bg-canvas-warm px-8 py-16 text-center md:px-14 md:py-20">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-line-strong bg-canvas text-brass">
            <Icon name="heart" className="h-7 w-7" />
          </span>
          <h2 className="mt-8 display-md text-ink">No saved pieces yet</h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-8 text-ink-soft">
            Tap the heart on any piece to shortlist it while you browse. Your list
            is kept, and follows you once you sign in.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/shop" size="lg">
              Browse the catalogue
              <Icon name="arrow-right" className="h-4 w-4" />
            </ButtonLink>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="shell py-14 md:py-20">
      {notice ? (
        <p
          role="alert"
          className="mb-8 rounded-xl border border-line bg-brass-wash px-5 py-4 text-sm leading-6 text-brass-ink"
        >
          {notice}
        </p>
      ) : null}

      <ul className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => {
          const busy = busyId === item.id;
          const onSale = item.mrp > item.price;

          return (
            <li
              key={item.id}
              className={cn("flex flex-col transition-opacity", busy && "opacity-60")}
            >
              <div className="relative overflow-hidden rounded-card bg-surface-sunk">
                <Link href={`/products/${item.slug}`} className="block">
                  <div className="relative aspect-4/5 w-full">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, 45vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="grid h-full place-items-center px-6 text-center">
                        <span className="eyebrow text-ink-faint">
                          Photography coming soon
                        </span>
                      </div>
                    )}
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() => remove(item)}
                  disabled={busy}
                  aria-label={`Remove ${item.name} from saved pieces`}
                  className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-surface/90 text-danger backdrop-blur-sm transition-colors hover:bg-surface disabled:opacity-50"
                >
                  <Icon name="heart-filled" className="h-[17px] w-[17px]" />
                </button>

                {!item.inStock ? (
                  <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-espresso px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-on-dark">
                    Sold out
                  </span>
                ) : null}
              </div>

              <div className="flex flex-1 flex-col gap-1.5 pt-4">
                <h3 className="font-display text-lg leading-snug text-ink">
                  <Link
                    href={`/products/${item.slug}`}
                    className="transition-colors hover:text-brass-ink"
                  >
                    {item.name}
                  </Link>
                </h3>

                <div className="flex items-baseline gap-2.5">
                  <span className="text-[15px] text-ink">
                    {formatRupees(item.price)}
                  </span>
                  {onSale ? (
                    <span className="text-xs text-ink-faint line-through">
                      {formatRupees(item.mrp)}
                    </span>
                  ) : null}
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => moveToBag(item)}
                  disabled={busy || !item.inStock}
                  className="mt-3 w-full"
                >
                  {item.inStock ? "Move to bag" : "Sold out"}
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
