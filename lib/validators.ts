import { z } from "zod";

const seoSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  keywords: z.array(z.string().min(1)).default([]),
  image: z.string().url().optional(),
  canonical: z.string().url().optional(),
});

const urlOrPath = z.string().min(1);

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6).optional().or(z.literal("")),
  subject: z.string().min(2),
  message: z.string().min(10),
});

export const newsletterSchema = z.object({
  email: z.string().email(),
  source: z.string().optional(),
});

export const customOrderSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  productType: z.string().min(2),
  budget: z.string().optional(),
  occasion: z.string().optional(),
  deliveryDate: z.string().optional(),
  fabricPreference: z.string().optional(),
  colorPreference: z.string().optional(),
  embroideryPreference: z.string().optional(),
  referenceNotes: z.string().optional(),
  measurements: z.record(z.string(), z.union([z.string(), z.number()])).default({}),
  inspirationImages: z.array(urlOrPath).default([]),
  specialInstructions: z.string().optional(),
});

/**
 * Registration.
 *
 * The 8-character floor was the only rule; a password of "password" passed. The
 * added checks are the usual composition rules, plus a cap because scrypt hashes
 * whatever it is given and an unbounded password is a cheap way to burn CPU.
 */
export const authRegisterSchema = z.object({
  name: z.string().min(2).max(80).trim(),
  email: z.string().email().max(160),
  password: z
    .string()
    .min(8, { error: "Use at least 8 characters." })
    .max(200, { error: "Passwords cannot be longer than 200 characters." })
    .regex(/[a-zA-Z]/, { error: "Include at least one letter." })
    .regex(/[0-9]/, { error: "Include at least one number." }),
});

export const authLoginSchema = z.object({
  email: z.string().email().max(160),
  password: z.string().min(1).max(200),
});

export const otpRequestSchema = z.object({
  email: z.string().email().max(160),
});

export const otpVerifySchema = z.object({
  email: z.string().email().max(160),
  code: z.string().regex(/^\d{6}$/, { error: "Enter the six-digit code." }),
});

/**
 * Admin-managed user record. Deliberately has no `password` field: passwords are
 * only ever set through the auth routes, which hash them. An admin can change
 * someone's role here, which is why the route requires an admin session.
 */
export const adminUserSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(160),
  role: z.enum(["customer", "admin", "super_admin"]).default("customer"),
  phone: z.string().max(32).optional(),
  avatar: z.string().optional(),
});

