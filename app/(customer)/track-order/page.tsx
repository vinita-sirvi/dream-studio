import { SectionPage } from "@/components/site/section-page";

export default function TrackOrderPage() {
  return (
    <SectionPage
      eyebrow="Track Order"
      title="Enter an order ID and follow the stitching, packing, and delivery timeline."
      description="This route is meant for high-visibility order tracking, support contact, and status-driven updates."
      points={[
        "Order lifecycle states can be shown visually.",
        "Supports admin and customer notifications.",
        "Works well for refund and return follow-up.",
      ]}
      primaryCta={{ label: "Orders", href: "/orders" }}
      secondaryCta={{ label: "Support", href: "/contact" }}
    />
  );
}
