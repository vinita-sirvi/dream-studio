"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { cn } from "@/lib/cn";
import { formatRupees, orderedImages, type ProductImage } from "@/lib/product";

import { Icon } from "./icons";

// Re-exported for convenience so existing client-side imports keep working.
export { formatRupees, orderedImages };

export type ProductCardProduct = {
  name: string;
  slug: string;
  shortDescription?: string;
  price: number;
  mrp?: number;
  discountPercent?: number;
  category?: string;
  fabric?: string;
  stock?: number;
  images?: ProductImage[];
};

/**
 * Product card.
 *
 * Client component only because of the local wishlist toggle and hover image
 * swap. The wishlist state is deliberately local and unpersisted — there is no
 * wishlist API in this codebase, and inventing one is outside this redesign's
 * scope. It is presentational until a backend exists.
 */
export function ProductCard({
  product,
  href,
  priority = false,
  onQuickView,
  className,
}: {
  product: ProductCardProduct;
  href?: string;
  /** Set on above-the-fold cards so Next preloads them. */
  priority?: boolean;
  onQuickView?: (product: ProductCardProduct) => void;
  className?: string;
}) {
  const [wished, setWished] = useState(false);
  const images = orderedImages(product.images);
  const primary = images[0];
  const secondary = images[1];

  const target = href ?? `/products/${product.slug}`;
  const onSale = Boolean(product.mrp && product.mrp > product.price);
  const soldOut = product.stock === 0;

  return (
    <article className={cn("group/card relative flex flex-col", className)}>
      <div className="relative overflow-hidden rounded-card bg-surface-sunk">
        <Link
          href={target}
          className="block"
          aria-label={`${product.name}, ${formatRupees(product.price)}`}
        >
          <div className="relative aspect-4/5 w-full overflow-hidden">
            {primary ? (
              <>
                <Image
                  src={primary.url}
                  alt={primary.alt || product.name}
                  fill
                  // 2 cols on mobile, up to 4 on desktop — keeps the srcset tight.
                  sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, 45vw"
                  priority={priority}
                  className={cn(
                    "object-cover transition-[transform,opacity] duration-700 ease-[var(--ease-out-expo)]",
                    "group-hover/card:scale-[1.04]",
                    secondary && "group-hover/card:opacity-0",
                  )}
                />
                {/* Second shot cross-fades in on hover, where one exists. */}
                {secondary ? (
                  <Image
                    src={secondary.url}
                    alt=""
                    aria-hidden="true"
                    fill
                    sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, 45vw"
                    className="scale-[1.04] object-cover opacity-0 transition-opacity duration-700 ease-[var(--ease-out-expo)] group-hover/card:opacity-100"
                  />
                ) : null}
              </>
            ) : (
              <div className="grid h-full place-items-center px-6 text-center">
                <span className="eyebrow text-ink-faint">
                  Photography coming soon
                </span>
              </div>
            )}
          </div>
        </Link>

        {/* Badges */}
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-2">
          {soldOut ? (
            <span className="rounded-full bg-espresso px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-on-dark">
              Sold out
            </span>
          ) : null}
          {onSale && product.discountPercent ? (
            <span className="rounded-full bg-brass-wash px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-brass-ink">
              {product.discountPercent}% off
            </span>
          ) : null}
        </div>

        {/* Wishlist */}
        <button
          type="button"
          onClick={() => setWished((value) => !value)}
          aria-pressed={wished}
          aria-label={
            wished
              ? `Remove ${product.name} from wishlist`
              : `Save ${product.name} to wishlist`
          }
          className={cn(
            "absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full backdrop-blur-sm transition-all duration-300",
            wished
              ? "bg-surface text-danger"
              : "bg-surface/80 text-ink hover:bg-surface hover:text-brass-ink",
          )}
        >
          <Icon
            name={wished ? "heart-filled" : "heart"}
            className={cn(
              "h-[17px] w-[17px] transition-transform duration-300",
              wished && "scale-110",
            )}
          />
        </button>

        {/* Quick view — pointer-only affordance; the card link is the real path */}
        {onQuickView ? (
          <div className="absolute inset-x-3 bottom-3 hidden translate-y-2 opacity-0 transition-all duration-400 ease-[var(--ease-out-expo)] group-hover/card:translate-y-0 group-hover/card:opacity-100 lg:block">
            <button
              type="button"
              onClick={() => onQuickView(product)}
              className="w-full rounded-full bg-surface/95 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-ink backdrop-blur-sm transition-colors hover:bg-espresso hover:text-on-dark"
            >
              Quick view
            </button>
          </div>
        ) : null}
      </div>

      {/* Meta */}
      <div className="flex flex-1 flex-col gap-1.5 pt-4">
        {product.category ? (
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink-faint">
            {product.category}
          </p>
        ) : null}

        <h3 className="font-display text-lg leading-snug text-ink">
          <Link href={target} className="transition-colors hover:text-brass-ink">
            {product.name}
          </Link>
        </h3>

        {product.fabric ? (
          <p className="text-xs text-ink-soft">{product.fabric}</p>
        ) : null}

        <div className="mt-1 flex items-baseline gap-2.5">
          <span className="text-[15px] text-ink">
            {formatRupees(product.price)}
          </span>
          {onSale ? (
            <span className="text-xs text-ink-faint line-through">
              {formatRupees(product.mrp!)}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
