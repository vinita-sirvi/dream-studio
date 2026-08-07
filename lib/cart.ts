import "server-only";

import type { OwnerScope } from "./api-auth";
import { Cart } from "./models";
import { connectToDatabase } from "./mongodb";
import {
  computeTotals,
  getStoreSettings,
  lineIdFor,
  priceCartLines,
  resolveCoupon,
  type CartLineInput,
  type LineIssue,
  type OrderTotals,
  type PricedLine,
  type StoreSettings,
} from "./pricing";

/**
 * Cart persistence.
 *
 * The `Cart` model already existed in `lib/models.ts` but nothing read or wrote
 * it — the cart page was a hard-coded empty state. Carts are keyed by user id
 * when signed in and by the signed guest cookie otherwise, and merged on sign-in
 * so a basket built while browsing anonymously is not lost at the login step.
 */

export type CartView = {
  lines: PricedLine[];
  issues: LineIssue[];
  totals: OrderTotals;
  settings: StoreSettings;
  couponCode: string | null;
  couponMessage: string | null;
  itemCount: number;
};

function scopeFilter(scope: OwnerScope) {
  return scope.userId
    ? { userId: scope.userId }
    : { guestSessionId: scope.guestSessionId };
}

async function getOrCreateCart(scope: OwnerScope) {
  const filter = scopeFilter(scope);
  const existing = await Cart.findOne(filter);
  if (existing) return existing;
  return Cart.create({ ...filter, items: [] });
}

function toLineInputs(cart: any): CartLineInput[] {
  return (cart?.items ?? [])
    .filter((item: any) => item?.productId)
    .map((item: any) => ({
      productId: String(item.productId),
      quantity: item.quantity ?? 1,
      variant: plainObject(item.variant),
      customization: plainObject(item.customization),
    }));
}

/**
 * Mongoose `Mixed` values come back as plain objects already, but a Map or a
 * document can slip in through the admin API. Normalising to string→string keeps
 * `lineIdFor` deterministic.
 */
function plainObject(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object") return {};
  const source = value instanceof Map ? Object.fromEntries(value) : value;
  const result: Record<string, string> = {};
  for (const [key, entry] of Object.entries(source as Record<string, unknown>)) {
    if (entry == null || entry === "") continue;
    result[key] = String(entry);
  }
  return result;
}

/**
 * Read the cart, re-priced from the catalogue.
 *
 * Lines that no longer resolve are dropped from the stored cart as a side effect,
 * so a sold-out piece does not keep resurfacing on every page load. Quantities
 * clamped by available stock are written back for the same reason.
 */
export async function readCart(scope: OwnerScope): Promise<CartView> {
  await connectToDatabase();
  const cart = await Cart.findOne(scopeFilter(scope));
  const settings = await getStoreSettings();

  if (!cart || !cart.items?.length) {
    return {
      lines: [],
      issues: [],
      totals: computeTotals({ lines: [], settings }),
      settings,
      couponCode: null,
      couponMessage: null,
      itemCount: 0,
    };
  }

  const { lines, issues } = await priceCartLines(toLineInputs(cart));

  if (issues.length) {
    cart.items = lines.map((line) => ({
      productId: line.productId,
      productName: line.name,
      sku: line.sku,
      variant: line.variant,
      quantity: line.quantity,
      price: line.unitPrice,
      customization: line.customization,
    }));
    await cart.save();
  }

  // A coupon stored on the cart is re-validated every read: the basket may have
  // changed since it was applied, or the coupon may have expired.
  let couponCode: string | null = null;
  let couponMessage: string | null = null;
  let coupon = null;

  if (cart.couponCode && lines.length) {
    const result = await resolveCoupon(cart.couponCode, lines);
    if (result.ok) {
      coupon = result.coupon;
      couponCode = result.coupon.code;
    } else {
      couponMessage = result.message;
      cart.couponCode = undefined;
      await cart.save();
    }
  }

  return {
    lines,
    issues,
    totals: computeTotals({ lines, settings, coupon }),
    settings,
    couponCode,
    couponMessage,
    itemCount: lines.reduce((sum, line) => sum + line.quantity, 0),
  };
}

/** Number of units in the cart, for the header badge. */
export async function readCartCount(scope: OwnerScope) {
  await connectToDatabase();
  const cart: any = await Cart.findOne(scopeFilter(scope)).lean();
  if (!cart?.items?.length) return 0;
  return cart.items.reduce(
    (sum: number, item: any) => sum + (item.quantity ?? 0),
    0,
  );
}

