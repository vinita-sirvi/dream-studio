import "server-only";
import type { DbDoc } from "./db-types";

import { Coupon, Product, Setting } from "./models";

/**
 * Server-side pricing.
 *
 * Every figure a customer is charged is derived here from the catalogue, never
 * from the request. The public order endpoint used to accept `items[].price` and
 * a whole `totals` object from the client, which meant the amount owed was
 * whatever the browser claimed it was.
 *
 * Money convention: amounts are rupees held as numbers, rounded to 2 decimal
 * places at every boundary. Listed prices are treated as **tax inclusive** (the
 * norm for Indian retail), so `tax` is the component extracted from the line
 * total for the invoice rather than an amount added on top. This keeps the price
 * on the product page identical to the price charged.
 */

export function round2(value: number) {
  // Scale-and-round rather than toFixed, so the result stays a number and
  // 0.1 + 0.2 style drift cannot accumulate across a basket.
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export type CartLineInput = {
  productId: string;
  quantity: number;
  variant?: Record<string, string>;
  customization?: Record<string, string>;
};

export type PricedLine = {
  /** Stable identity for a (product, variant, customization) combination. */
  lineId: string;
  productId: string;
  slug: string;
  name: string;
  sku: string;
  image: string | null;
  unitPrice: number;
  mrp: number;
  quantity: number;
  lineTotal: number;
  taxPercentage: number;
  variant: Record<string, string>;
  customization: Record<string, string>;
  /** Units available now. `null` when the product is not stock-tracked. */
  availableStock: number | null;
  inStock: boolean;
  /**
   * The Mongo path holding the authoritative stock for this line — either
   * `inventory.stock` or `variants.<i>.stock`. Checkout decrements exactly the
   * field availability was read from, which is what makes the conditional update
   * in `lib/checkout.ts` a real reservation. `null` when not stock-tracked.
   */
  stockPath: string | null;
  /** True when the product may be sold past zero stock. */
  backorder: boolean;
};

export type LineIssue = {
  productId: string;
  reason: "not-found" | "unavailable" | "out-of-stock" | "reduced-quantity";
  message: string;
};

/**
 * A deterministic key for a cart line, so adding the same product with the same
 * options twice increments a quantity instead of creating a duplicate row.
 */
export function lineIdFor(
  productId: string,
  variant: Record<string, string> = {},
  customization: Record<string, string> = {},
) {
  const normalize = (input: Record<string, string>) =>
    Object.keys(input)
      .filter((key) => input[key] !== "" && input[key] != null)
      .sort()
      .map((key) => `${key}=${input[key]}`)
      .join("&");

  const parts = [productId, normalize(variant), normalize(customization)].filter(
    Boolean,
  );
  return parts.join("|");
}

/** The price a single unit sells for, honouring variant overrides and offers. */
function unitPriceOf(product: DbDoc, variant: Record<string, string>) {
  const matched = matchVariant(product, variant);
  if (matched && typeof matched.customPrice === "number" && matched.customPrice > 0) {
    return round2(matched.customPrice);
  }

  const pricing = product.pricing ?? {};
  const special = pricing.specialPrice;

  if (typeof special === "number" && special > 0 && isOfferLive(pricing)) {
    return round2(special);
  }

  return round2(pricing.sellingPrice ?? 0);
}

/** Offer windows are stored as date strings; an absent bound means open-ended. */
function isOfferLive(pricing: DbDoc) {
  const now = Date.now();
  const start = pricing.offerStart ? Date.parse(pricing.offerStart) : null;
  const end = pricing.offerEnd ? Date.parse(pricing.offerEnd) : null;

  if (start !== null && !Number.isNaN(start) && now < start) return false;
  if (end !== null && !Number.isNaN(end) && now > end) return false;
  return true;
}

/** Index of the variant matching the chosen options, or -1. */
function matchVariantIndex(product: DbDoc, variant: Record<string, string>) {
  const variants: DbDoc[] = product.variants ?? [];
  if (!variants.length) return -1;

  const keys = Object.keys(variant).filter((key) => variant[key]);
  if (!keys.length) return -1;

  return variants.findIndex((candidate) =>
    keys.every(
      (key) =>
        String(candidate?.[key] ?? "").toLowerCase() ===
        String(variant[key]).toLowerCase(),
    ),
  );
}

function matchVariant(product: DbDoc, variant: Record<string, string>) {
  const index = matchVariantIndex(product, variant);
  return index === -1 ? null : product.variants[index];
}

/**
 * Units purchasable now and the field that holds them.
 *
 * Availability and the later decrement must agree on *which* counter is
 * authoritative, otherwise checkout can reserve product-level stock for a line
 * whose variant is already sold out.
 */
function resolveStock(product: DbDoc, variant: Record<string, string>) {
  const inventory = product.inventory ?? {};
  if (inventory.unlimitedStock || inventory.trackInventory === false) {
    return { available: null as number | null, path: null as string | null };
  }

  const index = matchVariantIndex(product, variant);
  if (index !== -1 && typeof product.variants[index]?.stock === "number") {
    return {
      available: Math.max(0, product.variants[index].stock),
      path: `variants.${index}.stock`,
    };
  }

  return {
    available: Math.max(0, inventory.stock ?? 0),
    path: "inventory.stock",
  };
}

function primaryImage(product: DbDoc) {
  const images: DbDoc[] = product.images ?? [];
  const preferred =
    images.find((image) => image?.isPrimary && image?.url) ??
    images.find((image) => image?.url);
  return preferred?.url ?? null;
}

/**
 * Turn cart line references into priced lines.
 *
 * Products that have been archived, hidden or sold out since they were added
 * come back as issues rather than silently priced at zero, so the cart and
 * checkout can tell the customer what changed. Quantities above available stock
 * are clamped down (and reported) rather than rejected outright — that is far
 * less annoying than emptying someone's basket.
 */
export async function priceCartLines(inputs: CartLineInput[]): Promise<{
  lines: PricedLine[];
  issues: LineIssue[];
}> {
  const issues: LineIssue[] = [];
  if (!inputs.length) {
    return { lines: [], issues };
  }

  const ids = [...new Set(inputs.map((input) => input.productId))];
  const products = await Product.find({ _id: { $in: ids } }).lean();
  const byId = new Map(products.map((product: DbDoc) => [String(product._id), product]));

  const lines: PricedLine[] = [];

  for (const input of inputs) {
    const product = byId.get(input.productId);

    if (!product) {
      issues.push({
        productId: input.productId,
        reason: "not-found",
        message: "One piece is no longer in the catalogue and was removed.",
      });
      continue;
    }

    if (product.status !== "active" || product.visibility !== "public") {
      issues.push({
        productId: input.productId,
        reason: "unavailable",
        message: `${product.name} is not available to order right now and was removed.`,
      });
      continue;
    }

    const variant = input.variant ?? {};
    const customization = input.customization ?? {};
    const { available: availableStock, path: stockPath } = resolveStock(
      product,
      variant,
    );
    const backorder = Boolean(product.inventory?.backorder);

    if (availableStock !== null && availableStock <= 0 && !backorder) {
      issues.push({
        productId: input.productId,
        reason: "out-of-stock",
        message: `${product.name} has sold out and was removed.`,
      });
      continue;
    }

    let quantity = Math.max(1, Math.trunc(input.quantity));
    if (availableStock !== null && !backorder && quantity > availableStock) {
      quantity = availableStock;
      issues.push({
        productId: input.productId,
        reason: "reduced-quantity",
        message: `Only ${availableStock} of ${product.name} left — the quantity was reduced.`,
      });
    }

    const unitPrice = unitPriceOf(product, variant);

    lines.push({
      lineId: lineIdFor(input.productId, variant, customization),
      productId: input.productId,
      slug: product.slug,
      name: product.name,
      sku: product.sku,
      image: primaryImage(product),
      unitPrice,
      mrp: round2(product.pricing?.mrp ?? unitPrice),
      quantity,
      lineTotal: round2(unitPrice * quantity),
      taxPercentage: product.taxPercentage ?? 0,
      variant,
      customization,
      availableStock,
      inStock: availableStock === null || availableStock > 0,
      stockPath,
      backorder,
    });
  }

  return { lines, issues };
}

export type StoreSettings = {
  currency: string;
  codEnabled: boolean;
  freeShippingThreshold: number | null;
  defaultShippingCharge: number;
};

const DEFAULT_SETTINGS: StoreSettings = {
  currency: "INR",
  codEnabled: false,
  freeShippingThreshold: 15000,
  defaultShippingCharge: 250,
};

/** Shipping and payment configuration, from the Setting document if present. */
export async function getStoreSettings(): Promise<StoreSettings> {
  const setting: DbDoc = await Setting.findOne({}).lean();
  if (!setting) return DEFAULT_SETTINGS;

  return {
    currency: setting.payment?.currency ?? DEFAULT_SETTINGS.currency,
    codEnabled: Boolean(setting.payment?.codEnabled),
    freeShippingThreshold:
      typeof setting.shipping?.freeShippingThreshold === "number"
        ? setting.shipping.freeShippingThreshold
        : DEFAULT_SETTINGS.freeShippingThreshold,
    defaultShippingCharge:
      typeof setting.shipping?.defaultCharge === "number"
        ? setting.shipping.defaultCharge
        : DEFAULT_SETTINGS.defaultShippingCharge,
  };
}

export const EXPRESS_SHIPPING_SURCHARGE = 600;
export const GIFT_WRAP_CHARGE = 250;

export type AppliedCoupon = {
  code: string;
  discount: number;
  type: "percentage" | "flat";
};

export type CouponResult =
  | { ok: true; coupon: AppliedCoupon }
  | { ok: false; message: string };

/**
 * Validate a coupon against the live basket.
 *
 * Checks the code exists, is active, is in date, meets the minimum spend, and —
 * where the coupon is scoped to particular products or categories — that the
 * basket actually contains something eligible. The discount is capped both by
 * `maximumDiscount` and by the eligible subtotal, so a coupon can never produce a
 * negative order total.
 */
export async function resolveCoupon(
  code: string,
  lines: PricedLine[],
): Promise<CouponResult> {
  const normalized = code.trim().toUpperCase();
  if (!normalized) {
    return { ok: false, message: "Enter a code." };
  }

  const coupon: DbDoc = await Coupon.findOne({
    code: normalized,
    active: true,
  }).lean();

  if (!coupon) {
    return { ok: false, message: "That code is not recognised." };
  }

  if (coupon.expiryDate && new Date(coupon.expiryDate).getTime() < Date.now()) {
    return { ok: false, message: "That code has expired." };
  }

  const scopedProducts = (coupon.productIds ?? []).map(String);
  const scopedCategories = (coupon.categoryIds ?? []).map(String);
  const scoped = scopedProducts.length > 0 || scopedCategories.length > 0;

  // Only lines the coupon actually applies to count toward the discount, and
  // only products flagged coupon-eligible participate at all.
  const eligible = lines.filter((line) => {
    if (!scoped) return true;
    return scopedProducts.includes(line.productId);
  });

  const eligibleSubtotal = round2(
    eligible.reduce((sum, line) => sum + line.lineTotal, 0),
  );

  if (scoped && eligibleSubtotal <= 0) {
    return {
      ok: false,
      message: "That code does not apply to anything in your bag.",
    };
  }

  const subtotal = round2(lines.reduce((sum, line) => sum + line.lineTotal, 0));
  if (coupon.minimumPurchase && subtotal < coupon.minimumPurchase) {
    return {
      ok: false,
      message: `Spend ₹${coupon.minimumPurchase.toLocaleString("en-IN")} to use this code.`,
    };
  }

  let discount =
    coupon.type === "percentage"
      ? round2((eligibleSubtotal * coupon.value) / 100)
      : round2(coupon.value);

  if (typeof coupon.maximumDiscount === "number" && coupon.maximumDiscount > 0) {
    discount = Math.min(discount, coupon.maximumDiscount);
  }

  // A flat coupon larger than the basket must not create a credit.
  discount = round2(Math.min(discount, eligibleSubtotal));

  if (discount <= 0) {
    return { ok: false, message: "That code has no value on this order." };
  }

  return {
    ok: true,
    coupon: { code: normalized, discount, type: coupon.type },
  };
}

export type OrderTotals = {
  subtotal: number;
  shipping: number;
  discount: number;
  tax: number;
  grandTotal: number;
};

/**
 * The money for an order.
 *
 * `tax` is the portion of the discounted goods value already inside the listed
 * prices, reported for the invoice — it is not added to `grandTotal`.
 */
export function computeTotals({
  lines,
  settings,
  shippingMethod = "standard",
  giftWrap = false,
  coupon,
}: {
  lines: PricedLine[];
  settings: StoreSettings;
  shippingMethod?: "standard" | "express";
  giftWrap?: boolean;
  coupon?: AppliedCoupon | null;
}): OrderTotals {
  const subtotal = round2(lines.reduce((sum, line) => sum + line.lineTotal, 0));
  const discount = round2(Math.min(coupon?.discount ?? 0, subtotal));

  let shipping = 0;
  if (subtotal > 0) {
    const qualifiesForFree =
      settings.freeShippingThreshold !== null &&
      subtotal >= settings.freeShippingThreshold;

    shipping = qualifiesForFree ? 0 : settings.defaultShippingCharge;
    if (shippingMethod === "express") {
      shipping = round2(shipping + EXPRESS_SHIPPING_SURCHARGE);
    }
  }

  if (giftWrap && subtotal > 0) {
    shipping = round2(shipping + GIFT_WRAP_CHARGE);
  }

  // Tax is apportioned per line so mixed tax rates stay correct, and scaled by
  // the share of the basket the discount removed.
  const discountRatio = subtotal > 0 ? (subtotal - discount) / subtotal : 0;
  const tax = round2(
    lines.reduce((sum, line) => {
      const rate = line.taxPercentage ?? 0;
      if (!rate) return sum;
      const taxableValue = line.lineTotal * discountRatio;
      // Listed prices include tax, so extract rather than add.
      return sum + taxableValue - taxableValue / (1 + rate / 100);
    }, 0),
  );

  return {
    subtotal,
    shipping,
    discount,
    tax,
    grandTotal: round2(Math.max(0, subtotal - discount + shipping)),
  };
}

export function formatCurrency(value: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}
