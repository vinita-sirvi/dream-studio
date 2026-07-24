import Link from "next/link";

import { Icon } from "./icons";

function getProductImage(images: ProductCardProps["product"]["images"]) {
  return [...(images ?? [])]
    .filter((image) => image.type !== "video" && image.url?.trim())
    .sort((a, b) => Number(Boolean(b.isPrimary)) - Number(Boolean(a.isPrimary)) || (a.sortOrder ?? 0) - (b.sortOrder ?? 0))[0];
}

type ProductCardProps = {
  product: {
    name: string;
    slug: string;
    shortDescription?: string;
    price: number;
    mrp?: number;
    discountPercent?: number;
    category?: string;
    stock?: number;
    images?: Array<{ url: string; alt?: string; type?: string; isPrimary?: boolean; sortOrder?: number }>;
  };
  href?: string;
};

export function ProductCard({
  product,
  href,
}: ProductCardProps) {
  const image = getProductImage(product.images);
  const card = (
    <article className="group overflow-hidden rounded-[1.4rem] border border-[#eadccc] bg-white shadow-[0_16px_34px_rgba(94,67,43,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_42px_rgba(94,67,43,0.12)]">
      <div className="relative aspect-[4/5]">
        {image ? (
          <img src={image.url} alt={image.alt || product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full place-items-center bg-[#f8f1e8] px-6 text-center text-xs uppercase tracking-[0.14em] text-[#8a7768]">
            Image coming soon
          </div>
        )}
        {product.discountPercent ? (
          <span className="absolute left-3 top-3 rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#2f2319]">
            {product.discountPercent}% off
          </span>
        ) : null}
        <button
          type="button"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/80 text-[#2f2319] opacity-90 transition hover:opacity-100"
          aria-label="Wishlist"
        >
          <Icon name="heart" className="h-4 w-4" />
        </button>
        <div className="absolute bottom-3 left-3 rounded-full bg-white/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#2f2319]">
          {product.category ?? "Shop"}
        </div>
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-medium leading-6 text-[#2f2319]">
            {product.name}
          </h3>
          <span className="shrink-0 text-sm font-semibold text-[#2f2319]">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
        </div>
        {product.shortDescription ? (
          <p className="text-sm leading-6 text-[#66574a]">{product.shortDescription}</p>
        ) : null}
        {product.mrp && product.mrp > product.price ? (
          <p className="text-xs text-[#8a7768] line-through">
            ₹{product.mrp.toLocaleString("en-IN")}
          </p>
        ) : null}
      </div>
    </article>
  );

  if (!href) {
    return card;
  }

  return (
    <Link href={href} className="block">
      {card}
    </Link>
  );
}
