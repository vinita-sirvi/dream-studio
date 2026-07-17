import {
  connectToDatabase,
  isDatabaseConfigured,
  tryConnectToDatabase,
} from "./mongodb";
import { hashPassword } from "./password";
import {
  Category,
  Collection,
  Order,
  Product,
  User,
} from "./models";
import { demoCategories, demoCollections, demoOrders, demoProducts, demoUsers } from "./demo-data";

let seedPromise: Promise<boolean> | null = null;

function indexBySlug<T extends { slug: string }>(items: Array<T & { _id: unknown }>) {
  return items.reduce<Record<string, string>>((accumulator, item) => {
    accumulator[item.slug] = String(item._id);
    return accumulator;
  }, {});
}

export async function ensureSeedData() {
  if (!isDatabaseConfigured()) {
    return false;
  }

  if (!seedPromise) {
    seedPromise = (async () => {
      const connected = await tryConnectToDatabase();
      if (!connected) {
        return false;
      }

      const existingProducts = await Product.countDocuments();
      if (existingProducts > 0) {
        return false;
      }

      const categories = await Category.insertMany(demoCategories);
      const collections = await Collection.insertMany(demoCollections);

      const categoryIds = indexBySlug(categories);
      const collectionIds = indexBySlug(collections);

      const products = await Product.insertMany(
        demoProducts.map((product) => ({
          ...product,
          categoryId: categoryIds[product.categorySlug],
          collectionId: collectionIds[product.collectionSlug],
          pricing: {
            ...product.pricing,
            specialPrice:
              product.pricing.discountPercent > 0
                ? product.pricing.sellingPrice
                : undefined,
          },
          inventory: {
            ...product.inventory,
          },
          customization: {
            ...product.customization,
            enabled: Boolean(product.customization.enabled),
          },
        })),
      );

      const productIds = indexBySlug(products as Array<{ slug: string; _id: unknown }>);
      const productIdsBySku = Object.fromEntries(
        (products as Array<{ sku: string; _id: unknown }>).map((product) => [
          product.sku,
          String(product._id),
        ]),
      );
      const hashedAdmin = await hashPassword("Admin@12345!");
      const hashedCustomer = await hashPassword("Customer@12345!");

      await User.insertMany([
        {
          ...demoUsers[0],
          passwordHash: hashedAdmin,
        },
        {
          ...demoUsers[1],
          passwordHash: hashedCustomer,
        },
      ]);

      await Order.insertMany(
        demoOrders.map((order) => ({
          ...order,
          items: order.items.map((item) => ({
            ...item,
            productId:
              productIdsBySku[item.sku] ??
              productIds[item.sku === "LEH-1005" ? "designer-lehenga" : "floral-printed-a-line-kurti"],
          })),
        })),
      );

      return true;
    })();
  }

  return seedPromise;
}