export const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  sku: z.string().min(2),
  barcode: z.string().optional(),
  brand: z.string().optional(),
  categoryId: z.string().optional(),
  collectionId: z.string().optional(),
  description: z.string().min(10),
  shortDescription: z.string().optional(),
  highlights: z.array(z.string()).default([]),
  specifications: z
    .array(
      z.object({
        label: z.string().min(1),
        value: z.string().min(1),
      }),
    )
    .default([]),
  fabric: z.string().optional(),
  careInstructions: z.string().optional(),
  occasion: z.string().optional(),
  color: z.string().optional(),
  pattern: z.string().optional(),
  material: z.string().optional(),
  fit: z.string().optional(),
  weight: z.string().optional(),
  countryOfOrigin: z.string().optional(),
  taxPercentage: z.number().min(0).max(100).default(0),
  status: z.enum(["draft", "active", "archived"]).default("draft"),
  visibility: z.enum(["public", "private", "hidden"]).default("public"),
  tags: z.array(z.string()).default([]),
  seo: seoSchema.optional(),
  images: z
    .array(
      z.object({
        url: z.string().min(1),
        alt: z.string().optional(),
        type: z.enum(["image", "video"]).default("image"),
        isPrimary: z.boolean().default(false),
        sortOrder: z.number().default(0),
      }),
    )
    .default([]),
  variants: z
    .array(
      z.object({
        size: z.string().optional(),
        color: z.string().optional(),
        length: z.string().optional(),
        sleeve: z.string().optional(),
        fabric: z.string().optional(),
        customPrice: z.number().min(0).optional(),
        stock: z.number().min(0).default(0),
        sku: z.string().optional(),
        barcode: z.string().optional(),
        images: z.array(z.string()).default([]),
      }),
    )
    .default([]),
  inventory: z
    .object({
      trackInventory: z.boolean().default(true),
      stock: z.number().min(0).default(0),
      lowStockAlert: z.number().min(0).default(5),
      unlimitedStock: z.boolean().default(false),
      backorder: z.boolean().default(false),
    })
    .default({
      trackInventory: true,
      stock: 0,
      lowStockAlert: 5,
      unlimitedStock: false,
      backorder: false,
    }),
  pricing: z
    .object({
      mrp: z.number().min(0).default(0),
      sellingPrice: z.number().min(0).default(0),
      discountPercent: z.number().min(0).max(100).default(0),
      couponEligible: z.boolean().default(true),
      flashSale: z.boolean().default(false),
      specialPrice: z.number().min(0).optional(),
      offerStart: z.string().optional(),
      offerEnd: z.string().optional(),
    })
    .default({
      mrp: 0,
      sellingPrice: 0,
      discountPercent: 0,
      couponEligible: true,
      flashSale: false,
    }),
  customization: z
    .object({
      enabled: z.boolean().default(false),
      neckStyles: z.array(z.string()).default([]),
      sleeves: z.array(z.string()).default([]),
      fabrics: z.array(z.string()).default([]),
      lining: z.array(z.string()).default([]),
      embroidery: z.array(z.string()).default([]),
      lengths: z.array(z.string()).default([]),
      dupatta: z.array(z.string()).default([]),
      bottomStyles: z.array(z.string()).default([]),
      extraWork: z.array(z.string()).default([]),
      personalNotes: z.boolean().default(true),
      uploadInspirationImages: z.boolean().default(true),
      measurements: z.boolean().default(true),
      additionalCharges: z.number().min(0).default(0),
      livePriceUpdate: z.boolean().default(false),
    })
    .default({
      enabled: false,
      neckStyles: [],
      sleeves: [],
      fabrics: [],
      lining: [],
      embroidery: [],
      lengths: [],
      dupatta: [],
      bottomStyles: [],
      extraWork: [],
      personalNotes: true,
      uploadInspirationImages: true,
      measurements: true,
      additionalCharges: 0,
      livePriceUpdate: false,
    }),
});

export const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  parentId: z.string().optional(),
  image: z.string().optional(),
  banner: z.string().optional(),
  seo: seoSchema.optional(),
  sortOrder: z.number().default(0),
  featured: z.boolean().default(false),
  hidden: z.boolean().default(false),
});

export const collectionSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  heroImage: z.string().optional(),
  scheduleStart: z.string().optional(),
  scheduleEnd: z.string().optional(),
  featured: z.boolean().default(false),
  status: z.enum(["draft", "active", "scheduled", "expired"]).default("draft"),
  seo: seoSchema.optional(),
  productIds: z.array(z.string()).default([]),
});

export const couponSchema = z.object({
  code: z.string().min(2),
  type: z.enum(["percentage", "flat"]),
  value: z.number().min(0),
  minimumPurchase: z.number().min(0).default(0),
  maximumDiscount: z.number().min(0).optional(),
  usageLimit: z.number().min(0).optional(),
  perUserLimit: z.number().min(0).optional(),
  expiryDate: z.string().optional(),
  categoryIds: z.array(z.string()).default([]),
  productIds: z.array(z.string()).default([]),
  autoApply: z.boolean().default(false),
  active: z.boolean().default(true),
});

const objectId = z
  .string()
  .regex(/^[a-f\d]{24}$/i, { error: "Not a valid identifier." });

export const orderStatuses = [
  "pending",
  "confirmed",
  "processing",
  "stitching",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
  "returned",
] as const;

const addressFields = {
  name: z.string().min(2).max(80),
  line1: z.string().min(4).max(160),
  line2: z.string().max(160).optional().or(z.literal("")),
  city: z.string().min(2).max(80),
  state: z.string().min(2).max(80),
  country: z.string().min(2).max(80).default("India"),
  postalCode: z.string().min(4).max(12),
  phone: z.string().min(6).max(32),
};

export const checkoutAddressSchema = z.object(addressFields);

/**
 * Customer checkout.
 *
 * Note what is absent: `price`, `totals`, and `status`. The previous public
 * order route accepted all three from the request body, so anyone could post an
 * order for a ₹80,000 lehenga with `grandTotal: 1` and it would be stored and
 * shown to staff as the real amount. Items here are references — a product id
 * and a quantity — and every figure is recomputed server-side in
 * `lib/checkout.ts` from the catalogue.
 */
