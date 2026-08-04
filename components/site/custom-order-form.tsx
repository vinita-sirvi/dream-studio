"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { CloudinaryUploadField } from "@/components/admin/cloudinary-upload-field";
import { Button } from "@/components/ui/button";
import {
  Field,
  FormStatus,
  Input,
  Select,
  Textarea,
} from "@/components/ui/field";

import { Icon } from "./icons";

const initialState = {
  name: "",
  email: "",
  phone: "",
  productType: "",
  budget: "",
  occasion: "",
  deliveryDate: "",
  fabricPreference: "",
  colorPreference: "",
  embroideryPreference: "",
  referenceNotes: "",
  inspirationImage: "",
  specialInstructions: "",
  measurements: "",
};

const PRODUCT_TYPES = [
  "Kurti",
  "Blouse",
  "Dress",
  "Co-ord set",
  "Lehenga",
  "Saree conversion",
  "Alteration or restoration",
  "Something else",
];

const BUDGETS = [
  "Under ₹3,000",
  "₹3,000 – ₹6,000",
  "₹6,000 – ₹12,000",
  "₹12,000 – ₹25,000",
  "₹25,000 and above",
  "Not sure yet",
];

const OCCASIONS = [
  "Everyday",
  "Work",
  "Festive",
  "Wedding guest",
  "Bridal",
  "Gift",
];

/**
 * Bespoke commission brief. Posts to the existing /api/custom-order route.
 *
 * The submit handler — including the `label: value` measurement parsing and the
 * single-image `inspirationImages` array — is preserved exactly as it was. What
 * changed is presentation: real labels, grouped fieldsets, and an explanation of
 * the measurement format, which was previously an undocumented placeholder.
 */
