import { cache } from "react";
import { isValidObjectId } from "mongoose";

import type { DbDoc } from "./db-types";
import { serialize } from "./http";
import {
  isDatabaseConfigured,
  tryConnectToDatabase,
} from "./mongodb";
import { Category, Collection, CustomOrder, Order, Product } from "./models";
import { ensureSeedData } from "./seed";
import { demoCategories, demoCollections, demoProducts } from "./demo-data";

export type ShopSort = "newest" | "price-asc" | "price-desc" | "name-asc";

type ShopFilters = {
  q?: string;
  category?: string;
  collection?: string;
  /** Inclusive lower bound, in rupees. */
  minPrice?: number;
  /** Inclusive upper bound, in rupees. */
  maxPrice?: number;
  sort?: ShopSort;
};

type NormalizedProduct = ReturnType<typeof normalizeProduct>;

/**
 * Shared filter + sort applied to an already-normalized product list, so the
 * database and demo-fallback paths cannot drift apart.
 *
 * Products arrive newest-first from both sources, so "newest" is a no-op.
 */
function applyFilters(
  products: NormalizedProduct[],
  filters: ShopFilters,
): NormalizedProduct[] {
  const query = filters.q?.trim().toLowerCase();

  const filtered = products.filter((product) => {
    if (query) {
      const haystack = [
        product.name,
        product.description,
        product.category,
        product.collection,
        product.fabric,
        product.color,
        ...(product.tags ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    if (filters.category && product.categorySlug !== filters.category) {
      return false;
    }

    if (filters.collection && product.collectionSlug !== filters.collection) {
      return false;
    }

    if (
      typeof filters.minPrice === "number" &&
      product.price < filters.minPrice
    ) {
      return false;
    }

    if (
      typeof filters.maxPrice === "number" &&
      product.price > filters.maxPrice
    ) {
      return false;
    }

    return true;
  });

  switch (filters.sort) {
    case "price-asc":
      return filtered.sort((a, b) => a.price - b.price);
    case "price-desc":
      return filtered.sort((a, b) => b.price - a.price);
    case "name-asc":
      return filtered.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return filtered;
  }
}

function productTone(value: string | undefined, fallbackIndex = 0) {
  const key = (value ?? "").toLowerCase();
  if (key.includes("rose") || key.includes("pink")) return "rose";
  if (key.includes("gold") || key.includes("yellow")) return "gold";
  if (key.includes("ivory") || key.includes("white")) return "ivory";
  if (key.includes("slate") || key.includes("blue")) return "slate";
  if (key.includes("wine") || key.includes("red")) return "wine";
  if (key.includes("plum") || key.includes("purple")) return "plum";
  if (key.includes("olive") || key.includes("green")) return "olive";
  if (key.includes("blush") || key.includes("beige")) return "blush";

  const tones = ["rose", "gold", "ivory", "slate", "wine", "plum", "olive", "blush"] as const;
  return tones[fallbackIndex % tones.length];
}

function normalizeProduct(product: any, index = 0) {
  return {
    id: String(product._id),
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    category: typeof product.categoryId === "object" ? product.categoryId?.name : product.categoryId,
    categorySlug:
      typeof product.categoryId === "object" ? product.categoryId?.slug : undefined,
    collection:
      typeof product.collectionId === "object" ? product.collectionId?.name : product.collectionId,
    collectionSlug:
      typeof product.collectionId === "object" ? product.collectionId?.slug : undefined,
    description: product.description,
    shortDescription: product.shortDescription ?? product.description,
    highlights: product.highlights ?? [],
    fabric: product.fabric,
    color: product.color,
    tone: productTone(product.color, index),
    stock: product.inventory?.stock ?? 0,
    price: product.pricing?.specialPrice ?? product.pricing?.sellingPrice ?? 0,
    mrp: product.pricing?.mrp ?? product.pricing?.sellingPrice ?? 0,
    discountPercent: product.pricing?.discountPercent ?? 0,
    status: product.status,
    visibility: product.visibility,
    tags: product.tags ?? [],
    images: product.images ?? [],
  };
}

function fallbackShopData(filters: ShopFilters = {}) {
  const categories = demoCategories.map((category) => ({
    id: category.slug,
    name: category.name,
    slug: category.slug,
    description: category.description,
    tone: productTone(category.name),
  }));

  const collections = demoCollections.map((collection) => ({
    id: collection.slug,
    name: collection.name,
    slug: collection.slug,
    description: collection.description,
  }));

  const allProducts = demoProducts.map((product, index) =>
    normalizeProduct({ ...product, _id: product.slug }, index),
  );

  return {
    categories,
    collections,
    products: applyFilters(allProducts, filters),
    // Featured is always the newest four, independent of the active filters.
    featuredProducts: allProducts.slice(0, 4),
    priceRange: priceRangeOf(allProducts),
  };
}

/** Min/max selling price across the catalogue, for the price filter bounds. */
function priceRangeOf(products: NormalizedProduct[]) {
  if (!products.length) return { min: 0, max: 0 };
  const prices = products.map((product) => product.price);
  return {
    min: Math.floor(Math.min(...prices)),
    max: Math.ceil(Math.max(...prices)),
  };
}

export const getShopData = cache(async (filters: ShopFilters = {}) => {
  // Fall back to the bundled demo catalogue when there is no database. Previously
  // these branches returned empty arrays, which left the home and shop pages
  // blank on a fresh checkout even though getProductBySlug() already fell back
  // to the same data — an inconsistency, since fallbackShopData() existed and
  // was only used elsewhere.
  if (!isDatabaseConfigured()) {
    return fallbackShopData(filters);
  }

  const connected = await tryConnectToDatabase();
  if (!connected) {
    return fallbackShopData(filters);
  }

  await ensureSeedData();

  const [categories, collections, products] = await Promise.all([
    Category.find({ hidden: { $ne: true } }).sort({ sortOrder: 1, createdAt: -1 }).lean(),
    Collection.find({}).sort({ createdAt: -1 }).lean(),
    Product.find({
      status: "active",
      visibility: "public",
      images: { $elemMatch: { type: "image", url: { $exists: true, $ne: "" } } },
    })
      .populate("categoryId collectionId")
      .sort({ createdAt: -1 })
      .lean(),
  ]);

  const normalizedProducts = (products as any[]).map((product, index) =>
    normalizeProduct(product, index),
  );

  return {
    categories: serialize(categories),
    collections: serialize(collections),
    products: applyFilters(normalizedProducts, filters),
    featuredProducts: normalizedProducts.slice(0, 4),
    priceRange: priceRangeOf(normalizedProducts),
  };
});

export const getProductBySlug = cache(async (slug: string) => {
  if (!isDatabaseConfigured()) {
    const fallback = fallbackShopData({});
    const product = fallback.products.find((item) => item.slug === slug) ?? null;
    return {
      product,
      relatedProducts: fallback.products.filter((item) => item.slug !== slug).slice(0, 4),
    };
  }

  const connected = await tryConnectToDatabase();
  if (!connected) {
    const fallback = fallbackShopData({});
    const product = fallback.products.find((item) => item.slug === slug) ?? null;
    return {
      product,
      relatedProducts: fallback.products.filter((item) => item.slug !== slug).slice(0, 4),
    };
  }

  await ensureSeedData();

  const identifierQuery = isValidObjectId(slug)
    ? { $or: [{ slug }, { _id: slug }] }
    : { slug };

  const product = await Product.findOne({
    ...identifierQuery,
    status: "active",
    visibility: "public",
  })
    .populate("categoryId collectionId")
    .lean();

  if (!product) {
    return { product: null, relatedProducts: [] };
  }

  const normalizedProduct = normalizeProduct(product);
  const relatedProducts = await Product.find({
    _id: { $ne: product._id },
    status: "active",
    visibility: "public",
    categoryId: (product as any).categoryId?._id ?? (product as any).categoryId,
  })
    .limit(4)
    .lean();

  return {
    product: normalizedProduct,
    relatedProducts: relatedProducts.map((item, index) => normalizeProduct(item, index)),
  };
});

export type CustomerOrder = {
  id: string;
  orderId: string;
  status: string;
  placedAt: string | null;
  grandTotal: number;
  itemCount: number;
  items: { name: string; quantity: number; price: number }[];
  timeline: { status: string; note: string | null; at: string | null }[];
};

/**
 * A customer's own orders.
 *
 * This helper is what the account order history was missing — orders were only
 * ever read in aggregate for the admin dashboard, so `/orders` had nothing to show
 * and rendered a permanent empty state.
 *
 * Matches on the user id *or* the account's email, so an order placed as a guest
 * before signing up still appears once that address has an account.
 */
export const getOrdersForUser = cache(
  async ({
    userId,
    email,
  }: {
    userId: string;
    email: string;
  }): Promise<CustomerOrder[]> => {
    if (!isDatabaseConfigured()) return [];

    const connected = await tryConnectToDatabase();
    if (!connected) return [];

    const orders = await Order.find({
      $or: [{ userId }, { email: email.toLowerCase() }],
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return (orders as DbDoc[]).map((order) => ({
      id: String(order._id),
      orderId: order.orderId,
      status: order.status ?? "pending",
      placedAt: order.createdAt ? new Date(order.createdAt).toISOString() : null,
      grandTotal: order.totals?.grandTotal ?? 0,
      itemCount: (order.items ?? []).reduce(
        (sum: number, item: DbDoc) => sum + (item.quantity ?? 0),
        0,
      ),
      items: (order.items ?? []).map((item: DbDoc) => ({
        name: item.name ?? "Piece",
        quantity: item.quantity ?? 1,
        price: item.price ?? 0,
      })),
      timeline: (order.timeline ?? []).map((entry: DbDoc) => ({
        status: entry.status ?? "",
        note: entry.note ?? null,
        at: entry.at ?? null,
      })),
    }));
  },
);

export const getAdminSummary = cache(async () => {
  if (!isDatabaseConfigured()) {
    return {
      productCount: demoProducts.length,
      categoryCount: demoCategories.length,
      collectionCount: demoCollections.length,
      orderCount: 2,
      customOrderCount: 0,
      recentOrders: [],
      recentCustomOrders: [],
      recentProducts: fallbackShopData({}).products.slice(0, 5),
    };
  }

  const connected = await tryConnectToDatabase();
  if (!connected) {
    return {
      productCount: demoProducts.length,
      categoryCount: demoCategories.length,
      collectionCount: demoCollections.length,
      orderCount: 2,
      customOrderCount: 0,
      recentOrders: [],
      recentCustomOrders: [],
      recentProducts: fallbackShopData({}).products.slice(0, 5),
    };
  }

  await ensureSeedData();

  const [
    productCount,
    categoryCount,
    collectionCount,
    orderCount,
    customOrderCount,
    recentOrders,
    recentCustomOrders,
    recentProducts,
  ] =
    await Promise.all([
      Product.countDocuments({}),
      Category.countDocuments({}),
      Collection.countDocuments({}),
      Order.countDocuments({}),
      CustomOrder.countDocuments({}),
      Order.find({}).sort({ createdAt: -1 }).limit(5).lean(),
      CustomOrder.find({}).sort({ createdAt: -1 }).limit(5).lean(),
      Product.find({}).sort({ createdAt: -1 }).limit(5).lean(),
    ]);

  return {
    productCount,
    categoryCount,
    collectionCount,
    orderCount,
    customOrderCount,
    recentOrders: serialize(recentOrders),
    recentCustomOrders: serialize(recentCustomOrders),
    recentProducts: (recentProducts as any[]).map((item, index) => normalizeProduct(item, index)),
  };
});
