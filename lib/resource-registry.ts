import type { Model } from "mongoose";
import { z } from "zod";

import { models, type AppModelName } from "./models";
import {
  addressSchema,
  adminOrderSchema,
  adminUserSchema,
  auditLogSchema,
  bannerSchema,
  blogSchema,
  categorySchema,
  collectionSchema,
  contactSchema,
  couponSchema,
  customOrderAdminSchema,
  customOrderSchema,
  faqSchema,
  measurementSchema,
  menuSchema,
  newsletterSchema,
  newsletterSubscriberSchema,
  notificationSchema,
  productSchema,
  settingSchema,
  supportTicketSchema,
  testimonialSchema,
} from "./validators";

type ResourceConfig = {
  modelName: AppModelName;
  schema?: z.ZodTypeAny;
  publicWrite?: boolean;
  /**
   * Mongoose projection applied to every read of this resource, used to keep
   * credential material out of API responses.
   */
  select?: string;
};

/**
 * Everything reachable through `/api/admin/[resource]`.
 *
 * Two rules this registry has to hold up:
 *
 *  1. A resource is admin-only unless it explicitly sets `publicWrite`. The
 *     entries for `authRegister`/`authLogin`/`otpRequest`/`otpVerify` used to
 *     live here with `publicWrite: true` purely to share their Zod schemas. That
 *     made `POST /api/admin/authRegister` an unauthenticated user-creation
 *     endpoint that skipped password hashing entirely. The dedicated routes under
 *     `app/api/auth/*` import those schemas straight from `./validators`, so the
 *     entries were removed rather than fixed.
 *
 *  2. Anything holding credential material sets `select` so reads cannot leak it.
 */
export const resourceRegistry: Record<string, ResourceConfig> = {
  products: { modelName: "Product", schema: productSchema },
  categories: { modelName: "Category", schema: categorySchema },
  collections: { modelName: "Collection", schema: collectionSchema },
  orders: { modelName: "Order", schema: adminOrderSchema },
  measurements: { modelName: "Measurement", schema: measurementSchema },
  coupons: { modelName: "Coupon", schema: couponSchema },
  "custom-orders": { modelName: "CustomOrder", schema: customOrderAdminSchema },
  "support-tickets": { modelName: "SupportTicket", schema: supportTicketSchema },
  newsletters: {
    modelName: "NewsletterSubscriber",
    schema: newsletterSubscriberSchema,
  },
  blogs: { modelName: "Blog", schema: blogSchema },
  testimonials: { modelName: "Testimonial", schema: testimonialSchema },
  faqs: { modelName: "Faq", schema: faqSchema },
  banners: { modelName: "Banner", schema: bannerSchema },
  menus: { modelName: "Menu", schema: menuSchema },
  settings: { modelName: "Setting", schema: settingSchema },
  users: {
    modelName: "User",
    schema: adminUserSchema,
    select: "-passwordHash -otpHash -otpExpiresAt",
  },
  roles: { modelName: "Role", schema: z.any() },
  notifications: { modelName: "Notification", schema: notificationSchema },
  "audit-logs": { modelName: "AuditLog", schema: auditLogSchema },
  addresses: { modelName: "Address", schema: addressSchema },
  wishlists: { modelName: "Wishlist", schema: z.any() },
  carts: { modelName: "Cart", schema: z.any() },
  media: { modelName: "Media", schema: z.any() },
  contact: { modelName: "SupportTicket", schema: contactSchema, publicWrite: true },
  newsletter: {
    modelName: "NewsletterSubscriber",
    schema: newsletterSchema,
    publicWrite: true,
  },
  "custom-order-public": {
    modelName: "CustomOrder",
    schema: customOrderSchema,
    publicWrite: true,
  },
};

export function getResourceModel(resource: string) {
  const config = resourceRegistry[resource];
  if (!config) {
    return null;
  }

  return models[config.modelName] as Model<any>;
}

export function getResourceSchema(resource: string) {
  return resourceRegistry[resource]?.schema ?? null;
}

export function isPublicWriteResource(resource: string) {
  return Boolean(resourceRegistry[resource]?.publicWrite);
}

/** Projection that keeps credential material out of responses. */
export function getResourceSelect(resource: string) {
  return resourceRegistry[resource]?.select ?? null;
}
