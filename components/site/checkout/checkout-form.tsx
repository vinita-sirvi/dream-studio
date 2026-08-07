"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Icon } from "@/components/site/icons";
import { Button } from "@/components/ui/button";
import { Field, FormStatus, Input, Select, Textarea } from "@/components/ui/field";
import { cn } from "@/lib/cn";
import { formatRupees } from "@/lib/product";

type SavedAddress = {
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
};

type AddressForm = {
  name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
};

const EMPTY_ADDRESS: AddressForm = {
  name: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  country: "India",
  postalCode: "",
  phone: "",
};

/**
 * Checkout.
 *
 * Sends contact and address details only. Items, prices and totals are read from
 * the server-side cart by `/api/orders` — the amounts shown here are for
 * confirmation, not an input to the calculation, so there is nothing to tamper
 * with. Field-level errors come back from the route's Zod flatten() output.
 */
export function CheckoutForm({
  defaultName,
  defaultEmail,
  savedAddresses,
  codEnabled,
  grandTotal,
}: {
  defaultName: string;
  defaultEmail: string;
  savedAddresses: SavedAddress[];
  codEnabled: boolean;
  grandTotal: number;
}) {
  const router = useRouter();

  const preferred =
    savedAddresses.find((address) => address.defaultShipping) ?? savedAddresses[0];

  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    preferred?._id ?? "new",
  );
  const [contact, setContact] = useState({
    customerName: defaultName,
    email: defaultEmail,
    phone: preferred?.phone ?? "",
  });
  const [address, setAddress] = useState<AddressForm>(
    preferred ? toForm(preferred) : EMPTY_ADDRESS,
  );
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">(
    "standard",
  );
  const [paymentMethod, setPaymentMethod] = useState(
    codEnabled ? "cod" : "pay-on-quotation",
  );
  const [giftWrap, setGiftWrap] = useState(false);
  const [notes, setNotes] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  function chooseAddress(id: string) {
    setSelectedAddressId(id);
    if (id === "new") {
      setAddress(EMPTY_ADDRESS);
      return;
    }
    const found = savedAddresses.find((entry) => entry._id === id);
    if (found) {
      setAddress(toForm(found));
      if (found.phone) {
        setContact((current) => ({ ...current, phone: found.phone! }));
      }
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setFeedback("");
    setFieldErrors({});

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...contact,
          notes: notes || undefined,
          shippingMethod,
          paymentMethod,
          giftWrap,
          termsAccepted,
          shippingAddress: address,
        }),
      });

      const body = await response.json();

      if (!response.ok) {
        setStatus("error");
        setFeedback(body?.message ?? "Could not place your order.");
        setFieldErrors(body?.details?.fieldErrors ?? {});
        // A 409 means the cart changed underneath us (something sold out, a price
        // moved). Refreshing pulls the corrected summary into view.
        if (response.status === 409) {
          router.refresh();
        }
        return;
      }

      router.push(`/order-confirmed?orderId=${encodeURIComponent(body.data.orderId)}`);
    } catch {
      setStatus("error");
      setFeedback("Could not reach the studio. Please try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-9">
      <fieldset className="grid gap-5">
        <legend className="eyebrow mb-1 text-brass-ink">Contact</legend>

        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Full name"
            htmlFor="checkout-name"
            required
            error={fieldErrors.customerName?.[0]}
          >
            <Input
              id="checkout-name"
              autoComplete="name"
              value={contact.customerName}
              onChange={(event) =>
                setContact((c) => ({ ...c, customerName: event.target.value }))
              }
              required
            />
          </Field>

          <Field
            label="Email"
            htmlFor="checkout-email"
            hint="Your order confirmation goes here."
            required
            error={fieldErrors.email?.[0]}
          >
            <Input
              id="checkout-email"
              type="email"
              autoComplete="email"
              value={contact.email}
              onChange={(event) =>
                setContact((c) => ({ ...c, email: event.target.value }))
              }
              required
            />
          </Field>
        </div>

        <Field
          label="Phone"
          htmlFor="checkout-phone"
          hint="A tailor may call to confirm fit."
          required
          error={fieldErrors.phone?.[0]}
        >
          <Input
            id="checkout-phone"
            type="tel"
            autoComplete="tel"
            value={contact.phone}
            onChange={(event) =>
              setContact((c) => ({ ...c, phone: event.target.value }))
            }
            required
          />
        </Field>
      </fieldset>

      <fieldset className="grid gap-5 border-t border-line pt-8">
        <legend className="eyebrow mb-1 text-brass-ink">Delivery address</legend>

        {savedAddresses.length ? (
          <Field label="Use a saved address" htmlFor="checkout-saved">
            <Select
              id="checkout-saved"
              value={selectedAddressId}
              onChange={(event) => chooseAddress(event.target.value)}
            >
              {savedAddresses.map((entry) => (
                <option key={entry._id} value={entry._id}>
                  {entry.label ? `${entry.label} — ` : ""}
                  {entry.line1}, {entry.city}
                </option>
              ))}
              <option value="new">Use a new address</option>
            </Select>
          </Field>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Recipient name"
            htmlFor="address-name"
            required
            error={fieldErrors["shippingAddress.name"]?.[0]}
          >
            <Input
              id="address-name"
              autoComplete="shipping name"
              value={address.name}
              onChange={(event) =>
                setAddress((a) => ({ ...a, name: event.target.value }))
              }
              required
            />
          </Field>

          <Field
            label="Contact number"
            htmlFor="address-phone"
            required
            error={fieldErrors["shippingAddress.phone"]?.[0]}
          >
            <Input
              id="address-phone"
              type="tel"
              autoComplete="shipping tel"
              value={address.phone}
              onChange={(event) =>
                setAddress((a) => ({ ...a, phone: event.target.value }))
              }
              required
            />
          </Field>
        </div>

        <Field label="Address line 1" htmlFor="address-line1" required>
          <Input
            id="address-line1"
            autoComplete="shipping address-line1"
            value={address.line1}
            onChange={(event) =>
              setAddress((a) => ({ ...a, line1: event.target.value }))
            }
            required
          />
        </Field>

        <Field
          label="Address line 2"
          htmlFor="address-line2"
          hint="Optional — landmark, flat number."
        >
          <Input
            id="address-line2"
            autoComplete="shipping address-line2"
            value={address.line2}
            onChange={(event) =>
              setAddress((a) => ({ ...a, line2: event.target.value }))
            }
          />
        </Field>

        <div className="grid gap-5 md:grid-cols-3">
          <Field label="City" htmlFor="address-city" required>
            <Input
              id="address-city"
              autoComplete="shipping address-level2"
              value={address.city}
              onChange={(event) =>
                setAddress((a) => ({ ...a, city: event.target.value }))
              }
              required
            />
          </Field>

          <Field label="State" htmlFor="address-state" required>
            <Input
              id="address-state"
              autoComplete="shipping address-level1"
              value={address.state}
              onChange={(event) =>
                setAddress((a) => ({ ...a, state: event.target.value }))
              }
              required
            />
          </Field>

          <Field label="PIN code" htmlFor="address-postal" required>
            <Input
              id="address-postal"
              inputMode="numeric"
              autoComplete="shipping postal-code"
              value={address.postalCode}
              onChange={(event) =>
                setAddress((a) => ({ ...a, postalCode: event.target.value }))
              }
              required
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="grid gap-5 border-t border-line pt-8">
        <legend className="eyebrow mb-1 text-brass-ink">
          Delivery &amp; payment
        </legend>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Delivery speed" htmlFor="checkout-shipping">
            <Select
              id="checkout-shipping"
              value={shippingMethod}
              onChange={(event) =>
                setShippingMethod(event.target.value as "standard" | "express")
              }
            >
              <option value="standard">Standard — 5 to 7 days</option>
              <option value="express">Express — 2 to 3 days</option>
            </Select>
          </Field>

          <Field
            label="Payment"
            htmlFor="checkout-payment"
            error={fieldErrors.paymentMethod?.[0]}
          >
            <Select
              id="checkout-payment"
              value={paymentMethod}
              onChange={(event) => setPaymentMethod(event.target.value)}
            >
              {/* Cash on delivery appears only when the studio has enabled it in
                  settings; the server rejects it otherwise. */}
              {codEnabled ? (
                <option value="cod">Cash on delivery</option>
              ) : null}
              <option value="bank-transfer">Bank transfer</option>
              <option value="pay-on-quotation">
                Pay once a tailor confirms
              </option>
            </Select>
          </Field>
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line p-4 transition-colors hover:border-line-strong">
          <input
            type="checkbox"
            checked={giftWrap}
            onChange={(event) => setGiftWrap(event.target.checked)}
            className="mt-0.5 accent-[var(--color-brass-ink)]"
          />
          <span>
            <span className="block text-sm font-medium text-ink">
              Gift wrap this order
            </span>
            <span className="mt-0.5 block text-xs leading-5 text-ink-soft">
              Hand-wrapped in cotton and tissue, with a handwritten note.
            </span>
          </span>
        </label>

        <Field
          label="Notes for the workroom"
          htmlFor="checkout-notes"
          hint="Optional — occasion, deadline, anything we should know."
        >
          <Textarea
            id="checkout-notes"
            rows={4}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </Field>
      </fieldset>

      <div className="border-t border-line pt-8">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(event) => setTermsAccepted(event.target.checked)}
            className="mt-1 accent-[var(--color-brass-ink)]"
            required
          />
          <span className="text-sm leading-6 text-ink-soft">
            I accept the{" "}
            <a href="/terms" className="text-brass-ink underline">
              terms
            </a>{" "}
            and{" "}
            <a href="/return-policy" className="text-brass-ink underline">
              return policy
            </a>
            .
          </span>
        </label>
        {fieldErrors.termsAccepted?.[0] ? (
          <p role="alert" className="mt-2 text-xs text-danger">
            {fieldErrors.termsAccepted[0]}
          </p>
        ) : null}

        <Button
          type="submit"
          size="lg"
          disabled={status === "loading" || !termsAccepted}
          className={cn("mt-7 w-full")}
        >
          {status === "loading"
            ? "Placing your order…"
            : `Place order · ${formatRupees(grandTotal)}`}
          <Icon name="lock" className="h-4 w-4" />
        </Button>

        <div className="mt-3">
          <FormStatus
            status={status === "error" ? "error" : status === "loading" ? "loading" : "idle"}
            message={feedback}
          />
        </div>
      </div>
    </form>
  );
}

function toForm(address: SavedAddress): AddressForm {
  return {
    name: address.name ?? "",
    line1: address.line1 ?? "",
    line2: address.line2 ?? "",
    city: address.city ?? "",
    state: address.state ?? "",
    country: address.country ?? "India",
    postalCode: address.postalCode ?? "",
    phone: address.phone ?? "",
  };
}
