import { SectionPage } from "@/components/site/section-page";

export default function AdminSettingsPage() {
  return (
    <SectionPage
      eyebrow="Admin / Settings"
      title="Site settings, SEO, navigation, payment, email, and policy controls."
      description="This page is the placeholder for global configuration and platform-wide operational settings."
      points={[
        "Branding, menus, and content blocks.",
        "Email, payment, shipping, and SEO settings.",
        "Structured for long-term maintainability.",
      ]}
      primaryCta={{ label: "Dashboard", href: "/admin" }}
      secondaryCta={{ label: "Products", href: "/admin/products" }}
    />
  );
}
