import Link from "next/link";
import { notFound } from "next/navigation";

import { CollectionForm } from "@/components/admin/collection-form";
import { Collection } from "@/lib/models";
import { connectToDatabase } from "@/lib/mongodb";
import { ensureSeedData } from "@/lib/seed";

export const dynamic = "force-dynamic";

export default async function EditCollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await ensureSeedData();
  await connectToDatabase();
  const collection = await Collection.findById(id).lean();

  if (!collection) {
    notFound();
  }

  return (
    <main className="grid gap-6">
      <section className="rounded-[2rem] border border-[#dce4e3] bg-white/85 p-8 shadow-[0_18px_42px_rgba(15,30,30,0.08)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#b23a17]">Admin / Collections / Edit</p>
            <h1 className="mt-3 text-4xl font-medium text-[#0f1e1e]" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
              Edit collection
            </h1>
          </div>
          <Link href="/admin/collections" className="rounded-md border border-[#c3cfce] bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#0b1717]">
            Back
          </Link>
        </div>
      </section>
      <section className="rounded-[1.8rem] border border-[#dce4e3] bg-white/85 p-8 shadow-[0_16px_34px_rgba(15,30,30,0.08)]">
        <CollectionForm
          mode="edit"
          collectionId={id}
          initialValues={{
            name: collection.name,
            slug: collection.slug,
            description: collection.description,
            heroImage: collection.heroImage,
            featured: collection.featured,
            status: collection.status,
          }}
        />
      </section>
    </main>
  );
}
