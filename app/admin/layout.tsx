import type { ReactNode } from "react";
import { AdminOpsProvider } from "../components/admin/AdminOpsProvider";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <AdminOpsProvider>
      <AdminShell>{children}</AdminShell>
    </AdminOpsProvider>
  );
}
