"use client";

import dynamic from "next/dynamic";

import { canRunWebglHero } from "@/lib/motion";
import { useCapability } from "@/lib/use-client-env";

/**
 * `ssr: false` is only legal inside a Client Component in Next 16, which is why
 * this loader carries the "use client" directive rather than the page.
 *
 * The import is inside `dynamic()` so the bundler can split it: `three` (~150KB
 * gzipped) is fetched only after the capability check passes, and never on
 * mobile, low-core devices, or under prefers-reduced-motion.
 */
const FabricScene = dynamic(() => import("./fabric-scene"), { ssr: false });

export function FabricBackdrop() {
  // Server snapshot is `false`, so the WebGL layer is absent from the SSR HTML
  // and only appears once the client confirms the device can handle it.
  const enabled = useCapability(canRunWebglHero);

  if (!enabled) return null;
  return <FabricScene />;
}
