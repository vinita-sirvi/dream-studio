import mongoose, { Schema, type Model } from "mongoose";

function getModel(name: string, schema: Schema): Model<any> {
  return (mongoose.models[name] as Model<any>) ?? mongoose.model(name, schema);
}

const seoSchema = new Schema(
  {
    title: String,
    description: String,
    keywords: [String],
    image: String,
    canonical: String,
  },
  { _id: false },
);

const mediaSchema = new Schema(
  {
    url: { type: String, required: true },
    alt: String,
    type: { type: String, enum: ["image", "video"], default: "image" },
    isPrimary: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { _id: false },
);

const variantSchema = new Schema(
  {
    size: String,
    color: String,
    length: String,
    sleeve: String,
    fabric: String,
    customPrice: Number,
    stock: { type: Number, default: 0 },
    sku: String,
    barcode: String,
    images: [String],
  },
  { _id: false },
);

const inventorySchema = new Schema(
  {
    trackInventory: { type: Boolean, default: true },
    stock: { type: Number, default: 0 },
    lowStockAlert: { type: Number, default: 5 },
    unlimitedStock: { type: Boolean, default: false },
    backorder: { type: Boolean, default: false },
  },
  { _id: false },
);

const pricingSchema = new Schema(
  {
    mrp: { type: Number, default: 0 },
    sellingPrice: { type: Number, default: 0 },
    discountPercent: { type: Number, default: 0 },
    couponEligible: { type: Boolean, default: true },
    flashSale: { type: Boolean, default: false },
    specialPrice: Number,
    offerStart: String,
    offerEnd: String,
  },
  { _id: false },
);

const customizationSchema = new Schema(
  {
    enabled: { type: Boolean, default: false },
    neckStyles: [String],
    sleeves: [String],
    fabrics: [String],
    lining: [String],
    embroidery: [String],
    lengths: [String],
    dupatta: [String],
    bottomStyles: [String],
    extraWork: [String],
    personalNotes: { type: Boolean, default: true },
    uploadInspirationImages: { type: Boolean, default: true },
    measurements: { type: Boolean, default: true },
    additionalCharges: { type: Number, default: 0 },
    livePriceUpdate: { type: Boolean, default: false },
  },
  { _id: false },
);

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: String,
    role: {
      type: String,
      enum: ["customer", "admin", "super_admin"],
      default: "customer",
    },
    phone: String,
    avatar: String,
    googleId: String,
    otpHash: String,
    otpExpiresAt: Date,
    emailVerifiedAt: Date,
    preferences: {
      marketingEmails: { type: Boolean, default: true },
      orderUpdates: { type: Boolean, default: true },
      smsUpdates: { type: Boolean, default: false },
    },
  },
  { timestamps: true },
);

const roleSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    permissions: [String],
    description: String,
  },
  { timestamps: true },
);

