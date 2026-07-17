export const mainNav = [
  { label: "Home", href: "/", hasDropdown: false },
  { label: "Shop", href: "/shop", hasDropdown: true },
  { label: "Custom Orders", href: "/custom-order", hasDropdown: false },
  { label: "New Arrivals", href: "/collections?type=new-arrivals", hasDropdown: false },
  { label: "About Us", href: "/about", hasDropdown: false },
  { label: "Size Guide", href: "/saved-measurements", hasDropdown: false },
  { label: "Contact Us", href: "/contact", hasDropdown: false },
] as const;

export const footerQuickLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Custom Orders", href: "/custom-order" },
  { label: "Size Guide", href: "/saved-measurements" },
  { label: "Return & Exchange", href: "/return-policy" },
  { label: "Shipping Policy", href: "/privacy-policy" },
  { label: "FAQ", href: "/faq" },
] as const;

export const customerLinks = [
  { label: "Profile", href: "/account" },
  { label: "Orders", href: "/orders" },
  { label: "Measurements", href: "/saved-measurements" },
  { label: "Addresses", href: "/saved-addresses" },
  { label: "Track Order", href: "/track-order" },
] as const;

export const adminLinks = [
  { label: "Dashboard", href: "/admin" },
  { label: "Products", href: "/admin/products" },
  { label: "Categories", href: "/admin/categories" },
  { label: "Collections", href: "/admin/collections" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Customers", href: "/admin/customers" },
  { label: "Settings", href: "/admin/settings" },
] as const;
