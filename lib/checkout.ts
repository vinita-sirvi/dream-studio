import "server-only";
import type { DbDoc, DbInput } from "./db-types";

import { randomInt } from "node:crypto";

import { z } from "zod";

import { clearCart, readCart } from "./cart";
import { sendEmailQuietly } from "./email";
import { env } from "./env";
import { Notification, Order, Product } from "./models";
import { connectToDatabase } from "./mongodb";
import { formatCurrency, round2, type PricedLine } from "./pricing";
import type { OwnerScope } from "./api-auth";
import type { checkoutSchema } from "./validators";

/**
 * Order placement.
 *
 * The public order endpoint previously did nothing but `Order.create(body)`. It
 * took the customer's word for prices and totals, never checked stock, never
 * decremented it, generated ids that collide under concurrency, and sent no
 * confirmation. This module is the replacement.
 */

type CheckoutInput = z.infer<typeof checkoutSchema>;

const ORDER_ID_ALPHABET = "ACDEFGHJKLMNPQRTUVWXY3456789";

/**
 * A human-quotable order id: `DD-20260807-K7QP4M`.
 *
 * `ORD-${Date.now()}` was both collision-prone (two orders in the same
 * millisecond share an id, and `orderId` is a unique index, so the second insert
 * threw a raw duplicate-key error) and enumerable — knowing one id tells you
 * roughly what the neighbouring ones are, which matters because order lookup is
 * by id. The random tail is drawn from `crypto.randomInt` and omits characters
 * that get misread over the phone (O/0, I/1, S/5, B/8).
 */
export function generateOrderId(now = new Date()) {
  const date = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");

  let suffix = "";
  for (let index = 0; index < 6; index += 1) {
    suffix += ORDER_ID_ALPHABET[randomInt(ORDER_ID_ALPHABET.length)];
  }

  return `DD-${date}-${suffix}`;
}

/** True for Mongo's duplicate-key error, whatever wrapper it arrives in. */
function isDuplicateKeyError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    (error as { code?: unknown }).code === 11000
  );
}

type Reservation = { productId: string; path: string; quantity: number };

/**
 * Reserve stock for every tracked line.
 *
 * Each decrement is a single conditional update — it only applies while the
 * counter is still at or above the quantity wanted — so two people checking out
 * the last piece at the same moment cannot both succeed. Mongo guarantees
 * atomicity per document, which is the granularity that matters here since stock
 * lives on the product.
 *
 * A multi-document transaction would be tidier, but requires a replica set, and
 * this app connects to whatever `MONGODB_URI` points at. So on partial failure we
 * compensate by releasing what was already taken. That window is small and, in
 * the worst case, over-reports availability rather than overselling.
 */
async function reserveStock(lines: PricedLine[]) {
  const taken: Reservation[] = [];

  for (const line of lines) {
    if (!line.stockPath || line.backorder) continue;

    const result = await Product.updateOne(
      { _id: line.productId, [line.stockPath]: { $gte: line.quantity } },
      { $inc: { [line.stockPath]: -line.quantity } },
    );

    if (result.matchedCount === 0) {
      await releaseStock(taken);
      return {
        ok: false as const,
        message: `${line.name} sold out while you were checking out. Please review your bag.`,
      };
    }

    taken.push({
      productId: line.productId,
      path: line.stockPath,
      quantity: line.quantity,
    });
  }

  return { ok: true as const, reservations: taken };
}

async function releaseStock(reservations: Reservation[]) {
  await Promise.all(
    reservations.map((reservation) =>
      Product.updateOne(
        { _id: reservation.productId },
        { $inc: { [reservation.path]: reservation.quantity } },
      ).catch((error) => {
        // Nothing useful to do at this point beyond making it visible: the
        // customer's order already failed, and stock is now understated by this
        // quantity until someone corrects it in the admin.
        console.error("[checkout] failed to release reserved stock", {
          productId: reservation.productId,
          path: reservation.path,
          quantity: reservation.quantity,
          error,
        });
      }),
    ),
  );
}

export type PlaceOrderResult =
  | { ok: true; orderId: string; grandTotal: number }
  | { ok: false; status: number; message: string };

/**
 * Turn the caller's cart into an order.
 *
 * Reads the cart fresh rather than trusting anything in the request beyond
 * contact and address details, so the amount charged is always the amount the
 * catalogue says.
 */
