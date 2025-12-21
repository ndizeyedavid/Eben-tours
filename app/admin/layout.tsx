import type { ReactNode } from "react";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminTopbar from "../components/admin/AdminTopbar";
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
      <div className="min-h-screen bg-[#f6f8f7]">
        <div className="mx-auto min-h-screen">
          <AdminSidebar />
          <div className="min-h-screen lg:pl-[260px]">
            <div className="flex min-w-0 flex-1 flex-col">
              <AdminTopbar />
              <main className="min-w-0 flex-1 p-4 sm:p-6">{children}</main>
            </div>
          </div>
        </div>
      </div>
    </AdminOpsProvider>
  );
}
