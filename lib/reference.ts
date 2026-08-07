import { randomInt } from "node:crypto";

/** Characters that survive being read aloud or copied by hand. */
const ALPHABET = "ACDEFGHJKLMNPQRTUVWXY3456789";

/**
 * A human-quotable reference like `TKT-20260807-K7QP4M`.
 *
 * Replaces the `${prefix}-${Date.now()}` pattern used for ticket and custom-order
 * ids. Those fields carry unique indexes, so two submissions in the same
 * millisecond produced a duplicate-key error surfacing as a 500 — and a
 * timestamp-derived id tells anyone holding one roughly what the neighbouring
 * references are.
 */
export function generateReference(prefix: string, now = new Date()) {
  const date = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");

  let suffix = "";
  for (let index = 0; index < 6; index += 1) {
    suffix += ALPHABET[randomInt(ALPHABET.length)];
  }

  return `${prefix}-${date}-${suffix}`;
}