export const checkoutSchema = z.object({
  customerName: z.string().min(2).max(80),
  email: z.string().email().max(160),
  phone: z.string().min(6).max(32),
  notes: z.string().max(1000).optional(),
  shippingMethod: z.enum(["standard", "express"]).default("standard"),
  paymentMethod: z.enum(["cod", "bank-transfer", "pay-on-quotation"]),
  couponCode: z.string().max(40).optional(),
  giftWrap: z.boolean().default(false),
  termsAccepted: z.literal(true, {
    error: "Please accept the terms to place your order.",
  }),
  shippingAddress: checkoutAddressSchema,
  /** When absent, the shipping address is reused for billing. */
  billingAddress: checkoutAddressSchema.optional(),
});

export const trackOrderSchema = z.object({
  orderId: z.string().min(4).max(40),
  email: z.string().email().max(160),
});

export const couponValidateSchema = z.object({
  code: z.string().min(2).max(40),
});

/** Add-to-cart. Quantity is capped so one request cannot reserve the stock room. */
export const cartAddSchema = z.object({
  productId: objectId,
  quantity: z.number().int().min(1).max(20).default(1),
  variant: z.record(z.string(), z.string()).default({}),
  customization: z.record(z.string(), z.string()).default({}),
});

export const cartUpdateSchema = z.object({
  lineId: z.string().min(1).max(200),
  /** Zero removes the line. */
  quantity: z.number().int().min(0).max(20),
});

export const cartRemoveSchema = z.object({
  lineId: z.string().min(1).max(200),
});

export const wishlistToggleSchema = z.object({
  productId: objectId,
});

/**
 * Admin-entered order. Admins are trusted to set status and are the only callers
 * who may, which is why this is separate from `checkoutSchema`.
 */
export const adminOrderSchema = z.object({
  customerName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  status: z
    .enum([
      "pending",
      "confirmed",
      "processing",
      "stitching",
      "packed",
      "shipped",
      "delivered",
      "cancelled",
      "refunded",
      "returned",
    ])
    .default("pending"),
  notes: z.string().optional(),
  shippingMethod: z.string().optional(),
  paymentMethod: z.string().optional(),
  couponCode: z.string().optional(),
  giftWrap: z.boolean().default(false),
  termsAccepted: z.boolean().default(false),
  items: z
    .array(
      z.object({
        productId: z.string().optional(),
        name: z.string(),
        sku: z.string().optional(),
        variant: z.record(z.string(), z.string()).default({}),
        quantity: z.number().min(1),
        price: z.number().min(0),
        customization: z.record(z.string(), z.any()).default({}),
      }),
    )
    .default([]),
  shippingAddress: z
    .object({
      name: z.string().optional(),
      line1: z.string().optional(),
      line2: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
      postalCode: z.string().optional(),
      phone: z.string().optional(),
    })
    .optional(),
  billingAddress: z
    .object({
      name: z.string().optional(),
      line1: z.string().optional(),
      line2: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
      postalCode: z.string().optional(),
      phone: z.string().optional(),
    })
    .optional(),
  totals: z
    .object({
      subtotal: z.number().min(0).default(0),
      shipping: z.number().min(0).default(0),
      discount: z.number().min(0).default(0),
      tax: z.number().min(0).default(0),
      grandTotal: z.number().min(0).default(0),
    })
    .default({
      subtotal: 0,
      shipping: 0,
      discount: 0,
      tax: 0,
      grandTotal: 0,
    }),
  timeline: z
    .array(
      z.object({
        status: z.string(),
        note: z.string().optional(),
        at: z.string().optional(),
      }),
    )
    .default([]),
});

export const measurementSchema = z.object({
  label: z.string().min(2),
  profileName: z.string().min(2),
  userId: z.string().optional(),
  height: z.string().optional(),
  bust: z.string().optional(),
  waist: z.string().optional(),
  hip: z.string().optional(),
  shoulder: z.string().optional(),
  sleeve: z.string().optional(),
  armhole: z.string().optional(),
  length: z.string().optional(),
  notes: z.string().optional(),
  customMeasurements: z.record(z.string(), z.string()).default({}),
});

