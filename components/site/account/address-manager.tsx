"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Icon } from "@/components/site/icons";
import { Button } from "@/components/ui/button";
import { Field, FormStatus, Input } from "@/components/ui/field";
import { cn } from "@/lib/cn";

export type SavedAddress = {
  _id: string;
  label?: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone?: string;
  defaultShipping?: boolean;
  defaultBilling?: boolean;
};

type FormState = {
  label: string;
  name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
  defaultShipping: boolean;
};

const EMPTY: FormState = {
  label: "",
  name: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  country: "India",
  postalCode: "",
  phone: "",
  defaultShipping: false,
};

/**
 * Saved address book.
 *
 * Talks to `/api/addresses`, which scopes every read and write to the session — the
 * `userId` in the request body is ignored, so one customer cannot write into
 * another's account. After a change we `router.refresh()` rather than patching a
 * local array, so the list always reflects what was actually stored (including the
 * server's "exactly one default" adjustment).
 */
export function AddressManager({ addresses }: { addresses: SavedAddress[] }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(addresses.length === 0);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function startEdit(address: SavedAddress) {
    setEditingId(address._id);
    setForm({
      label: address.label ?? "",
      name: address.name ?? "",
      line1: address.line1 ?? "",
      line2: address.line2 ?? "",
      city: address.city ?? "",
      state: address.state ?? "",
      country: address.country ?? "India",
      postalCode: address.postalCode ?? "",
      phone: address.phone ?? "",
      defaultShipping: Boolean(address.defaultShipping),
    });
    setOpen(true);
    setStatus("idle");
    setFeedback("");
  }

  function reset() {
    setEditingId(null);
    setForm(EMPTY);
    setStatus("idle");
    setFeedback("");
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setFeedback("");

    try {
      const response = await fetch(
        editingId ? `/api/addresses/${editingId}` : "/api/addresses",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            label: form.label || undefined,
            line2: form.line2 || undefined,
            defaultBilling: form.defaultShipping,
          }),
        },
      );
      const body = await response.json();

      if (!response.ok) {
        setStatus("error");
        setFeedback(body?.message ?? "Could not save that address.");
        return;
      }

      reset();
      setOpen(false);
      router.refresh();
    } catch {
      setStatus("error");
      setFeedback("Could not reach the studio. Please try again.");
    }
  }

  async function remove(address: SavedAddress) {
    setBusyId(address._id);

    try {
      const response = await fetch(`/api/addresses/${address._id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        setFeedback("Could not remove that address.");
        setStatus("error");
        return;
      }
      if (editingId === address._id) reset();
      router.refresh();
    } catch {
      setStatus("error");
      setFeedback("Could not reach the studio. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="mt-10 grid gap-8">
      {addresses.length ? (
        <ul className="grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <li
              key={address._id}
              className={cn(
                "rounded-card border border-line bg-surface p-5 transition-opacity",
                busyId === address._id && "opacity-60",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  {address.label ? (
                    <p className="eyebrow text-brass-ink">{address.label}</p>
                  ) : null}
                  <p className="mt-1 text-sm font-medium text-ink">
                    {address.name}
                  </p>
                </div>
                {address.defaultShipping ? (
                  <span className="shrink-0 rounded-full border border-brass bg-brass-wash px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-brass-ink">
                    Default
                  </span>
                ) : null}
              </div>

              <address className="mt-3 text-sm not-italic leading-6 text-ink-soft">
                {address.line1}
                {address.line2 ? <>, {address.line2}</> : null}
                <br />
                {address.city}, {address.state} {address.postalCode}
                <br />
                {address.country}
                {address.phone ? (
                  <>
                    <br />
                    {address.phone}
                  </>
                ) : null}
              </address>

              <div className="mt-5 flex gap-4 border-t border-line pt-4">
                <button
                  type="button"
                  onClick={() => startEdit(address)}
                  className="text-xs uppercase tracking-[0.14em] text-ink-soft transition-colors hover:text-brass-ink"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => remove(address)}
                  disabled={busyId === address._id}
                  className="text-xs uppercase tracking-[0.14em] text-ink-soft transition-colors hover:text-danger disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      {open ? (
        <form
          onSubmit={onSubmit}
          className="grid gap-5 rounded-card border border-line bg-surface p-6 md:p-7"
        >
          <h2 className="font-display text-lg text-ink">
            {editingId ? "Edit address" : "Add an address"}
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Label"
              htmlFor="address-label"
              hint="Optional — Home, Studio, Mum's."
            >
              <Input
                id="address-label"
                value={form.label}
                onChange={(event) => update("label", event.target.value)}
              />
            </Field>

            <Field label="Recipient name" htmlFor="manage-address-name" required>
              <Input
                id="manage-address-name"
                autoComplete="name"
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
                required
              />
            </Field>
          </div>

          <Field label="Address line 1" htmlFor="manage-address-line1" required>
            <Input
              id="manage-address-line1"
              autoComplete="address-line1"
              value={form.line1}
              onChange={(event) => update("line1", event.target.value)}
              required
            />
          </Field>

          <Field label="Address line 2" htmlFor="manage-address-line2">
            <Input
              id="manage-address-line2"
              autoComplete="address-line2"
              value={form.line2}
              onChange={(event) => update("line2", event.target.value)}
            />
          </Field>

          <div className="grid gap-5 md:grid-cols-3">
            <Field label="City" htmlFor="manage-address-city" required>
              <Input
                id="manage-address-city"
                autoComplete="address-level2"
                value={form.city}
                onChange={(event) => update("city", event.target.value)}
                required
              />
            </Field>

            <Field label="State" htmlFor="manage-address-state" required>
              <Input
                id="manage-address-state"
                autoComplete="address-level1"
                value={form.state}
                onChange={(event) => update("state", event.target.value)}
                required
              />
            </Field>

            <Field label="PIN code" htmlFor="manage-address-postal" required>
              <Input
                id="manage-address-postal"
                inputMode="numeric"
                autoComplete="postal-code"
                value={form.postalCode}
                onChange={(event) => update("postalCode", event.target.value)}
                required
              />
            </Field>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Country" htmlFor="manage-address-country" required>
              <Input
                id="manage-address-country"
                autoComplete="country-name"
                value={form.country}
                onChange={(event) => update("country", event.target.value)}
                required
              />
            </Field>

            <Field label="Phone" htmlFor="manage-address-phone">
              <Input
                id="manage-address-phone"
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={(event) => update("phone", event.target.value)}
              />
            </Field>
          </div>

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={form.defaultShipping}
              onChange={(event) => update("defaultShipping", event.target.checked)}
              className="accent-[var(--color-brass-ink)]"
            />
            <span className="text-sm text-ink-soft">
              Use this as my default delivery and billing address
            </span>
          </label>

          <div className="flex flex-wrap items-center gap-4">
            <Button type="submit" disabled={status === "loading"}>
              {status === "loading"
                ? "Saving…"
                : editingId
                  ? "Save changes"
                  : "Save address"}
              <Icon name="check" className="h-4 w-4" />
            </Button>

            {addresses.length ? (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  reset();
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
            ) : null}

            <FormStatus
              status={status === "error" ? "error" : status === "loading" ? "loading" : "idle"}
              message={feedback}
            />
          </div>
        </form>
      ) : (
        <div>
          <Button type="button" variant="secondary" onClick={() => setOpen(true)}>
            <Icon name="plus" className="h-4 w-4" />
            Add another address
          </Button>
        </div>
      )}
    </div>
  );
}
