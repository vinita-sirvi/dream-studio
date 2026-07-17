"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CategoryForm({
  mode,
  categoryId,
  initialValues,
  parentOptions,
}: {
  mode: "create" | "edit";
  categoryId?: string;
  initialValues?: {
    name?: string;
    slug?: string;
    description?: string;
    parentId?: string;
    image?: string;
    sortOrder?: number;
    featured?: boolean;
    hidden?: boolean;
  };
  parentOptions: Array<{ id: string; name: string }>;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: initialValues?.name ?? "",
    slug: initialValues?.slug ?? "",
    description: initialValues?.description ?? "",
    parentId: initialValues?.parentId ?? "",
    image: initialValues?.image ?? "",
    sortOrder: String(initialValues?.sortOrder ?? 0),
    featured: Boolean(initialValues?.featured),
    hidden: Boolean(initialValues?.hidden),
  });

  function updateField(key: keyof typeof form, value: string | boolean) {
    setForm((current) => ({ ...current, [key]: value } as typeof current));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description,
      parentId: form.parentId || undefined,
      image: form.image || undefined,
      sortOrder: Number(form.sortOrder),
      featured: form.featured,
      hidden: form.hidden,
      seo: { keywords: [] },
    };

    const response = await fetch(
      mode === "create" ? "/api/admin/categories" : `/api/admin/categories/${categoryId}`,
      {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setStatus("error");
      setMessage(data?.message ?? "Unable to save category.");
      return;
    }

    router.push("/admin/categories");
    router.refresh();
  }

  const inputClass =
    "rounded-xl border border-[#d8c5b0] bg-[#fcf8f2] px-4 py-3 text-sm outline-none";

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <input className={inputClass} placeholder="Category name" value={form.name} onChange={(e) => updateField("name", e.target.value)} required />
        <input className={inputClass} placeholder="Slug" value={form.slug} onChange={(e) => updateField("slug", e.target.value)} required />
      </div>
      <textarea className={inputClass} placeholder="Description" rows={5} value={form.description} onChange={(e) => updateField("description", e.target.value)} />
      <div className="grid gap-4 md:grid-cols-2">
        <select className={inputClass} value={form.parentId} onChange={(e) => updateField("parentId", e.target.value)}>
          <option value="">No parent</option>
          {parentOptions.map((option) => (
            <option key={option.id} value={option.id}>{option.name}</option>
          ))}
        </select>
        <input className={inputClass} placeholder="Image URL" value={form.image} onChange={(e) => updateField("image", e.target.value)} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <input className={inputClass} type="number" min={0} placeholder="Sort order" value={form.sortOrder} onChange={(e) => updateField("sortOrder", e.target.value)} />
        <div className="flex flex-wrap gap-6 rounded-xl border border-[#d8c5b0] bg-[#fcf8f2] px-4 py-3 text-sm text-[#49382d]">
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={(e) => updateField("featured", e.target.checked)} /> Featured</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.hidden} onChange={(e) => updateField("hidden", e.target.checked)} /> Hidden</label>
        </div>
      </div>
      <button type="submit" disabled={status === "loading"} className="w-fit rounded-md bg-[#3b2417] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#533521] disabled:cursor-not-allowed disabled:opacity-70">
        {mode === "create" ? "Create Category" : "Update Category"}
      </button>
      {message ? <p className="text-sm text-[#8a6b56]">{message}</p> : null}
    </form>
  );
}
