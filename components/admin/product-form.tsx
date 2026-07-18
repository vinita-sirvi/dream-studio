"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { CloudinaryUploadField } from "@/components/admin/cloudinary-upload-field";

type Option = {
  id: string;
  name: string;
};

type ImageItem = {
  url: string;
  alt: string;
  type: "image" | "video";
  isPrimary: boolean;
  sortOrder: string;
};

type SpecItem = {
  label: string;
  value: string;
};

type ProductFormValue = {
  name?: string;
  slug?: string;
  sku?: string;
  description?: string;
  shortDescription?: string;
  categoryId?: string;
  collectionId?: string;
  brand?: string;
  color?: string;
  fabric?: string;
  occasion?: string;
  careInstructions?: string;
  pattern?: string;
  material?: string;
  fit?: string;
  status?: string;
  visibility?: string;
  mrp?: number;
  sellingPrice?: number;
  discountPercent?: number;
  stock?: number;
  tags?: string;
  images?: Array<{
    url?: string;
    alt?: string;
    type?: "image" | "video";
    isPrimary?: boolean;
    sortOrder?: number;
  }>;
  highlights?: string[];
  specifications?: Array<{ label?: string; value?: string }>;
  customizationEnabled?: boolean;
  measurementsEnabled?: boolean;
};

function createEmptyImage(): ImageItem {
  return {
    url: "",
    alt: "",
    type: "image",
    isPrimary: false,
    sortOrder: "0",
  };
}

function createEmptySpec(): SpecItem {
  return { label: "", value: "" };
}

function ImageEditor({
  value,
  onChange,
}: {
  value: ImageItem[];
  onChange: (next: ImageItem[]) => void;
}) {
  return (
    <div className="grid gap-4">
      {value.map((item, index) => (
        <div
          key={`${item.url || "image"}-${index}`}
          className="grid gap-4 rounded-2xl border border-[#eadccc] bg-[#fcf8f2] p-4"
        >
          <CloudinaryUploadField
            label={`Product media ${index + 1}`}
            value={item.url}
            onChange={(next) => {
              const nextValue = [...value];
              nextValue[index] = { ...nextValue[index], url: next };
              onChange(nextValue);
            }}
            folder="products"
            accept="image/*,video/*"
            helperText="Drop product imagery here. Cloudinary stores the asset and we save the URL."
          />
          <div className="grid gap-3 md:grid-cols-[1fr_140px_120px_110px_auto]">
            <input
              value={item.alt}
              onChange={(event) => {
                const next = [...value];
                next[index] = { ...next[index], alt: event.target.value };
                onChange(next);
              }}
              placeholder="Alt text"
              className="rounded-xl border border-[#d8c5b0] bg-white px-4 py-3 text-sm outline-none"
            />
            <select
              value={item.type}
              onChange={(event) => {
                const next = [...value];
                next[index] = { ...next[index], type: event.target.value as ImageItem["type"] };
                onChange(next);
              }}
              className="rounded-xl border border-[#d8c5b0] bg-white px-4 py-3 text-sm outline-none"
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
            <input
              value={item.sortOrder}
              onChange={(event) => {
                const next = [...value];
                next[index] = { ...next[index], sortOrder: event.target.value };
                onChange(next);
              }}
              type="number"
              min={0}
              placeholder="Order"
              className="rounded-xl border border-[#d8c5b0] bg-white px-4 py-3 text-sm outline-none"
            />
            <label className="flex items-center gap-2 rounded-xl border border-[#d8c5b0] bg-white px-4 py-3 text-sm text-[#49382d]">
              <input
                type="checkbox"
                checked={item.isPrimary}
                onChange={(event) => {
                  const next = value.map((row, rowIndex) => ({
                    ...row,
                    isPrimary: rowIndex === index ? event.target.checked : false,
                  }));
                  onChange(next);
                }}
              />
              Primary
            </label>
            <button
              type="button"
              onClick={() => onChange(value.filter((_, rowIndex) => rowIndex !== index))}
              className="rounded-md border border-[#d8c5b0] bg-white px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#7a4f2f]"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...value, createEmptyImage()])}
        className="w-fit rounded-md border border-dashed border-[#cdb69d] bg-[#fffaf5] px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#7a4f2f]"
      >
        Add Image
      </button>
    </div>
  );
}

function ListEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
}) {
  return (
    <div className="grid gap-3">
      {value.map((item, index) => (
        <div key={`${placeholder}-${index}`} className="flex gap-3">
          <input
            value={item}
            onChange={(event) => {
              const next = [...value];
              next[index] = event.target.value;
              onChange(next);
            }}
            placeholder={placeholder}
            className="min-w-0 flex-1 rounded-xl border border-[#d8c5b0] bg-[#fcf8f2] px-4 py-3 text-sm outline-none"
          />
          <button
            type="button"
            onClick={() => onChange(value.filter((_, rowIndex) => rowIndex !== index))}
            className="rounded-md border border-[#d8c5b0] bg-white px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#7a4f2f]"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...value, ""])}
        className="w-fit rounded-md border border-dashed border-[#cdb69d] bg-[#fffaf5] px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#7a4f2f]"
      >
        Add Item
      </button>
    </div>
  );
}

function SpecEditor({
  value,
  onChange,
}: {
  value: SpecItem[];
  onChange: (next: SpecItem[]) => void;
}) {
  return (
    <div className="grid gap-3">
      {value.map((item, index) => (
        <div key={`spec-${index}`} className="grid gap-3 md:grid-cols-[1fr_1.3fr_auto]">
          <input
            value={item.label}
            onChange={(event) => {
              const next = [...value];
              next[index] = { ...next[index], label: event.target.value };
              onChange(next);
            }}
            placeholder="Label"
            className="rounded-xl border border-[#d8c5b0] bg-[#fcf8f2] px-4 py-3 text-sm outline-none"
          />
          <input
            value={item.value}
            onChange={(event) => {
              const next = [...value];
              next[index] = { ...next[index], value: event.target.value };
              onChange(next);
            }}
            placeholder="Value"
            className="rounded-xl border border-[#d8c5b0] bg-[#fcf8f2] px-4 py-3 text-sm outline-none"
          />
          <button
            type="button"
            onClick={() => onChange(value.filter((_, rowIndex) => rowIndex !== index))}
            className="rounded-md border border-[#d8c5b0] bg-white px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#7a4f2f]"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...value, createEmptySpec()])}
        className="w-fit rounded-md border border-dashed border-[#cdb69d] bg-[#fffaf5] px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#7a4f2f]"
      >
        Add Measurement / Spec
      </button>
    </div>
  );
}

