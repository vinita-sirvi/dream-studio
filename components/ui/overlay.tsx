"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type ReactNode,
} from "react";

import { setScrollLocked } from "@/components/motion/smooth-scroll";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/site/icons";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), ' +
  'textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Shared modal behaviour for <Dialog> and <Drawer>:
 *  - locks the (Lenis or native) scroller while open
 *  - moves focus into the panel on open and restores it on close
 *  - traps Tab within the panel
 *  - closes on Escape
 *
 * These are the four things that make an overlay usable by keyboard, and the
 * four things most hand-rolled modals miss.
 */
function useModalBehaviour(
  open: boolean,
  onClose: () => void,
  panelRef: React.RefObject<HTMLDivElement | null>,
) {
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    restoreFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    setScrollLocked(true);

    // Focus the first control, or the panel itself if there is none.
    const panel = panelRef.current;
    const first = panel?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? panel)?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const nodes = panel?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!nodes || nodes.length === 0) {
        event.preventDefault();
        return;
      }

      const list = Array.from(nodes).filter(
        (node) => node.offsetParent !== null || node === document.activeElement,
      );
      if (!list.length) return;

      const firstNode = list[0];
      const lastNode = list[list.length - 1];

      if (event.shiftKey && document.activeElement === firstNode) {
        event.preventDefault();
        lastNode.focus();
      } else if (!event.shiftKey && document.activeElement === lastNode) {
        event.preventDefault();
        firstNode.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      setScrollLocked(false);
      restoreFocusRef.current?.focus({ preventScroll: true });
    };
  }, [open, onClose, panelRef]);
}

type OverlayProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Hide the title visually but keep it for assistive tech. */
  hideTitle?: boolean;
  description?: string;
  children: ReactNode;
  className?: string;
};

/** Centred modal dialog. */
export function Dialog({
  open,
  onClose,
  title,
  hideTitle,
  description,
  children,
  className,
}: OverlayProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descId = useId();

  const close = useCallback(() => onClose(), [onClose]);
  useModalBehaviour(open, close, panelRef);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close"
        onClick={close}
        className="absolute inset-0 cursor-default bg-espresso/45 backdrop-blur-sm animate-[vt-fade-in_240ms_ease-out]"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        className={cn(
          "relative max-h-[92dvh] w-full overflow-y-auto rounded-t-panel bg-canvas shadow-float",
          "sm:max-w-3xl sm:rounded-panel",
          "animate-[vt-fade-in_320ms_var(--ease-out-expo)]",
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5 sm:px-8">
          <div>
            <h2
              id={titleId}
              className={cn("display-md", hideTitle && "sr-only")}
            >
              {title}
            </h2>
            {description ? (
              <p id={descId} className="mt-1 text-sm text-ink-soft">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close dialog"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line text-ink transition-colors hover:border-brass hover:bg-brass-wash"
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>
        <div className="px-6 py-6 sm:px-8">{children}</div>
      </div>
    </div>
  );
}

/** Edge-anchored sheet. Used for the size guide and mobile filters. */
export function Drawer({
  open,
  onClose,
  title,
  description,
  children,
  side = "right",
  className,
}: OverlayProps & { side?: "left" | "right" }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descId = useId();

  const close = useCallback(() => onClose(), [onClose]);
  useModalBehaviour(open, close, panelRef);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90]">
      <button
        type="button"
        aria-label="Close"
        onClick={close}
        className="absolute inset-0 cursor-default bg-espresso/45 backdrop-blur-sm"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        className={cn(
          "absolute inset-y-0 flex w-full max-w-md flex-col bg-canvas shadow-float",
          side === "right"
            ? "right-0 animate-[drawer-in-right_420ms_var(--ease-out-expo)]"
            : "left-0 animate-[drawer-in-left_420ms_var(--ease-out-expo)]",
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
          <div>
            <h2 id={titleId} className="display-md">
              {title}
            </h2>
            {description ? (
              <p id={descId} className="mt-1 text-sm text-ink-soft">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close panel"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line text-ink transition-colors hover:border-brass hover:bg-brass-wash"
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
      </div>
    </div>
  );
}
