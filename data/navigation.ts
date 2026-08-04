export type NavChild = {
  label: string;
  href: string;
  description?: string;
};

export type NavItem = {
  label: string;
  href: string;
  /** Populated for items that open the mega-menu. */
  children?: NavChild[];
};

/**
 * Primary storefront navigation.
 *
 * `children` drives the Shop mega-menu. Category hrefs use the existing
 * server-side `?category=` filter on /shop — no new routes are introduced, and
 * the slugs match those seeded in lib/demo-data.ts.
 */
export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Shop",
    href: "/shop",
    children: [
      {
        label: "All Pieces",
        href: "/shop",
        description: "The complete atelier catalogue",
      },
      {
        label: "Kurtis",
        href: "/shop?category=kurtis",
        description: "Everyday and occasion",
      },
      {
        label: "Blouses",
        href: "/shop?category=blouses",
        description: "Tailored to the saree",
      },
      {
        label: "Dresses",
        href: "/shop?category=dresses",
        description: "Modern silhouettes",
      },
      {
        label: "Co-ord Sets",
        href: "/shop?category=co-ord-sets",
        description: "Considered pairings",
      },
      {
        label: "Lehengas",
        href: "/shop?category=lehengas",
        description: "Bridal and festive",
      },
    ],
  },
  { label: "Bespoke", href: "/custom-order" },
  { label: "Collections", href: "/collections" },
  { label: "Atelier", href: "/about" },
  { label: "Size Guide", href: "/size-guide" },
  { label: "Contact", href: "/contact" },
];

export const footerQuickLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Bespoke Orders", href: "/custom-order" },
  { label: "Size Guide", href: "/size-guide" },
  { label: "Collections", href: "/collections" },
  { label: "Journal", href: "/blogs" },
  { label: "FAQ", href: "/faq" },
] as const;

export const footerCareLinks = [
  { label: "Track Order", href: "/track-order" },
  { label: "Returns & Exchange", href: "/return-policy" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Contact Us", href: "/contact" },
] as const;

export const customerLinks = [
  { label: "Profile", href: "/account", icon: "user" },
  { label: "Orders", href: "/orders", icon: "box" },
  { label: "Measurements", href: "/saved-measurements", icon: "tape" },
  { label: "Addresses", href: "/saved-addresses", icon: "pin" },
  { label: "Track Order", href: "/track-order", icon: "truck" },
] as const;

export const adminLinks = [
  { label: "Dashboard", href: "/admin" },
  { label: "Products", href: "/admin/products" },
  { label: "Categories", href: "/admin/categories" },
  { label: "Collections", href: "/admin/collections" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Custom Orders", href: "/admin/custom-orders" },
  { label: "Customers", href: "/admin/customers" },
  { label: "Settings", href: "/admin/settings" },
] as const;

export const socialLinks = [
  { label: "Instagram", href: "https://instagram.com", icon: "instagram" },
  { label: "Facebook", href: "https://facebook.com", icon: "facebook" },
  { label: "Pinterest", href: "https://pinterest.com", icon: "pinterest" },
  { label: "WhatsApp", href: "https://wa.me/919876543210", icon: "whatsapp" },
] as const;

/** Single source of truth for contact details shown across the site. */
export const brandContact = {
  phone: "+91 98765 43210",
  email: "support@divyaanddesign.com",
  hours: "Monday – Saturday, 10am – 7pm IST",
  address: "Atelier No. 12, Linking Road, Bandra West, Mumbai 400050",
} as const;
