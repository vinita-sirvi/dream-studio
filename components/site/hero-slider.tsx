"use client";

import { useState } from "react";

import { Icon } from "./icons";

const slides = [
  ["/category-images/lehenga.jpg", "Embroidered Indian lehenga"],
  ["/category-images/kurti.jpg", "Handcrafted traditional outfit"],
  ["/category-images/ethnic-wear.jpg", "Elegant ethnic wear"],
  ["/category-images/blouse.jpg", "Festive blouse styling"],
] as const;

export function HeroSlider() {
  const [active, setActive] = useState(0);

  function move(direction: -1 | 1) {
    setActive((current) => (current + direction + slides.length) % slides.length);
  }

  const [src, alt] = slides[active];

  return (
    <div className="absolute inset-0" aria-live="polite">
      <img src={src} alt={alt} className="h-full w-full object-cover object-center transition-opacity duration-300" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#fff7f0]/45 via-transparent to-[#f2dfd1]/20" />
      <button
        type="button"
        onClick={() => move(-1)}
        className="absolute left-5 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-[#eadccc] bg-white/85 text-[#2f2319] shadow-sm"
        aria-label="Previous slide"
      >
        <Icon name="chevron-left" className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => move(1)}
        className="absolute right-5 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-[#eadccc] bg-white/85 text-[#2f2319] shadow-sm"
        aria-label="Next slide"
      >
        <Icon name="chevron-right" className="h-5 w-5" />
      </button>
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 rounded-full border border-[#eadccc] bg-white/75 px-4 py-2 shadow-sm">
        <span className="text-xs font-medium text-[#6a5649]">{active + 1} / {slides.length}</span>
        <div className="flex gap-1.5" aria-label="Choose slide">
          {slides.map(([, slideAlt], index) => (
            <button
              key={slideAlt}
              type="button"
              onClick={() => setActive(index)}
              className={`h-2 w-2 rounded-full ${index === active ? "bg-[#3b2417]" : "bg-[#c7aa93]"}`}
              aria-label={`Show slide ${index + 1}`}
              aria-current={index === active ? "true" : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
