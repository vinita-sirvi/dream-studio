"use client";

import { useState } from "react";

import { Icon } from "./icons";

const slides = [
  ["/category-images/kurti.jpg", "Traditional kurti"],
  ["/category-images/blouse.jpg", "Embroidered blouse"],
  ["/category-images/lehenga.jpg", "Festive lehenga"],
  ["/category-images/ethnic-wear.jpg", "Indian ethnic wear"],
] as const;

export function OutfitSlider() {
  const [active, setActive] = useState(0);
  const [src, alt] = slides[active];

  function move(direction: -1 | 1) {
    setActive((current) => (current + direction + slides.length) % slides.length);
  }

  return (
    <div className="relative h-full w-full" aria-live="polite">
      <img src={src} alt={alt} className="h-full w-full object-cover transition-opacity duration-300" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#2a1b10]/25 via-transparent to-white/10" />
      <button
        type="button"
        onClick={() => move(-1)}
        className="absolute left-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/70 bg-white/85 text-[#2f2319] shadow-sm"
        aria-label="Previous outfit image"
      >
        <Icon name="chevron-left" className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => move(1)}
        className="absolute right-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/70 bg-white/85 text-[#2f2319] shadow-sm"
        aria-label="Next outfit image"
      >
        <Icon name="chevron-right" className="h-5 w-5" />
      </button>
      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/80 px-3 py-2">
        <span className="text-[11px] font-medium text-[#6a5649]">{active + 1} / {slides.length}</span>
        <div className="flex gap-1.5">
          {slides.map(([, slideAlt], index) => (
            <button
              key={slideAlt}
              type="button"
              onClick={() => setActive(index)}
              className={`h-2 w-2 rounded-full ${index === active ? "bg-[#3b2417]" : "bg-[#c7aa93]"}`}
              aria-label={`Show outfit image ${index + 1}`}
              aria-current={index === active ? "true" : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
