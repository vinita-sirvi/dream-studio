import type { Model } from "mongoose";
import { z } from "zod";

import { models, type AppModelName } from "./models";
import {
  addressSchema,
  authLoginSchema,
  authRegisterSchema,
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
  newsletterSchema,
  newsletterSubscriberSchema,
  notificationSchema,
  orderSchema,
  otpRequestSchema,
  otpVerifySchema,
  productSchema,
  settingSchema,
  supportTicketSchema,
  testimonialSchema,
} from "./validators";

type ResourceConfig = {
  modelName: AppModelName;
  schema?: z.ZodTypeAny;
  publicWrite?: boolean;
};

export const resourceRegistry: Record<string, ResourceConfig> = {
  products: { modelName: "Product", schema: productSchema },
  categories: { modelName: "Category", schema: categorySchema },
  collections: { modelName: "Collection", schema: collectionSchema },
  orders: { modelName: "Order", schema: orderSchema },
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
  menus: { modelName: "Menu", schema: z.any() },
  settings: { modelName: "Setting", schema: settingSchema },
  users: { modelName: "User", schema: authRegisterSchema },
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
  authRegister: { modelName: "User", schema: authRegisterSchema, publicWrite: true },
  authLogin: { modelName: "User", schema: authLoginSchema, publicWrite: true },
  otpRequest: { modelName: "User", schema: otpRequestSchema, publicWrite: true },
  otpVerify: { modelName: "User", schema: otpVerifySchema, publicWrite: true },
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