export function CustomOrderForm() {
  const params = useSearchParams();

  // Prefilled when arriving from a product page's purchase panel.
  const referencedProduct = params.get("product") ?? "";
  const referencedSize = params.get("size") ?? "";
  const wantsMadeToMeasure = params.get("fit") === "made-to-measure";

  const [form, setForm] = useState({
    ...initialState,
    referenceNotes: referencedProduct
      ? `Based on catalogue piece: ${referencedProduct}` +
        (referencedSize ? ` (size ${referencedSize})` : "") +
        (wantsMadeToMeasure ? " — to be made to my measurements" : "")
      : "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [feedback, setFeedback] = useState("");

  function updateField(field: keyof typeof initialState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setFeedback("");

    // "bust: 34, waist: 28" -> { bust: "34", waist: "28" }
    const measurements = form.measurements
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean)
      .reduce<Record<string, string>>((accumulator, entry) => {
        const [label, value] = entry.split(":");
        if (label && value) {
          accumulator[label.trim()] = value.trim();
        }
        return accumulator;
      }, {});

    try {
      const response = await fetch("/api/custom-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          inspirationImages: form.inspirationImage
            ? [form.inspirationImage]
            : [],
          measurements,
        }),
      });

      if (!response.ok) {
        setStatus("error");
        setFeedback("Please check the details and try again.");
        return;
      }

      setStatus("success");
      setForm(initialState);
      setFeedback(
        "Brief received. A tailor will reply with a quotation within two working days.",
      );
    } catch {
      setStatus("error");
      setFeedback("Could not submit just now. Please email us directly.");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-9 rounded-panel border border-line bg-surface p-7 shadow-soft md:p-9"
    >
      {/* Contact */}
      <fieldset className="grid gap-5">
        <legend className="eyebrow mb-1 text-brass-ink">
          01 · How to reach you
        </legend>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Your name" htmlFor="co-name" required>
            <Input
              id="co-name"
              autoComplete="name"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              required
            />
          </Field>
          <Field label="Email address" htmlFor="co-email" required>
            <Input
              id="co-email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              required
            />
          </Field>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Phone" htmlFor="co-phone" required>
            <Input
              id="co-phone"
              type="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              required
            />
          </Field>
          <Field
            label="Needed by"
            htmlFor="co-date"
            hint="Tell us if it is for a fixed date."
          >
            <Input
              id="co-date"
              type="date"
              value={form.deliveryDate}
              onChange={(event) =>
                updateField("deliveryDate", event.target.value)
              }
            />
          </Field>
        </div>
      </fieldset>

      {/* The piece */}
      <fieldset className="grid gap-5 border-t border-line pt-8">
        <legend className="eyebrow mb-1 text-brass-ink">02 · The piece</legend>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="What would you like made?" htmlFor="co-type" required>
            <Select
              id="co-type"
              value={form.productType}
              onChange={(event) =>
                updateField("productType", event.target.value)
              }
              required
            >
              <option value="">Choose a garment</option>
              {PRODUCT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Occasion" htmlFor="co-occasion">
            <Select
              id="co-occasion"
              value={form.occasion}
              onChange={(event) => updateField("occasion", event.target.value)}
            >
              <option value="">Choose an occasion</option>
              {OCCASIONS.map((occasion) => (
                <option key={occasion} value={occasion}>
                  {occasion}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Budget"
            htmlFor="co-budget"
            hint="An honest range helps us suggest the right fabric."
          >
            <Select
              id="co-budget"
              value={form.budget}
              onChange={(event) => updateField("budget", event.target.value)}
            >
              <option value="">Choose a range</option>
              {BUDGETS.map((budget) => (
                <option key={budget} value={budget}>
                  {budget}
                </option>
              ))}
            </Select>
          </Field>

          <Field
            label="Colour preference"
            htmlFor="co-colour"
            hint="Colours you love, or ones to avoid."
          >
            <Input
              id="co-colour"
              value={form.colorPreference}
              onChange={(event) =>
                updateField("colorPreference", event.target.value)
              }
            />
          </Field>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Fabric preference"
            htmlFor="co-fabric"
            hint="Cotton, chanderi, silk, linen — or leave it to us."
          >
            <Input
              id="co-fabric"
              value={form.fabricPreference}
              onChange={(event) =>
                updateField("fabricPreference", event.target.value)
              }
            />
          </Field>
          <Field label="Embroidery or surface work" htmlFor="co-embroidery">
            <Input
              id="co-embroidery"
              value={form.embroideryPreference}
              onChange={(event) =>
                updateField("embroideryPreference", event.target.value)
              }
            />
          </Field>
        </div>
      </fieldset>

      {/* Detail */}
      <fieldset className="grid gap-5 border-t border-line pt-8">
        <legend className="eyebrow mb-1 text-brass-ink">03 · The detail</legend>

        <Field
          label="Reference notes"
          htmlFor="co-reference"
          hint="Describe what you have in mind, or link something you have seen."
        >
          <Textarea
            id="co-reference"
            rows={4}
            value={form.referenceNotes}
            onChange={(event) =>
              updateField("referenceNotes", event.target.value)
            }
          />
        </Field>

        <Field
          label="Measurements"
          htmlFor="co-measurements"
          hint="Optional. Format as label: value, separated by commas — for example “bust: 34, waist: 28, length: 44”. Leave blank and we will take them on a call."
        >
          <Input
            id="co-measurements"
            value={form.measurements}
            onChange={(event) => updateField("measurements", event.target.value)}
            placeholder="bust: 34, waist: 28, length: 44"
          />
        </Field>

        <Field
          label="Anything else we should know"
          htmlFor="co-instructions"
          hint="Fit preferences, past problems with off-the-rack sizing, fabrics you react to."
        >
          <Textarea
            id="co-instructions"
            rows={3}
            value={form.specialInstructions}
            onChange={(event) =>
              updateField("specialInstructions", event.target.value)
            }
          />
        </Field>

        <CloudinaryUploadField
          label="Inspiration image"
          value={form.inspirationImage}
          onChange={(next) => updateField("inspirationImage", next)}
          folder="custom-orders"
          helperText="A photograph of something similar is the single most useful thing you can send."
        />
      </fieldset>

      <div className="flex flex-wrap items-center gap-5 border-t border-line pt-8">
        <Button type="submit" disabled={status === "loading"} size="lg">
          {status === "loading" ? "Submitting…" : "Submit brief"}
          <Icon name="arrow-right" className="h-4 w-4" />
        </Button>
        <FormStatus status={status} message={feedback} />
      </div>

      <p className="text-xs leading-6 text-ink-soft">
        Submitting a brief costs nothing and commits you to nothing. We reply with
        a quotation, fabric suggestions and a realistic delivery date — you decide
        from there.
      </p>
    </form>
  );
}
