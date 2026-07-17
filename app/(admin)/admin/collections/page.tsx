import Link from "next/link";

import { AdminDeleteButton } from "@/components/admin/admin-delete-button";
import { connectToDatabase } from "@/lib/mongodb";
import { ensureSeedData } from "@/lib/seed";
import { Collection } from "@/lib/models";

export const dynamic = "force-dynamic";

export default async function AdminCollectionsPage() {
  await ensureSeedData();
  await connectToDatabase();
  const collections = await Collection.find({}).sort({ createdAt: -1 }).lean();

  return (
    <main className="grid gap-6">
      <section className="rounded-[2rem] border border-[#eadccc] bg-white/85 p-8 shadow-[0_18px_42px_rgba(103,73,47,0.08)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8a6b56]">Admin / Collections</p>
            <h1 className="mt-3 text-4xl font-medium text-[#2f2319]" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
              Collection management
            </h1>
          </div>
          <Link href="/admin/collections/new" className="rounded-md bg-[#3b2417] px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white">
            New Collection
          </Link>
        </div>
      </section>

      <section className="overflow-hidden rounded-[1.8rem] border border-[#eadccc] bg-white/85 shadow-[0_16px_34px_rgba(103,73,47,0.08)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#fbf6ef] text-xs uppercase tracking-[0.18em] text-[#8a6b56]">
            <tr>
              <th className="px-4 py-4">Collection</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {collections.map((collection: any) => (
              <tr key={String(collection._id)} className="border-t border-[#f0e3d6]">
                <td className="px-4 py-4">
                  <div className="font-medium text-[#2f2319]">{collection.name}</div>
                  <div className="text-xs text-[#6f5d50]">{collection.slug}</div>
                </td>
                <td className="px-4 py-4">{collection.status}</td>
                <td className="px-4 py-4 flex gap-2">
                  <Link href={`/admin/collections/${String(collection._id)}`} className="rounded-md border border-[#d8c5b0] bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#3b2417]">
                    Edit
                  </Link>
                  <AdminDeleteButton resource="collections" id={String(collection._id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