export async function addToCart(
  scope: OwnerScope,
  input: CartLineInput,
): Promise<{ ok: true; cart: CartView } | { ok: false; message: string }> {
  await connectToDatabase();

  // Price first: this validates the product exists, is orderable and is in
  // stock before anything is written.
  const { lines, issues } = await priceCartLines([input]);
  if (!lines.length) {
    return {
      ok: false,
      message: issues[0]?.message ?? "That piece cannot be added right now.",
    };
  }

  const priced = lines[0];
  const cart = await getOrCreateCart(scope);
  const targetId = lineIdFor(input.productId, priced.variant, priced.customization);

  const existing = (cart.items ?? []).find(
    (item: any) =>
      lineIdFor(
        String(item.productId),
        plainObject(item.variant),
        plainObject(item.customization),
      ) === targetId,
  );

  if (existing) {
    const combined = (existing.quantity ?? 0) + priced.quantity;
    existing.quantity =
      priced.availableStock === null
        ? Math.min(combined, 20)
        : Math.min(combined, priced.availableStock, 20);
    existing.price = priced.unitPrice;
  } else {
    cart.items.push({
      productId: priced.productId,
      productName: priced.name,
      sku: priced.sku,
      variant: priced.variant,
      quantity: priced.quantity,
      price: priced.unitPrice,
      customization: priced.customization,
    });
  }

  await cart.save();
  return { ok: true, cart: await readCart(scope) };
}

export async function setCartLineQuantity(
  scope: OwnerScope,
  lineId: string,
  quantity: number,
) {
  await connectToDatabase();
  const cart = await Cart.findOne(scopeFilter(scope));
  if (!cart) return readCart(scope);

  if (quantity <= 0) {
    cart.items = (cart.items ?? []).filter(
      (item: any) =>
        lineIdFor(
          String(item.productId),
          plainObject(item.variant),
          plainObject(item.customization),
        ) !== lineId,
    );
  } else {
    const target = (cart.items ?? []).find(
      (item: any) =>
        lineIdFor(
          String(item.productId),
          plainObject(item.variant),
          plainObject(item.customization),
        ) === lineId,
    );
    if (target) {
      target.quantity = quantity;
    }
  }

  await cart.save();
  // readCart clamps the new quantity against live stock.
  return readCart(scope);
}

export async function removeCartLine(scope: OwnerScope, lineId: string) {
  return setCartLineQuantity(scope, lineId, 0);
}

export async function applyCartCoupon(scope: OwnerScope, code: string) {
  await connectToDatabase();
  const view = await readCart(scope);

  if (!view.lines.length) {
    return { ok: false as const, message: "Your bag is empty." };
  }

  const result = await resolveCoupon(code, view.lines);
  if (!result.ok) {
    return { ok: false as const, message: result.message };
  }

  const cart = await getOrCreateCart(scope);
  cart.couponCode = result.coupon.code;
  await cart.save();

  return { ok: true as const, cart: await readCart(scope) };
}

export async function removeCartCoupon(scope: OwnerScope) {
  await connectToDatabase();
  const cart = await Cart.findOne(scopeFilter(scope));
  if (cart) {
    cart.couponCode = undefined;
    await cart.save();
  }
  return readCart(scope);
}

export async function clearCart(scope: OwnerScope) {
  await connectToDatabase();
  await Cart.findOneAndUpdate(scopeFilter(scope), {
    $set: { items: [], couponCode: undefined },
  });
}

/**
 * Fold a guest cart into the user's cart at sign-in.
 *
 * Called from the login, register and OTP routes. Quantities for a line present
 * in both are summed rather than overwritten, and the guest row is deleted so it
 * cannot be revived by a stale cookie.
 */
export async function mergeGuestCartIntoUser(
  guestSessionId: string | null,
  userId: string,
) {
  if (!guestSessionId) return;

  await connectToDatabase();
  const guestCart = await Cart.findOne({ guestSessionId });
  if (!guestCart?.items?.length) {
    if (guestCart) await guestCart.deleteOne();
    return;
  }

  const userCart = await getOrCreateCart({ userId });

  for (const item of guestCart.items) {
    const itemId = lineIdFor(
      String(item.productId),
      plainObject(item.variant),
      plainObject(item.customization),
    );

    const existing = (userCart.items ?? []).find(
      (candidate: any) =>
        lineIdFor(
          String(candidate.productId),
          plainObject(candidate.variant),
          plainObject(candidate.customization),
        ) === itemId,
    );

    if (existing) {
      existing.quantity = Math.min((existing.quantity ?? 0) + (item.quantity ?? 0), 20);
    } else {
      userCart.items.push({
        productId: item.productId,
        productName: item.productName,
        sku: item.sku,
        variant: plainObject(item.variant),
        quantity: item.quantity,
        price: item.price,
        customization: plainObject(item.customization),
      });
    }
  }

  if (guestCart.couponCode && !userCart.couponCode) {
    userCart.couponCode = guestCart.couponCode;
  }

  await userCart.save();
  await guestCart.deleteOne();
}
