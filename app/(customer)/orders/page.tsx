import { SectionPage } from "@/components/site/section-page";

export default function OrdersPage() {
  return (
    <SectionPage
      eyebrow="Orders"
      title="Order history, timelines, invoices, and delivery tracking."
      description="Designed to show the full order lifecycle from confirmed to delivered, with support for returns and refunds."
      points={[
        "Supports order status timeline states.",
        "Invoice and shipping label access later.",
        "Good foundation for customer notifications.",
      ]}
      primaryCta={{ label: "Track Order", href: "/track-order" }}
      secondaryCta={{ label: "Shop", href: "/shop" }}
    />
  );
}
