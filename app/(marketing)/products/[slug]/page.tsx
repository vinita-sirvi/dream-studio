import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/site/product-card";
import { formatRupees, orderedImages } from "@/lib/product";
import { ProductGallery } from "@/components/site/product/gallery";
import { PurchasePanel } from "@/components/site/product/purchase-panel";
import { ProductReviews } from "@/components/site/product/reviews";
import { Icon } from "@/components/site/icons";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { Accordion } from "@/components/ui/accordion";
import { getProductBySlug } from "@/lib/storefront";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { product } = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product not found" };
  }

  const image = orderedImages(product.images)[0];

  return {
    title: product.name,
    description: product.shortDescription ?? product.description,
    openGraph: {
      title: product.name,
      description: product.shortDescription ?? product.description,
      images: image ? [{ url: image.url }] : undefined,
    },
  };
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { product, relatedProducts } = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const images = orderedImages(product.images);
  const onSale = Boolean(product.mrp && product.mrp > product.price);
  const inStock = (product.stock ?? 0) > 0;

  // Spec rows, built only from fields that are actually populated.
  const specs: Array<{ label: string; value: string }> = [
    { label: "Fabric", value: product.fabric },
    { label: "Colour", value: product.color },
    { label: "Occasion", value: (product as { occasion?: string }).occasion },
    { label: "Fit", value: (product as { fit?: string }).fit },
    { label: "Pattern", value: (product as { pattern?: string }).pattern },
    { label: "SKU", value: product.sku },
  ].filter((row): row is { label: string; value: string } => Boolean(row.value));

  const careInstructions = (product as { careInstructions?: string })
    .careInstructions;

  // JSON-LD so the product is eligible for rich results.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription ?? product.description,
    sku: product.sku,
    ...(images.length ? { image: images.map((image) => image.url) } : {}),
    ...(product.fabric ? { material: product.fabric } : {}),
    ...(product.color ? { color: product.color } : {}),
    brand: { "@type": "Brand", name: "Divya & Design" },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "INR",
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/PreOrder",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Product data is our own and contains no user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="shell pt-28 md:pt-32">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="pb-8">
          <ol className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-ink-faint">
            <li>
              <Link href="/" className="transition-colors hover:text-brass-ink">
                Home
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <Icon name="chevron-right" className="h-3 w-3 opacity-50" />
              <Link href="/shop" className="transition-colors hover:text-brass-ink">
                Shop
              </Link>
            </li>
            {product.category ? (
              <li className="flex items-center gap-2">
                <Icon name="chevron-right" className="h-3 w-3 opacity-50" />
                <Link
                  href={`/shop?category=${product.categorySlug ?? ""}`}
                  className="transition-colors hover:text-brass-ink"
                >
                  {product.category}
                </Link>
              </li>
            ) : null}
            <li className="flex items-center gap-2">
              <Icon name="chevron-right" className="h-3 w-3 opacity-50" />
              <span aria-current="page" className="text-ink">
                {product.name}
              </span>
            </li>
          </ol>
        </nav>

        {/* Gallery + buy */}
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <ProductGallery images={images} productName={product.name} />

          <div>
            {product.category ? (
              <p className="eyebrow text-brass-ink">{product.category}</p>
            ) : null}

            <h1 className="mt-4 display-lg text-ink">{product.name}</h1>

            <div className="mt-5 flex flex-wrap items-baseline gap-3">
              <span className="font-display text-3xl text-ink">
                {formatRupees(product.price)}
              </span>
              {onSale ? (
                <span className="text-base text-ink-faint line-through">
                  {formatRupees(product.mrp!)}
                </span>
              ) : null}
              {product.discountPercent ? (
                <span className="rounded-full bg-brass-wash px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-brass-ink">
                  {product.discountPercent}% off
                </span>
              ) : null}
            </div>

            <p className="mt-2 text-xs text-ink-soft">
              Inclusive of all taxes · Free shipping across India
            </p>

            <p className="mt-6 max-w-xl text-[15px] leading-8 text-ink-soft">
              {product.description}
            </p>

            {/* Highlights */}
            {product.highlights?.length ? (
              <ul className="mt-7 grid gap-2.5">
                {(product.highlights as string[]).map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm leading-6 text-ink"
                  >
                    <Icon
                      name="check"
                      className="mt-0.5 h-4 w-4 shrink-0 text-brass"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}

            <PurchasePanel
              productName={product.name}
              productSlug={product.slug}
              inStock={inStock}
            />
          </div>
        </div>

        {/* Details */}
        <div className="mt-20 grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          {specs.length ? (
            <div>
              <h2 className="display-md text-ink">Specification</h2>
              <dl className="mt-6 grid gap-px bg-line">
                {specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex items-baseline justify-between gap-6 bg-canvas py-3.5"
                  >
                    <dt className="text-[11px] uppercase tracking-[0.14em] text-ink-faint">
                      {spec.label}
                    </dt>
                    <dd className="text-sm text-ink">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}

          <div>
            <h2 className="display-md text-ink">Good to know</h2>
            <Accordion
              className="mt-6"
              defaultOpen={0}
              items={[
                {
                  question: "Care instructions",
                  answer:
                    careInstructions ??
                    "Dry clean recommended. Press on the reverse and store folded with acid-free tissue between the layers.",
                },
                {
                  question: "Delivery",
                  answer: inStock
                    ? "Dispatched in 2–3 working days as a standard size, or 10–14 days made to your measurements. Insured and tracked across India."
                    : "Made to order in 10–14 working days from confirmation. Insured and tracked across India.",
                },
                {
                  question: "Alterations & returns",
                  answer:
                    "Ninety days of free alterations from delivery — post it back at our cost and we adjust it. Unworn standard sizes can be returned within fourteen days; made-to-measure pieces are covered by the alteration promise instead.",
                },
                {
                  question: "Made to measure",
                  answer:
                    "Any piece here can be cut to your twelve measurements at no extra cost. Select 'Made to my measurements' above, or start a bespoke commission if you want to change the design itself.",
                },
              ]}
            />
          </div>
        </div>

        <ProductReviews />
      </div>

      {/* Related */}
      {relatedProducts.length ? (
        <section className="border-t border-line bg-canvas-warm py-20">
          <div className="shell">
            <SectionHeading
              eyebrow="You may also like"
              title="From the same category"
              size="md"
            />
            <Reveal
              stagger={0.07}
              className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4 lg:gap-x-6"
            >
              {relatedProducts.map((item) => (
                <ProductCard key={item.slug} product={item} />
              ))}
            </Reveal>
          </div>
        </section>
      ) : null}
    </>
  );
}