const categorySchema = new Schema(
  {
    name: { type: String, required: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: String,
    parentId: { type: Schema.Types.ObjectId, ref: "Category" },
    image: String,
    banner: String,
    seo: seoSchema,
    sortOrder: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    hidden: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const collectionSchema = new Schema(
  {
    name: { type: String, required: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: String,
    heroImage: String,
    scheduleStart: Date,
    scheduleEnd: Date,
    featured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["draft", "active", "scheduled", "expired"],
      default: "draft",
    },
    seo: seoSchema,
    productIds: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true },
);

const productSchema = new Schema(
  {
    name: { type: String, required: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    sku: { type: String, required: true, unique: true, index: true },
    barcode: String,
    brand: String,
    categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
    collectionId: { type: Schema.Types.ObjectId, ref: "Collection" },
    description: { type: String, required: true },
    shortDescription: String,
    highlights: [String],
    specifications: [
      new Schema(
        {
          label: String,
          value: String,
        },
        { _id: false },
      ),
    ],
    fabric: String,
    careInstructions: String,
    occasion: String,
    color: String,
    pattern: String,
    material: String,
    fit: String,
    weight: String,
    countryOfOrigin: String,
    taxPercentage: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["draft", "active", "archived"],
      default: "draft",
    },
    visibility: {
      type: String,
      enum: ["public", "private", "hidden"],
      default: "public",
    },
    tags: [String],
    seo: seoSchema,
    images: [mediaSchema],
    variants: [variantSchema],
    inventory: inventorySchema,
    pricing: pricingSchema,
    customization: customizationSchema,
  },
  { timestamps: true },
);

const orderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    name: String,
    sku: String,
    variant: { type: Schema.Types.Mixed, default: {} },
    quantity: Number,
    price: Number,
    customization: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false },
);

const addressInlineSchema = new Schema(
  {
    name: String,
    line1: String,
    line2: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
    phone: String,
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    customerName: String,
    email: String,
    phone: String,
    status: {
      type: String,
      enum: [
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
      ],
      default: "pending",
    },
    notes: String,
    shippingMethod: String,
    paymentMethod: String,
    couponCode: String,
    giftWrap: { type: Boolean, default: false },
    termsAccepted: { type: Boolean, default: false },
    items: [orderItemSchema],
    shippingAddress: addressInlineSchema,
    billingAddress: addressInlineSchema,
    totals: {
      subtotal: { type: Number, default: 0 },
      shipping: { type: Number, default: 0 },
      discount: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      grandTotal: { type: Number, default: 0 },
    },
    timeline: [
      new Schema(
        {
          status: String,
          note: String,
          at: String,
        },
        { _id: false },
      ),
    ],
    invoiceUrl: String,
    shippingLabelUrl: String,
  },
  { timestamps: true },
);

const measurementSchema = new Schema(
  {
    label: String,
    profileName: String,
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    height: String,
    bust: String,
    waist: String,
    hip: String,
    shoulder: String,
    sleeve: String,
    armhole: String,
    length: String,
    notes: String,
    customMeasurements: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

const couponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, index: true },
    type: { type: String, enum: ["percentage", "flat"], required: true },
    value: { type: Number, required: true },
    minimumPurchase: { type: Number, default: 0 },
    maximumDiscount: Number,
    usageLimit: Number,
    perUserLimit: Number,
    expiryDate: Date,
    categoryIds: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    productIds: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    autoApply: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const customOrderSchema = new Schema(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    name: String,
    email: String,
    phone: String,
    productType: String,
    budget: String,
    occasion: String,
    deliveryDate: Date,
    fabricPreference: String,
    colorPreference: String,
    embroideryPreference: String,
    referenceNotes: String,
    measurements: { type: Schema.Types.Mixed, default: {} },
    inspirationImages: [String],
    specialInstructions: String,
    stage: {
      type: String,
      enum: ["submitted", "review", "quotation", "approved", "production", "delivered"],
      default: "submitted",
    },
    quotation: {
      amount: Number,
      notes: String,
      approvedAt: Date,
    },
  },
  { timestamps: true },
);

const supportTicketSchema = new Schema(
  {
    ticketId: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    name: String,
    email: String,
    phone: String,
    subject: String,
    message: String,
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
    },
    priority: { type: String, enum: ["low", "normal", "high"], default: "normal" },
    source: { type: String, default: "contact-form" },
    adminNotes: String,
  },
  { timestamps: true },
);

const newsletterSubscriberSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    status: { type: String, enum: ["active", "unsubscribed"], default: "active" },
    source: String,
    lastEmailAt: Date,
  },
  { timestamps: true },
);

const blogSchema = new Schema(
  {
    title: String,
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: String,
    content: String,
    category: String,
    author: String,
    heroImage: String,
    tags: [String],
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    seo: seoSchema,
  },
  { timestamps: true },
);

