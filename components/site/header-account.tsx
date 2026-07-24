"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function HeaderAccount({ user }: { user: { name: string } | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
  }

  if (!user) {
    return <Link href="/login" className="rounded-md bg-[#3b2417] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white">Sign In</Link>;
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/account" className="max-w-[9rem] truncate text-sm font-medium text-[#3b2417]" title={user.name}>
        {user.name}
      </Link>
      <button type="button" onClick={logout} disabled={loading} className="text-xs text-[#8a6b56] hover:text-[#3b2417]">
        {loading ? "Signing out" : "Sign out"}
      </button>
    </div>
  );
}
