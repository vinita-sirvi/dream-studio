import { SectionPage } from "@/components/site/section-page";

export default function BlogsPage() {
  return (
    <SectionPage
      eyebrow="Blogs"
      title="Editorial fashion content, style guides, and seasonal brand storytelling."
      description="The blog module can power SEO, long-form editorial, fashion education, and campaign support."
      points={[
        "Article schema and social sharing metadata ready.",
        "Useful for bridal, festive, and styling content.",
        "Helps organic search and brand authority.",
      ]}
      primaryCta={{ label: "Read More", href: "/about" }}
      secondaryCta={{ label: "FAQ", href: "/faq" }}
    />
  );
}
