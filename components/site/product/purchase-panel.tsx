"use client";

import { useState } from "react";

import { cn } from "@/lib/cn";
import { ButtonLink } from "@/components/ui/button";
import { AddToCart } from "@/components/site/cart/add-to-cart";

import { Icon } from "../icons";
import { SizeGuideDrawer } from "./size-guide-drawer";

const SIZES = ["XS", "S", "M", "L", "XL", "2XL"] as const;

/**
 * Purchase controls: size selection, made-to-measure toggle, and CTAs.
 *
 * Two genuine routes to buy, chosen by the fit selection:
 *
 *  - Standard size adds to the cart (`/api/cart`), which prices the line
 *    server-side and checks stock.
 *  - Made to measure goes to the commission flow, since it needs measurements and
 *    a tailor's quotation before an amount exists.
 *
 * A standard-size selection is required before adding, so the order records which
 * size to cut — silently defaulting one would be worse than asking.
 */
export function PurchasePanel({
  productId,
  productName,
  productSlug,
  inStock,
}: {
  /** Absent for demo-catalogue products, which have no database id to add. */
  productId?: string;
  productName: string;
  productSlug: string;
  inStock: boolean;
}) {
  const [size, setSize] = useState<string | null>(null);
  const [madeToMeasure, setMadeToMeasure] = useState(false);

  const commissionHref = `/custom-order?product=${encodeURIComponent(
    productSlug,
  )}${size && !madeToMeasure ? `&size=${size}` : ""}${
    madeToMeasure ? "&fit=made-to-measure" : ""
  }`;

  return (
    <div className="mt-9 border-t border-line pt-8">
      {/* Fit choice */}
      <fieldset>
        <legend className="flex w-full items-center justify-between">
          <span className="eyebrow text-ink-faint">Choose your fit</span>
          <SizeGuideDrawer />
        </legend>

        <div className="mt-4 grid gap-2.5">
          <label
            className={cn(
              "flex cursor-pointer items-start gap-3.5 rounded-xl border p-4 transition-colors",
              !madeToMeasure
                ? "border-brass bg-brass-wash"
                : "border-line hover:border-line-strong",
            )}
          >
            <input
              type="radio"
              name="fit"
              checked={!madeToMeasure}
              onChange={() => setMadeToMeasure(false)}
              className="mt-1 accent-[var(--color-brass-ink)]"
            />
            <span>
              <span className="block text-sm font-medium text-ink">
                Standard size
              </span>
              <span className="mt-0.5 block text-xs leading-5 text-ink-soft">
                Pick from the chart. We will still adjust it free if it does not
                sit right.
              </span>
            </span>
          </label>

          <label
            className={cn(
              "flex cursor-pointer items-start gap-3.5 rounded-xl border p-4 transition-colors",
              madeToMeasure
                ? "border-brass bg-brass-wash"
                : "border-line hover:border-line-strong",
            )}
          >
            <input
              type="radio"
              name="fit"
              checked={madeToMeasure}
              onChange={() => setMadeToMeasure(true)}
              className="mt-1 accent-[var(--color-brass-ink)]"
            />
            <span>
              <span className="block text-sm font-medium text-ink">
                Made to my measurements
                <span className="ml-2 text-xs font-normal text-brass-ink">
                  No extra charge
                </span>
              </span>
              <span className="mt-0.5 block text-xs leading-5 text-ink-soft">
                Cut to your twelve measurements. Adds roughly four days.
              </span>
            </span>
          </label>
        </div>

        {/* Size pills, only relevant for standard fit */}
        {!madeToMeasure ? (
          <div className="mt-5">
            <span className="eyebrow text-ink-faint">Size</span>
            <div className="mt-3 flex flex-wrap gap-2">
              {SIZES.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSize(option)}
                  aria-pressed={size === option}
                  className={cn(
                    "h-11 min-w-12 rounded-full border px-4 text-sm transition-colors duration-300",
                    size === option
                      ? "border-espresso bg-espresso text-on-dark"
                      : "border-line bg-surface text-ink hover:border-brass",
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </fieldset>

      {/* Actions */}
      <div className="mt-8 grid gap-3">
        {madeToMeasure || !productId ? (
          <ButtonLink href={commissionHref} size="lg" className="w-full">
            {madeToMeasure ? "Order to my measurements" : "Enquire & order"}
            <Icon name="arrow-right" className="h-4 w-4" />
          </ButtonLink>
        ) : (
          <AddToCart
            productId={productId}
            variant={size ? { size } : {}}
            disabled={!inStock || !size}
            disabledLabel={!inStock ? "Sold out" : "Choose a size"}
          />
        )}

        {!madeToMeasure && productId ? (
          <ButtonLink
            href={commissionHref}
            variant="secondary"
            size="lg"
            className="w-full"
          >
            Or commission it made to measure
          </ButtonLink>
        ) : null}

        <ButtonLink
          href={`/contact?subject=${encodeURIComponent(
            `Question about ${productName}`,
          )}`}
          variant="ghost"
          size="lg"
          className="w-full"
        >
          Ask about fabric or fit
        </ButtonLink>
      </div>

      <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-ink-soft">
        <Icon name="needle" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brass" />
        {inStock
          ? "Ready to dispatch in 2–3 days, or 10–14 days made to measure."
          : "Made to order — allow 10–14 days from confirmation."}
      </p>
    </div>
  );
}
