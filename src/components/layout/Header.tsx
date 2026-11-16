import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-[#faf9f7]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-[0.2em] text-stone-900 transition-opacity hover:opacity-70"
        >
          {SITE_NAME}
        </Link>
        <nav aria-label="Main">
          <Link
            href="/#trending"
            className="text-sm font-medium tracking-wide text-stone-600 transition-colors hover:text-stone-900"
          >
            Trending
          </Link>
        </nav>
      </div>
    </header>
  );
}