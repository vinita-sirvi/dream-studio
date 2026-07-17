import { SectionPage } from "@/components/site/section-page";

export default function CategoriesPage() {
  return (
    <SectionPage
      eyebrow="Categories"
      title="Structured category browsing for kurtis, blouses, dresses, lehengas, and more."
      description="The category system is set up for nested taxonomies, featured placement, category banners, and SEO-friendly slugs."
      points={[
        "Supports parent-child category relationships.",
        "Designed for featured, hidden, and display-order-driven merchandising.",
        "Ready for category-specific landing pages and metadata.",
      ]}
      primaryCta={{ label: "Go to Shop", href: "/shop" }}
      secondaryCta={{ label: "See FAQ", href: "/faq" }}
    />
  );
}
