import { Suspense } from "react";
import Link from "next/link";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { SITE_NAME } from "@/lib/constants";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-100 px-4">
      <p className="font-display text-xl font-semibold tracking-wide text-stone-900">
        {SITE_NAME}
      </p>
      <p className="mt-1 mb-8 text-sm text-stone-500">Admin sign in</p>
      <Suspense fallback={<p className="text-sm text-stone-500">Loading…</p>}>
        <AdminLoginForm />
      </Suspense>
      <Link href="/" className="mt-8 text-sm text-stone-500 hover:text-stone-800">
        ← Back to site
      </Link>
    </div>
  );
}