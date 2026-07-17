import Link from "next/link";

import { Icon } from "./icons";

const toneClasses = {
  rose: "from-[#efd0d8] to-[#d79aa8]",
  gold: "from-[#f1d9aa] to-[#d8a647]",
  ivory: "from-[#f7f1e8] to-[#e8d8c3]",
  slate: "from-[#d7e0ea] to-[#93adc5]",
  wine: "from-[#e9c7c8] to-[#9a4b55]",
  plum: "from-[#ebd8ef] to-[#a274b5]",
  olive: "from-[#dbe7c8] to-[#88a14f]",
  blush: "from-[#f3d8da] to-[#d18b99]",
} as const;

function ProductVisual({ tone }: { tone: keyof typeof toneClasses }) {
  return (
    <div className={`relative h-full w-full overflow-hidden bg-gradient-to-br ${toneClasses[tone]}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.7),transparent_26%),radial-gradient(circle_at_20%_70%,rgba(255,255,255,0.26),transparent_22%)]" />
      <div className="absolute left-[12%] top-[14%] h-24 w-24 rounded-full bg-white/30 blur-3xl" />
      <div className="absolute left-1/2 top-[12%] h-[16%] w-[20%] -translate-x-1/2 rounded-[48%] bg-[#e5b8a0] shadow-[0_12px_20px_rgba(88,50,31,0.1)]" />
      <div className="absolute left-1/2 top-[20%] h-[28%] w-[34%] -translate-x-1/2 rounded-[42%_42%_18%_18%] bg-[rgba(255,255,255,0.18)]" />
      <div className="absolute left-1/2 top-[24%] h-[42%] w-[38%] -translate-x-1/2 rounded-[40%_40%_18%_18%/22%_22%_10%_10%] bg-[rgba(255,255,255,0.28)]" />
      <div className="absolute bottom-6 left-1/2 h-2.5 w-24 -translate-x-1/2 rounded-full bg-black/10 blur-sm" />
    </div>
  );
}

export function ProductCard({
  product,
  href,
}: {
  product: {
    name: string;
    slug: string;
    shortDescription?: string;
    price: number;
    mrp?: number;
    discountPercent?: number;
    category?: string;
    collection?: string;
    tone: keyof typeof toneClasses;
    stock?: number;
  };
  href?: string;
}) {
  const card = (
    <article className="group overflow-hidden rounded-[1.4rem] border border-[#eadccc] bg-white shadow-[0_16px_34px_rgba(94,67,43,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_42px_rgba(94,67,43,0.12)]">
      <div className="relative aspect-[4/5]">
        <ProductVisual tone={product.tone} />
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
