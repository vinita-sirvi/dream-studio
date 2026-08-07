"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Shared wishlist state for product grids.
 *
 * Product cards render in grids of a dozen or more; each one fetching its own
 * saved state would mean a dozen requests per page. This fetches the id set once
 * and shares it, and applies toggles optimistically so the heart responds
 * immediately — reconciling with the server's answer, and rolling back if the
 * request fails.
 */
type WishlistContextValue = {
  ids: Set<string>;
  ready: boolean;
  toggle: (productId: string) => Promise<boolean>;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<Set<string>>(() => new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const response = await fetch("/api/wishlist?ids=1");
        if (!response.ok) return;
        const body = await response.json();
        if (!active) return;
        setIds(new Set<string>(body.data?.ids ?? []));
      } catch {
        // A failed read just means no hearts are pre-filled; not worth surfacing.
      } finally {
        if (active) setReady(true);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const toggle = useCallback(async (productId: string) => {
    // Optimistic: flip now, correct later.
    let optimistic = false;
    setIds((current) => {
      const next = new Set(current);
      if (next.has(productId)) {
        next.delete(productId);
        optimistic = false;
      } else {
        next.add(productId);
        optimistic = true;
      }
      return next;
    });

    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) throw new Error("toggle failed");

      const body = await response.json();
      const saved = Boolean(body.data?.saved);

      setIds((current) => {
        const next = new Set(current);
        if (saved) next.add(productId);
        else next.delete(productId);
        return next;
      });

      return saved;
    } catch {
      // Roll back to the pre-click state.
      setIds((current) => {
        const next = new Set(current);
        if (optimistic) next.delete(productId);
        else next.add(productId);
        return next;
      });
      return !optimistic;
    }
  }, []);

  const value = useMemo(() => ({ ids, ready, toggle }), [ids, ready, toggle]);

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

/**
 * Wishlist state for one product.
 *
 * Returns `supported: false` when there is no provider above, or when the id is not
 * a real database id — the bundled demo catalogue uses product slugs as ids, and
 * sending one would be rejected by the API, leaving a heart that appears to fill
 * and then springs back. Callers fall back to a local, unpersisted toggle instead.
 */
export function useWishlistItem(productId?: string) {
  const context = useContext(WishlistContext);
  const persistable = Boolean(productId && /^[a-f\d]{24}$/i.test(productId));

  if (!context || !productId || !persistable) {
    return { supported: false as const, saved: false, toggle: async () => false };
  }

  return {
    supported: true as const,
    saved: context.ids.has(productId),
    toggle: () => context.toggle(productId),
  };
}
