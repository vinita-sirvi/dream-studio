import { isDatabaseConfigured, tryConnectToDatabase } from "./mongodb";
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

/**
 * Whether the bundled demo catalogue may be written to the database.
 *
 * This matters a great deal more than it looks. `ensureSeedData()` is awaited by
 * `getShopData()`, `getProductBySlug()` and `getAdminSummary()` — that is, by the
 * home page. So on a fresh production database the first visitor used to trigger
 * a seed that created `admin@divyaanddesign.com` with the password
 * `Admin@12345!`, a value committed to this repository in `lib/demo-data.ts`.
 * Anyone who had seen the source had admin.
 *
 * Demo seeding is therefore development-only unless explicitly opted into, and
 * the seeded users are never created in production regardless. Use `ADMIN_EMAILS`
 * to bootstrap a real admin: the first sign-in by a listed address is promoted.
 */
function demoSeedAllowed() {
  if (process.env.SEED_DEMO_DATA === "true") return true;
  return process.env.NODE_ENV !== "production";
}

function indexBySlug<T extends { slug: string }>(items: Array<T & { _id: unknown }>) {
  return items.reduce<Record<string, string>>((accumulator, item) => {
    accumulator[item.slug] = String(item._id);
    return accumulator;
  }, {});
}

export async function ensureSeedData() {
  if (!isDatabaseConfigured() || !demoSeedAllowed()) {
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
      // Demo accounts use credentials published in this repository, so they are
      // created for local development only — never in production, even when demo
      // seeding has been explicitly enabled there for the catalogue.
      if (process.env.NODE_ENV !== "production") {
        await User.insertMany(
          await Promise.all(
            demoUsers.map(async ({ password, ...user }) => ({
              ...user,
              passwordHash: await hashPassword(password),
            })),
          ),
        );
      }

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