export const customOrderAdminSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  productType: z.string().min(2),
  budget: z.string().optional(),
  occasion: z.string().optional(),
  deliveryDate: z.string().optional(),
  fabricPreference: z.string().optional(),
  colorPreference: z.string().optional(),
  embroideryPreference: z.string().optional(),
  referenceNotes: z.string().optional(),
  measurements: z.record(z.string(), z.union([z.string(), z.number()])).default({}),
  inspirationImages: z.array(z.string()).default([]),
  specialInstructions: z.string().optional(),
  stage: z
    .enum(["submitted", "review", "quotation", "approved", "production", "delivered"])
    .default("submitted"),
});

export const supportTicketSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(2),
  message: z.string().min(10),
  status: z.enum(["open", "in_progress", "resolved", "closed"]).default("open"),
  priority: z.enum(["low", "normal", "high"]).default("normal"),
});

export const newsletterSubscriberSchema = z.object({
  email: z.string().email(),
  status: z.enum(["active", "unsubscribed"]).default("active"),
  source: z.string().optional(),
});

export const blogSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  excerpt: z.string().optional(),
  content: z.string().min(10),
  category: z.string().optional(),
  author: z.string().optional(),
  heroImage: z.string().optional(),
  tags: z.array(z.string()).default([]),
  status: z.enum(["draft", "published"]).default("draft"),
  seo: seoSchema.optional(),
});

export const testimonialSchema = z.object({
  name: z.string().min(2),
  role: z.string().optional(),
  rating: z.number().min(1).max(5).default(5),
  quote: z.string().min(2),
  avatar: z.string().optional(),
  featured: z.boolean().default(false),
});

export const faqSchema = z.object({
  question: z.string().min(2),
  answer: z.string().min(2),
  category: z.string().optional(),
  sortOrder: z.number().default(0),
  active: z.boolean().default(true),
});

export const bannerSchema = z.object({
  title: z.string().min(2),
  subtitle: z.string().optional(),
  desktopImage: z.string().optional(),
  mobileImage: z.string().optional(),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
  publishAt: z.string().optional(),
  expiresAt: z.string().optional(),
  active: z.boolean().default(true),
});

export const menuSchema = z.object({
  name: z.string().min(2),
  location: z.enum(["header", "footer", "mobile", "account"]).default("header"),
  items: z
    .array(
      z.object({
        label: z.string(),
        href: z.string(),
        children: z
          .array(
            z.object({
              label: z.string(),
              href: z.string(),
            }),
          )
          .default([]),
      }),
    )
    .default([]),
  active: z.boolean().default(true),
});

export const settingSchema = z.object({
  siteName: z.string().default("Divya & Design"),
  tagline: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  address: z.string().optional(),
  workingHours: z.string().optional(),
  socialLinks: z
    .record(z.string(), z.string().url())
    .default({}),
  payment: z
    .object({
      gateway: z.string().optional(),
      currency: z.string().default("INR"),
      codEnabled: z.boolean().default(false),
    })
    .default({
      currency: "INR",
      codEnabled: false,
    }),
  shipping: z
    .object({
      freeShippingThreshold: z.number().min(0).optional(),
      defaultCharge: z.number().min(0).default(0),
    })
    .default({
      defaultCharge: 0,
    }),
  seo: seoSchema.optional(),
});

export const notificationSchema = z.object({
  userId: z.string().optional(),
  type: z.string(),
  title: z.string(),
  message: z.string(),
  readAt: z.string().optional(),
  metadata: z.record(z.string(), z.any()).default({}),
});

export const auditLogSchema = z.object({
  actorId: z.string().optional(),
  actorEmail: z.string().optional(),
  action: z.string(),
  entity: z.string(),
  entityId: z.string().optional(),
  metadata: z.record(z.string(), z.any()).default({}),
  ip: z.string().optional(),
  userAgent: z.string().optional(),
});

export const addressSchema = z.object({
  userId: z.string().optional(),
  label: z.string().optional(),
  name: z.string().min(2),
  line1: z.string().min(2),
  line2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  country: z.string().min(2),
  postalCode: z.string().min(3),
  phone: z.string().optional(),
  defaultShipping: z.boolean().default(false),
  defaultBilling: z.boolean().default(false),
});
