"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/cn";
import { Dialog } from "@/components/ui/overlay";
import { ButtonLink } from "@/components/ui/button";
import { ProductGridSkeleton } from "@/components/ui/skeleton";
import { Reveal } from "@/components/motion/reveal";

import { ProductCard, type ProductCardProduct } from "../product-card";
import { formatRupees, orderedImages } from "@/lib/product";
import { FilterBar } from "./filter-bar";
import { Icon } from "../icons";

type Option = { slug: string; name: string };

/**
 * Shop results area: filters, grid, quick-view dialog and empty state.
 *
 * Products arrive already filtered and sorted from the server. This component
 * owns only the transient UI — pending state and the quick-view dialog.
 */
export function ShopGrid({
  products,
  categories,
  collections,
  priceRange,
}: {
  products: ProductCardProduct[];
  categories: Option[];
  collections: Option[];
  priceRange: { min: number; max: number };
}) {
  const [pending, setPending] = useState(false);
  const [quickView, setQuickView] = useState<ProductCardProduct | null>(null);

  return (
    <>
      <FilterBar
        categories={categories}
        collections={collections}
        priceRange={priceRange}
        resultCount={products.length}
        onPendingChange={setPending}
      />

      <div className="pb-24 pt-4">
        {pending ? (
          <ProductGridSkeleton count={8} />
        ) : products.length ? (
          <Reveal
            stagger={0.06}
            className={cn(
              "grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-3 lg:gap-x-6 xl:grid-cols-4",
            )}
          >
            {products.map((product, index) => (
              <ProductCard
                key={product.slug}
                product={product}
                // First row is above the fold on most viewports.
                priority={index < 4}
                onQuickView={setQuickView}
              />
            ))}
          </Reveal>
        ) : (
          <EmptyState />
        )}
      </div>

      <QuickView product={quickView} onClose={() => setQuickView(null)} />
    </>
  );
}

function EmptyState() {
  return (
    <div className="rounded-panel border border-line bg-canvas-warm px-8 py-20 text-center">
      <Icon name="search" className="mx-auto h-8 w-8 text-brass" />
      <p className="mt-5 font-display text-2xl text-ink">
        Nothing matches those filters
      </p>
      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-ink-soft">
        Try widening the price range or clearing a category. If you have
        something specific in mind, we can make it from scratch.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/shop" variant="secondary">
          Clear filters
        </ButtonLink>
        <ButtonLink href="/custom-order">
          Commission a piece
          <Icon name="arrow-right" className="h-4 w-4" />
        </ButtonLink>
      </div>
    </div>
  );
}

/** Compact preview so browsing is not interrupted by a full page load. */
function QuickView({
  product,
  onClose,
}: {
  product: ProductCardProduct | null;
  onClose: () => void;
}) {
  if (!product) return null;

  const image = orderedImages(product.images)[0];
  const onSale = Boolean(product.mrp && product.mrp > product.price);

  return (
    <Dialog
      open
      onClose={onClose}
      title={product.name}
      hideTitle
      className="sm:max-w-4xl"
    >
      <div className="grid gap-8 sm:grid-cols-2">
        <div className="relative aspect-4/5 overflow-hidden rounded-card bg-surface-sunk">
          {image ? (
            <Image
              src={image.url}
              alt={image.alt || product.name}
              fill
              sizes="(min-width: 640px) 40vw, 90vw"
              className="object-cover"
            />
          ) : (
            <div className="grid h-full place-items-center">
              <span className="eyebrow text-ink-faint">No photograph yet</span>
            </div>
          )}
        </div>

        <div className="flex flex-col">
          {product.category ? (
            <p className="eyebrow text-brass-ink">{product.category}</p>
          ) : null}

          <h2 className="mt-4 display-md text-ink">{product.name}</h2>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-xl text-ink">
              {formatRupees(product.price)}
            </span>
            {onSale ? (
              <span className="text-sm text-ink-faint line-through">
                {formatRupees(product.mrp!)}
              </span>
            ) : null}
            {product.discountPercent ? (
              <span className="rounded-full bg-brass-wash px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-brass-ink">
                {product.discountPercent}% off
              </span>
            ) : null}
          </div>

          {product.shortDescription ? (
            <p className="mt-5 text-sm leading-7 text-ink-soft">
              {product.shortDescription}
            </p>
          ) : null}

          <dl className="mt-6 grid gap-2.5 text-sm">
            {product.fabric ? (
              <div className="flex gap-2">
                <dt className="text-ink-faint">Fabric</dt>
                <dd className="text-ink">{product.fabric}</dd>
              </div>
            ) : null}
            {typeof product.stock === "number" ? (
              <div className="flex gap-2">
                <dt className="text-ink-faint">Availability</dt>
                <dd className="text-ink">
                  {product.stock > 0
                    ? `${product.stock} in stock`
                    : "Made to order"}
                </dd>
              </div>
            ) : null}
          </dl>

          <div className="mt-auto flex flex-col gap-3 pt-8">
            <ButtonLink href={`/products/${product.slug}`} className="w-full">
              View full details
              <Icon name="arrow-right" className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink
              href="/custom-order"
              variant="secondary"
              className="w-full"
            >
              Make it to measure
            </ButtonLink>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