export function ProductForm({
  mode,
  productId,
  initialValues,
  categories,
  collections,
}: {
  mode: "create" | "edit";
  productId?: string;
  initialValues?: ProductFormValue;
  categories: Option[];
  collections: Option[];
}) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: initialValues?.name ?? "",
    slug: initialValues?.slug ?? "",
    sku: initialValues?.sku ?? "",
    description: initialValues?.description ?? "",
    shortDescription: initialValues?.shortDescription ?? "",
    categoryId: initialValues?.categoryId ?? "",
    collectionId: initialValues?.collectionId ?? "",
    brand: initialValues?.brand ?? "Divya & Design",
    color: initialValues?.color ?? "",
    fabric: initialValues?.fabric ?? "",
    occasion: initialValues?.occasion ?? "",
    careInstructions: initialValues?.careInstructions ?? "",
    pattern: initialValues?.pattern ?? "",
    material: initialValues?.material ?? "",
    fit: initialValues?.fit ?? "",
    status: initialValues?.status ?? "draft",
    visibility: initialValues?.visibility ?? "public",
    mrp: String(initialValues?.mrp ?? 0),
    sellingPrice: String(initialValues?.sellingPrice ?? 0),
    discountPercent: String(initialValues?.discountPercent ?? 0),
    stock: String(initialValues?.stock ?? 0),
    tags: initialValues?.tags ?? "",
    customizationEnabled: Boolean(initialValues?.customizationEnabled),
    measurementsEnabled: Boolean(initialValues?.measurementsEnabled),
    highlights: initialValues?.highlights?.length ? initialValues.highlights : [""],
    images: initialValues?.images?.length
      ? initialValues.images.map((image, index) => ({
          url: image.url ?? "",
          alt: image.alt ?? "",
          type: image.type ?? "image",
          isPrimary: Boolean(image.isPrimary) || index === 0,
          sortOrder: String(image.sortOrder ?? index),
        }))
      : [createEmptyImage()],
    specifications: initialValues?.specifications?.length
      ? initialValues.specifications.map((spec) => ({
          label: spec.label ?? "",
          value: spec.value ?? "",
        }))
      : [createEmptySpec()],
  });

  function updateField(key: keyof typeof form, value: string | boolean) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const images = form.images
      .filter((image) => image.url.trim())
      .map((image, index) => ({
        url: image.url.trim(),
        alt: image.alt.trim() || undefined,
        type: image.type,
        isPrimary: image.isPrimary || index === 0,
        sortOrder: Number(image.sortOrder) || index,
      }));

    const highlights = form.highlights.map((item) => item.trim()).filter(Boolean);
    const specifications = form.specifications
      .filter((item) => item.label.trim() || item.value.trim())
      .map((item) => ({
        label: item.label.trim(),
        value: item.value.trim(),
      }));

    const payload = {
      name: form.name,
      slug: form.slug,
      sku: form.sku,
      description: form.description,
      shortDescription: form.shortDescription,
      categoryId: form.categoryId || undefined,
      collectionId: form.collectionId || undefined,
      brand: form.brand,
      color: form.color,
      fabric: form.fabric,
      occasion: form.occasion,
      careInstructions: form.careInstructions,
      pattern: form.pattern,
      material: form.material,
      fit: form.fit,
      status: form.status,
      visibility: form.visibility,
      taxPercentage: 0,
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      highlights,
      specifications,
      images,
      pricing: {
        mrp: Number(form.mrp),
        sellingPrice: Number(form.sellingPrice),
        discountPercent: Number(form.discountPercent),
      },
      inventory: {
        trackInventory: true,
        stock: Number(form.stock),
        lowStockAlert: 5,
        unlimitedStock: false,
        backorder: false,
      },
      customization: {
        enabled: form.customizationEnabled,
        neckStyles: [],
        sleeves: [],
        fabrics: [],
        lining: [],
        embroidery: [],
        lengths: [],
        dupatta: [],
        bottomStyles: [],
        extraWork: [],
        personalNotes: true,
        uploadInspirationImages: true,
        measurements: form.measurementsEnabled,
        additionalCharges: 0,
        livePriceUpdate: false,
      },
    };

    const response = await fetch(
      mode === "create" ? "/api/admin/products" : `/api/admin/products/${productId}`,
      {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      setStatus("error");
      setMessage(data?.message ?? "Unable to save product.");
      return;
    }

    setStatus("success");
    router.push("/admin/products");
    router.refresh();
  }

  const inputClass =
    "rounded-xl border border-[#d8c5b0] bg-[#fcf8f2] px-4 py-3 text-sm outline-none";

  return (
    <form onSubmit={onSubmit} className="grid gap-6">
      <section className="grid gap-4 rounded-[1.5rem] border border-[#eadccc] bg-[#fffaf5] p-4 md:p-5">
        <div>
          <h2 className="text-lg font-semibold text-[#2f2319]">Core details</h2>
          <p className="mt-1 text-sm text-[#6f5d50]">Mobile-friendly, compact inputs for quick admin edits.</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <input className={inputClass} placeholder="Product name" value={form.name} onChange={(e) => updateField("name", e.target.value)} required />
          <input className={inputClass} placeholder="Slug" value={form.slug} onChange={(e) => updateField("slug", e.target.value)} required />
          <input className={inputClass} placeholder="SKU" value={form.sku} onChange={(e) => updateField("sku", e.target.value)} required />
          <input className={inputClass} placeholder="Brand" value={form.brand} onChange={(e) => updateField("brand", e.target.value)} />
          <select className={inputClass} value={form.categoryId} onChange={(e) => updateField("categoryId", e.target.value)}>
            <option value="">Select category</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <select className={inputClass} value={form.collectionId} onChange={(e) => updateField("collectionId", e.target.value)}>
            <option value="">Select collection</option>
            {collections.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <input className={inputClass} placeholder="Color" value={form.color} onChange={(e) => updateField("color", e.target.value)} />
          <input className={inputClass} placeholder="Fabric" value={form.fabric} onChange={(e) => updateField("fabric", e.target.value)} />
          <input className={inputClass} placeholder="Occasion" value={form.occasion} onChange={(e) => updateField("occasion", e.target.value)} />
          <input className={inputClass} placeholder="Pattern" value={form.pattern} onChange={(e) => updateField("pattern", e.target.value)} />
          <input className={inputClass} placeholder="Material" value={form.material} onChange={(e) => updateField("material", e.target.value)} />
          <input className={inputClass} placeholder="Fit" value={form.fit} onChange={(e) => updateField("fit", e.target.value)} />
        </div>
      </section>

      <section className="grid gap-4 rounded-[1.5rem] border border-[#eadccc] bg-[#fffaf5] p-4 md:p-5">
        <div>
          <h2 className="text-lg font-semibold text-[#2f2319]">Pricing and stock</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <input className={inputClass} type="number" min={0} placeholder="MRP" value={form.mrp} onChange={(e) => updateField("mrp", e.target.value)} />
          <input className={inputClass} type="number" min={0} placeholder="Selling price" value={form.sellingPrice} onChange={(e) => updateField("sellingPrice", e.target.value)} />
          <input className={inputClass} type="number" min={0} placeholder="Discount %" value={form.discountPercent} onChange={(e) => updateField("discountPercent", e.target.value)} />
          <input className={inputClass} type="number" min={0} placeholder="Stock" value={form.stock} onChange={(e) => updateField("stock", e.target.value)} />
          <select className={inputClass} value={form.status} onChange={(e) => updateField("status", e.target.value)}>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
          <select className={inputClass} value={form.visibility} onChange={(e) => updateField("visibility", e.target.value)}>
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>
      </section>

      <section className="grid gap-4 rounded-[1.5rem] border border-[#eadccc] bg-[#fffaf5] p-4 md:p-5">
        <div>
          <h2 className="text-lg font-semibold text-[#2f2319]">Descriptions</h2>
        </div>
        <textarea className={inputClass} placeholder="Description" rows={6} value={form.description} onChange={(e) => updateField("description", e.target.value)} required />
        <textarea className={inputClass} placeholder="Short description" rows={3} value={form.shortDescription} onChange={(e) => updateField("shortDescription", e.target.value)} />
        <input className={inputClass} placeholder="Tags comma separated" value={form.tags} onChange={(e) => updateField("tags", e.target.value)} />
        <input className={inputClass} placeholder="Care instructions" value={form.careInstructions} onChange={(e) => updateField("careInstructions", e.target.value)} />
      </section>

      <section className="grid gap-4 rounded-[1.5rem] border border-[#eadccc] bg-[#fffaf5] p-4 md:p-5">
        <div>
          <h2 className="text-lg font-semibold text-[#2f2319]">Highlights</h2>
          <p className="mt-1 text-sm text-[#6f5d50]">Use short selling points for mobile shoppers.</p>
        </div>
        <ListEditor
          value={form.highlights}
          onChange={(next) => setForm((current) => ({ ...current, highlights: next }))}
          placeholder="Highlight"
        />
      </section>

      <section className="grid gap-4 rounded-[1.5rem] border border-[#eadccc] bg-[#fffaf5] p-4 md:p-5">
        <div>
          <h2 className="text-lg font-semibold text-[#2f2319]">Images</h2>
          <p className="mt-1 text-sm text-[#6f5d50]">Add multiple assets and mark the hero image as primary.</p>
        </div>
        <ImageEditor
          value={form.images}
          onChange={(next) => setForm((current) => ({ ...current, images: next }))}
        />
      </section>

      <section className="grid gap-4 rounded-[1.5rem] border border-[#eadccc] bg-[#fffaf5] p-4 md:p-5">
        <div>
          <h2 className="text-lg font-semibold text-[#2f2319]">Measurements and specifications</h2>
          <p className="mt-1 text-sm text-[#6f5d50]">Structured fields for size notes, fit points, and product details.</p>
        </div>
        <SpecEditor
          value={form.specifications}
          onChange={(next) => setForm((current) => ({ ...current, specifications: next }))}
        />
      </section>

      <section className="grid gap-4 rounded-[1.5rem] border border-[#eadccc] bg-[#fffaf5] p-4 md:p-5">
        <div>
          <h2 className="text-lg font-semibold text-[#2f2319]">Customization</h2>
        </div>
        <label className="flex items-center gap-3 text-sm text-[#49382d]">
          <input type="checkbox" checked={form.customizationEnabled} onChange={(e) => updateField("customizationEnabled", e.target.checked)} />
          Customization enabled
        </label>
        <label className="flex items-center gap-3 text-sm text-[#49382d]">
          <input type="checkbox" checked={form.measurementsEnabled} onChange={(e) => updateField("measurementsEnabled", e.target.checked)} />
          Measurements enabled
        </label>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-md bg-[#3b2417] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#533521] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
        >
          {status === "loading" ? "Saving" : mode === "create" ? "Create Product" : "Update Product"}
        </button>
        {message ? <p className="text-sm text-[#8a6b56]">{message}</p> : null}
      </div>
    </form>
  );
}
