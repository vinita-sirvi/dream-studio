"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import { cn } from "@/lib/cn";
import { clamp, hasFinePointer } from "@/lib/motion";

import { Icon } from "../icons";

type GalleryImage = { url: string; alt?: string };

/**
 * Product gallery: thumbnail rail plus a main frame with hover-to-zoom.
 *
 * The zoom is a `transform: scale()` with a moving `transformOrigin`, so it runs
 * entirely on the compositor — no width/height changes, no layout, no reflow on
 * pointer move. Disabled for coarse pointers, where hover has no meaning.
 */
export function ProductGallery({
  images,
  productName,
}: {
  images: GalleryImage[];
  productName: string;
}) {
  const [active, setActive] = useState(0);
  const [zooming, setZooming] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const current = images[active];

  function onMove(event: React.PointerEvent) {
    if (!zooming) return;
    const frame = frameRef.current;
    const target = imageRef.current;
    if (!frame || !target) return;

    const rect = frame.getBoundingClientRect();
    const x = clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100);
    const y = clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100);
    target.style.transformOrigin = `${x}% ${y}%`;
  }

  function enterZoom() {
    if (hasFinePointer()) setZooming(true);
  }

  function step(direction: -1 | 1) {
    setActive((value) => (value + direction + images.length) % images.length);
  }

  if (!images.length) {
    return (
      <div className="grid aspect-4/5 place-items-center rounded-panel bg-surface-sunk">
        <span className="eyebrow text-ink-faint">Photography coming soon</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row-reverse lg:gap-5">
      {/* Main frame */}
      <div
        ref={frameRef}
        onPointerEnter={enterZoom}
        onPointerLeave={() => setZooming(false)}
        onPointerMove={onMove}
        className="group/frame relative aspect-4/5 flex-1 overflow-hidden rounded-panel bg-surface-sunk"
      >
        <div
          ref={imageRef}
          className={cn(
            "relative h-full w-full transition-transform duration-500 ease-[var(--ease-out-quart)] will-change-transform",
            zooming && "scale-[1.85] duration-700",
          )}
        >
          <Image
            key={current.url}
            src={current.url}
            alt={current.alt || `${productName} — view ${active + 1}`}
            fill
            priority
            sizes="(min-width: 1024px) 46vw, 92vw"
            className="object-cover"
          />
        </div>

        {/* Zoom affordance */}
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute right-4 top-4 hidden items-center gap-2 rounded-full bg-surface/90 px-3.5 py-2 text-[10px] font-medium uppercase tracking-[0.14em] text-ink backdrop-blur-sm transition-opacity duration-300 lg:flex",
            zooming ? "opacity-0" : "opacity-100",
          )}
        >
          <Icon name="zoom" className="h-3.5 w-3.5 text-brass" />
          Hover to zoom
        </span>

        {/* Arrows — touch-friendly, and the only control on coarse pointers */}
        {images.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-surface/90 text-ink backdrop-blur-sm transition-colors hover:bg-surface lg:opacity-0 lg:group-hover/frame:opacity-100"
            >
              <Icon name="chevron-left" className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-surface/90 text-ink backdrop-blur-sm transition-colors hover:bg-surface lg:opacity-0 lg:group-hover/frame:opacity-100"
            >
              <Icon name="chevron-right" className="h-4 w-4" />
            </button>
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-surface/90 px-3 py-1.5 text-[10px] tabular-nums tracking-wider text-ink backdrop-blur-sm">
              {active + 1} / {images.length}
            </span>
          </>
        ) : null}
      </div>

      {/* Thumbnails */}
      {images.length > 1 ? (
        <ul
          className="flex gap-3 overflow-x-auto lg:w-24 lg:flex-col lg:overflow-visible"
          aria-label="Product images"
        >
          {images.map((image, index) => (
            <li key={image.url} className="shrink-0">
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Show image ${index + 1}`}
                aria-current={index === active}
                className={cn(
                  "relative block aspect-4/5 w-20 overflow-hidden rounded-xl border-2 transition-colors duration-300 lg:w-full",
                  index === active
                    ? "border-brass"
                    : "border-transparent hover:border-line-strong",
                )}
              >
                <Image
                  src={image.url}
                  alt=""
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