const testimonialSchema = new Schema(
  {
    name: String,
    role: String,
    rating: { type: Number, default: 5 },
    quote: String,
    avatar: String,
    featured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const faqSchema = new Schema(
  {
    question: String,
    answer: String,
    category: String,
    sortOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const bannerSchema = new Schema(
  {
    title: String,
    subtitle: String,
    desktopImage: String,
    mobileImage: String,
    ctaLabel: String,
    ctaHref: String,
    publishAt: Date,
    expiresAt: Date,
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const menuSchema = new Schema(
  {
    name: String,
    location: {
      type: String,
      enum: ["header", "footer", "mobile", "account"],
      default: "header",
    },
    items: [
      new Schema(
        {
          label: String,
          href: String,
          children: [
            new Schema(
              {
                label: String,
                href: String,
              },
              { _id: false },
            ),
          ],
        },
        { _id: false },
      ),
    ],
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const settingSchema = new Schema(
  {
    siteName: { type: String, default: "Divya & Design" },
    tagline: String,
    email: String,
    phone: String,
    whatsapp: String,
    address: String,
    workingHours: String,
    socialLinks: { type: Schema.Types.Mixed, default: {} },
    payment: {
      gateway: String,
      currency: { type: String, default: "INR" },
      codEnabled: { type: Boolean, default: false },
    },
    shipping: {
      freeShippingThreshold: Number,
      defaultCharge: { type: Number, default: 0 },
    },
    seo: seoSchema,
  },
  { timestamps: true },
);

const notificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    type: String,
    title: String,
    message: String,
    readAt: Date,
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

const auditLogSchema = new Schema(
  {
    actorId: { type: Schema.Types.ObjectId, ref: "User" },
    actorEmail: String,
    action: String,
    entity: String,
    entityId: String,
    metadata: { type: Schema.Types.Mixed, default: {} },
    ip: String,
    userAgent: String,
  },
  { timestamps: true },
);

const addressSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    label: String,
    name: String,
    line1: String,
    line2: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
    phone: String,
    defaultShipping: { type: Boolean, default: false },
    defaultBilling: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const wishlistSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    guestSessionId: String,
    productIds: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    items: [
      new Schema(
        {
          productId: { type: Schema.Types.ObjectId, ref: "Product" },
          variant: { type: Schema.Types.Mixed, default: {} },
          addedAt: Date,
        },
        { _id: false },
      ),
    ],
  },
  { timestamps: true },
);

const cartSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    guestSessionId: String,
    items: [
      new Schema(
        {
          productId: { type: Schema.Types.ObjectId, ref: "Product" },
          productName: String,
          sku: String,
          variant: { type: Schema.Types.Mixed, default: {} },
          quantity: Number,
          price: Number,
          customization: { type: Schema.Types.Mixed, default: {} },
        },
        { _id: false },
      ),
    ],
    couponCode: String,
    notes: String,
  },
  { timestamps: true },
);

export const User = getModel("User", userSchema);
export const Role = getModel("Role", roleSchema);
export const Category = getModel("Category", categorySchema);
export const Collection = getModel("Collection", collectionSchema);
export const Product = getModel("Product", productSchema);
export const Order = getModel("Order", orderSchema);
export const Measurement = getModel("Measurement", measurementSchema);
export const Coupon = getModel("Coupon", couponSchema);
export const CustomOrder = getModel("CustomOrder", customOrderSchema);
export const SupportTicket = getModel("SupportTicket", supportTicketSchema);
export const NewsletterSubscriber = getModel(
  "NewsletterSubscriber",
  newsletterSubscriberSchema,
);
export const Blog = getModel("Blog", blogSchema);
export const Testimonial = getModel("Testimonial", testimonialSchema);
export const Faq = getModel("Faq", faqSchema);
export const Banner = getModel("Banner", bannerSchema);
export const Menu = getModel("Menu", menuSchema);
export const Setting = getModel("Setting", settingSchema);
export const Notification = getModel("Notification", notificationSchema);
export const AuditLog = getModel("AuditLog", auditLogSchema);
export const Address = getModel("Address", addressSchema);
export const Wishlist = getModel("Wishlist", wishlistSchema);
export const Cart = getModel("Cart", cartSchema);
export const Media = getModel(
  "Media",
  new Schema(
    {
      url: String,
      alt: String,
      type: String,
      folder: String,
      tags: [String],
    },
    { timestamps: true },
  ),
);

export const models = {
  User,
  Role,
  Category,
  Collection,
  Product,
  Order,
  Measurement,
  Coupon,
  CustomOrder,
  SupportTicket,
  NewsletterSubscriber,
  Blog,
  Testimonial,
  Faq,
  Banner,
  Menu,
  Setting,
  Notification,
  AuditLog,
  Address,
  Wishlist,
  Cart,
  Media,
} as const;

export type AppModelName = keyof typeof models;
