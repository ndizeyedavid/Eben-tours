"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isPrint = pathname?.startsWith("/admin/bookings/print/");

  if (isPrint) {
    return <div className="min-h-screen bg-white">{children}</div>;
  }

  return (
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
  );
}
