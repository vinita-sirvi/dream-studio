"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminDeleteButton({
  resource,
  id,
  label = "Delete",
}: {
  resource: string;
  id: string;
  label?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onDelete() {
    if (!confirm("Delete this item?")) {
      return;
    }

    setLoading(true);
    const response = await fetch(`/api/admin/${resource}/${id}`, {
      method: "DELETE",
    });
    setLoading(false);

    if (response.ok) {
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={loading}
      className="rounded-md border border-[#e4c7b2] bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#7a4f2f] transition hover:bg-[#faf5ee] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {loading ? "Deleting" : label}
    </button>
  );
}
