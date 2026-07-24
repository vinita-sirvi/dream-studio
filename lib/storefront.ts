import { cache } from "react";
import { isValidObjectId } from "mongoose";

import { serialize } from "./http";
import {
  isDatabaseConfigured,
  tryConnectToDatabase,
} from "./mongodb";
import { Category, Collection, CustomOrder, Order, Product } from "./models";
import { ensureSeedData } from "./seed";
import { demoCategories, demoCollections, demoProducts } from "./demo-data";

type ShopFilters = {
  q?: string;
  category?: string;
  collection?: string;
};

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

  const products = demoProducts
    .map((product, index) => normalizeProduct({ ...product, _id: product.slug }, index))
    .filter((product) => {
      const query = filters.q?.toLowerCase();
      if (query) {
        const haystack = [
          product.name,
          product.description,
          product.category,
          product.collection,
          ...(product.tags ?? []),
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(query)) {
          return false;
        }
      }

      if (filters.category && product.categorySlug !== filters.category) {
        return false;
      }

      if (filters.collection && product.collectionSlug !== filters.collection) {
        return false;
      }

      return true;
    });

  return {
    categories,
    collections,
    products,
    featuredProducts: products.slice(0, 4),
  };
}

export const getShopData = cache(async (filters: ShopFilters = {}) => {
  if (!isDatabaseConfigured()) {
    return { categories: [], collections: [], products: [], featuredProducts: [] };
  }

  const connected = await tryConnectToDatabase();
  if (!connected) {
    return { categories: [], collections: [], products: [], featuredProducts: [] };
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

  const normalizedProducts = (products as any[]).map((product, index) => normalizeProduct(product, index));
  const filteredProducts = normalizedProducts.filter((product) => {
    const query = filters.q?.toLowerCase();
    if (query) {
      const haystack = [
        product.name,
        product.description,
        product.category,
        product.collection,
        ...(product.tags ?? []),
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(query)) {
        return false;
      }
    }

    if (filters.category && product.categorySlug !== filters.category) {
      return false;
    }

    if (filters.collection && product.collectionSlug !== filters.collection) {
      return false;
    }

    return true;
  });

  return {
    categories: serialize(categories),
    collections: serialize(collections),
    products: filteredProducts,
    featuredProducts: normalizedProducts.slice(0, 4),
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