export async function placeOrder({
  scope,
  input,
  userId,
}: {
  scope: OwnerScope;
  input: CheckoutInput;
  userId?: string;
}): Promise<PlaceOrderResult> {
  await connectToDatabase();

  const cart = await readCart(scope);

  if (!cart.lines.length) {
    return {
      ok: false,
      status: 400,
      message: "Your bag is empty.",
    };
  }

  // If re-pricing changed anything (sold out, price moved, quantity clamped),
  // stop and let the customer re-confirm rather than charging a surprise amount.
  if (cart.issues.length) {
    return {
      ok: false,
      status: 409,
      message: cart.issues[0].message,
    };
  }

  if (input.paymentMethod === "cod" && !cart.settings.codEnabled) {
    return {
      ok: false,
      status: 400,
      message: "Cash on delivery is not available at the moment.",
    };
  }

  const totals = cart.totals;
  const reservation = await reserveStock(cart.lines);
  if (!reservation.ok) {
    return { ok: false, status: 409, message: reservation.message };
  }

  const billingAddress = input.billingAddress ?? input.shippingAddress;
  const now = new Date();

  try {
    // Retry only on a duplicate order id, which the random suffix makes
    // vanishingly unlikely but not impossible.
    let created: DbDoc = null;
    for (let attempt = 0; attempt < 4 && !created; attempt += 1) {
      const orderId = generateOrderId(now);
      try {
        created = await Order.create({
          orderId,
          userId: userId ?? undefined,
          customerName: input.customerName,
          email: input.email.toLowerCase(),
          phone: input.phone,
          status: "pending",
          notes: input.notes,
          shippingMethod: input.shippingMethod,
          paymentMethod: input.paymentMethod,
          couponCode: cart.couponCode ?? undefined,
          giftWrap: input.giftWrap,
          termsAccepted: input.termsAccepted,
          items: cart.lines.map((line) => ({
            productId: line.productId,
            name: line.name,
            sku: line.sku,
            variant: line.variant,
            quantity: line.quantity,
            price: line.unitPrice,
            customization: line.customization,
          })),
          shippingAddress: input.shippingAddress,
          billingAddress,
          totals,
          timeline: [
            {
              status: "pending",
              note: "Order received.",
              at: now.toISOString(),
            },
          ],
        } as DbInput);
      } catch (error) {
        // 11000 is Mongo's duplicate-key code. Anything else is a real failure
        // and must not be swallowed by the retry loop.
        if (!isDuplicateKeyError(error)) throw error;
      }
    }

    if (!created) {
      throw new Error("Could not allocate a unique order id.");
    }

    await clearCart(scope);

    // Everything below is after-the-fact: a failure must not fail the order.
    await sendOrderConfirmation({
      orderId: created.orderId,
      email: created.email,
      customerName: created.customerName,
      lines: cart.lines,
      grandTotal: totals.grandTotal,
      currency: cart.settings.currency,
    });

    if (userId) {
      await Notification.create({
        userId,
        type: "order",
        title: `Order ${created.orderId} received`,
        message: `We have your order and will confirm fabric and fit shortly.`,
        metadata: { orderId: created.orderId },
      } as DbInput).catch((error) =>
        console.error("[checkout] notification insert failed", error),
      );
    }

    return {
      ok: true,
      orderId: created.orderId,
      grandTotal: totals.grandTotal,
    };
  } catch (error) {
    // The order did not persist, so give the stock back.
    await releaseStock(reservation.reservations);
    console.error("[checkout] order creation failed", error);
    return {
      ok: false,
      status: 500,
      message: "We could not place your order just now. Nothing has been charged.",
    };
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function sendOrderConfirmation({
  orderId,
  email,
  customerName,
  lines,
  grandTotal,
  currency,
}: {
  orderId: string;
  email: string;
  customerName: string;
  lines: PricedLine[];
  grandTotal: number;
  currency: string;
}) {
  const appUrl = env.APP_URL?.replace(/\/$/, "") ?? "";
  const trackUrl = `${appUrl}/track-order?orderId=${encodeURIComponent(orderId)}`;

  const rows = lines
    .map(
      (line) =>
        `<tr><td style="padding:6px 0">${escapeHtml(line.name)} × ${line.quantity}</td>` +
        `<td style="padding:6px 0;text-align:right">${formatCurrency(
          round2(line.lineTotal),
          currency,
        )}</td></tr>`,
    )
    .join("");

  await sendEmailQuietly({
    to: email,
    subject: `We have your order — ${orderId}`,
    text:
      `Thank you, ${customerName}.\n\n` +
      `Your order ${orderId} is with us. Total ${formatCurrency(grandTotal, currency)}.\n` +
      (appUrl ? `Track it: ${trackUrl}\n` : ""),
    html:
      `<p>Thank you, ${escapeHtml(customerName)}.</p>` +
      `<p>Your order <strong>${orderId}</strong> is with us. A tailor will confirm fabric and fit before any work begins.</p>` +
      `<table style="width:100%;border-collapse:collapse;font-size:14px">${rows}` +
      `<tr><td style="padding-top:10px;border-top:1px solid #ddd"><strong>Total</strong></td>` +
      `<td style="padding-top:10px;border-top:1px solid #ddd;text-align:right"><strong>${formatCurrency(
        grandTotal,
        currency,
      )}</strong></td></tr></table>` +
      (appUrl ? `<p><a href="${trackUrl}">Track your order</a></p>` : ""),
  });
}
