"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Icon } from "@/components/site/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

/**
 * Add-to-cart button.
 *
 * Posts to `/api/cart`, which re-prices the line server-side and rejects anything
 * unavailable — so the failure message shown here is the real reason, not a guess.
 * `router.refresh()` re-renders the server components above (the header cart
 * badge, in particular) once the write lands.
 */
export function AddToCart({
  productId,
  variant,
  disabled,
  disabledLabel,
  className,
}: {
  productId: string;
  /** Chosen options, e.g. `{ size: "M" }`. */
  variant?: Record<string, string>;
  disabled?: boolean;
  disabledLabel?: string;
  className?: string;
}) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "saving" | "added" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function add() {
    setState("saving");
    setMessage("");

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1, variant: variant ?? {} }),
      });
      const body = await response.json();

      if (!response.ok) {
        setState("error");
        setMessage(body?.message ?? "Could not add that to your bag.");
        return;
      }

      setState("added");
      router.refresh();
    } catch {
      setState("error");
      setMessage("Could not reach the studio. Please try again.");
    }
  }

  if (disabled) {
    return (
      <Button type="button" size="lg" disabled className={cn("w-full", className)}>
        {disabledLabel ?? "Sold out"}
      </Button>
    );
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Button
        type="button"
        size="lg"
        onClick={add}
        disabled={state === "saving"}
        className="w-full"
      >
        {state === "saving"
          ? "Adding…"
          : state === "added"
            ? "Added to bag"
            : "Add to bag"}
        <Icon
          name={state === "added" ? "check" : "bag"}
          className="h-4 w-4"
        />
      </Button>

      <p
        aria-live="polite"
        className={cn(
          "min-h-5 text-xs leading-5",
          state === "error" ? "text-danger" : "text-ink-soft",
        )}
      >
        {state === "error" ? message : null}
      </p>
    </div>
  );
}
