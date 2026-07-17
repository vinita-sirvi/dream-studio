"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CollectionForm({
  mode,
  collectionId,
  initialValues,
}: {
  mode: "create" | "edit";
  collectionId?: string;
  initialValues?: {
    name?: string;
    slug?: string;
    description?: string;
    heroImage?: string;
    featured?: boolean;
    status?: string;
  };
}) {
  const router = useRouter();
  const [statusState, setStatusState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: initialValues?.name ?? "",
    slug: initialValues?.slug ?? "",
    description: initialValues?.description ?? "",
    heroImage: initialValues?.heroImage ?? "",
    featured: Boolean(initialValues?.featured),
    status: initialValues?.status ?? "draft",
    productIds: "",
  });

  function updateField(key: keyof typeof form, value: string | boolean) {
    setForm((current) => ({ ...current, [key]: value } as typeof current));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusState("loading");
    setMessage("");

    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description,
      heroImage: form.heroImage || undefined,
      featured: form.featured,
      status: form.status,
      productIds: form.productIds
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      seo: { keywords: [] },
    };

    const response = await fetch(
      mode === "create" ? "/api/admin/collections" : `/api/admin/collections/${collectionId}`,
      {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setStatusState("error");
      setMessage(data?.message ?? "Unable to save collection.");
      return;
    }

    router.push("/admin/collections");
    router.refresh();
  }

  const inputClass =
    "rounded-xl border border-[#d8c5b0] bg-[#fcf8f2] px-4 py-3 text-sm outline-none";

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <input className={inputClass} placeholder="Collection name" value={form.name} onChange={(e) => updateField("name", e.target.value)} required />
        <input className={inputClass} placeholder="Slug" value={form.slug} onChange={(e) => updateField("slug", e.target.value)} required />
      </div>
      <textarea className={inputClass} placeholder="Description" rows={5} value={form.description} onChange={(e) => updateField("description", e.target.value)} />
      <input className={inputClass} placeholder="Hero image URL" value={form.heroImage} onChange={(e) => updateField("heroImage", e.target.value)} />
      <div className="grid gap-4 md:grid-cols-2">
        <select className={inputClass} value={form.status} onChange={(e) => updateField("status", e.target.value)}>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="scheduled">Scheduled</option>
          <option value="expired">Expired</option>
        </select>
        <input className={inputClass} placeholder="Product IDs comma separated" value={form.productIds} onChange={(e) => updateField("productIds", e.target.value)} />
      </div>
      <label className="flex items-center gap-3 text-sm text-[#49382d]">
        <input type="checkbox" checked={form.featured} onChange={(e) => updateField("featured", e.target.checked)} />
        Featured collection
      </label>
      <button type="submit" disabled={statusState === "loading"} className="w-fit rounded-md bg-[#3b2417] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#533521] disabled:cursor-not-allowed disabled:opacity-70">
        {mode === "create" ? "Create Collection" : "Update Collection"}
      </button>
      {message ? <p className="text-sm text-[#8a6b56]">{message}</p> : null}
    </form>
  );
}
