import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { ProductCard, type ProductCardProduct } from "../product-card";

import { Icon } from "../icons";

/**
 * Latest arrivals rail, fed by `featuredProducts` from getShopData().
 *
 * Renders an honest empty state when the catalogue has nothing publishable
 * (no database configured, or no active product with an image) rather than a
 * silently blank section.
 */
export function LatestArrivals({
  products,
}: {
  products: ProductCardProduct[];
}) {
  return (
    <section className="shell py-20 md:py-28">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          eyebrow="New In"
          title="Latest from the workroom"
          description="Fresh cuts, added as they come off the table. Every piece here can also be made to your measurements."
        />
        <Reveal direction="up" className="shrink-0">
          <ButtonLink href="/shop" variant="underline">
            View everything
          </ButtonLink>
        </Reveal>
      </div>

      {products.length ? (
        <Reveal
          stagger={0.08}
          className="mt-14 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4 lg:gap-x-6"
        >
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </Reveal>
      ) : (
        <Reveal direction="up" className="mt-14">
          <div className="rounded-panel border border-line bg-canvas-warm px-8 py-16 text-center">
            <Icon name="hanger" className="mx-auto h-8 w-8 text-brass" />
            <p className="mt-5 font-display text-2xl text-ink">
              The rail is empty at the moment
            </p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-ink-soft">
              New pieces appear here once they are published with photography. In
              the meantime, a bespoke commission starts from a conversation.
            </p>
            <ButtonLink href="/custom-order" className="mt-8">
              Start a commission
              <Icon name="arrow-right" className="h-4 w-4" />
            </ButtonLink>
          </div>
        </Reveal>
      )}
    </section>
  );
}
