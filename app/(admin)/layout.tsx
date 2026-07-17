import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { getCurrentSession, isAdminRole } from "@/lib/session";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();
  if (!isAdminRole(session?.user.role)) {
    redirect("/login?next=/admin");
  }

  return <AdminShell>{children}</AdminShell>;
}
