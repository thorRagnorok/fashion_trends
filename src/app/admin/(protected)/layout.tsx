export const dynamic = "force-dynamic";

import { AdminNav } from "@/components/admin/AdminNav";
import { SignOutButton } from "@/components/admin/SignOutButton";
import { SITE_NAME } from "@/lib/constants";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stone-100">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Admin</p>
            <h1 className="font-display text-2xl font-semibold text-stone-900">
              {SITE_NAME}
            </h1>
          </div>
          <SignOutButton />
        </header>
        <AdminNav />
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}