"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin/products", label: "Products" },
  { href: "/admin/products/new", label: "Add product" },
  { href: "/admin/analytics", label: "Analytics" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
  <nav className="flex flex-wrap gap-2 border-b border-stone-200 pb-4">
      {links.map((link) => {
        const active =
          pathname === link.href ||
          (link.href === "/admin/products" &&
            pathname.startsWith("/admin/products/") &&
            pathname !== "/admin/products/new");
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-sm px-3 py-1.5 text-sm font-medium transition-colors ${
              active
                ? "bg-stone-900 text-white"
                : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}