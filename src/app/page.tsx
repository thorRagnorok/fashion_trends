export const dynamic = "force-dynamic";

import { Header } from "@/components/layout/Header";
import { ProductGrid } from "@/components/products/ProductGrid";
import { SetupNotice } from "@/components/products/SetupNotice";
import { getPublishedProducts } from "@/lib/products";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default async function HomePage() {
  const configured = isSupabaseConfigured();
  const products = configured ? await getPublishedProducts() : [];

  return (
    <>
      <Header />
      <main className="flex-1">
        <section
          id="trending"
          className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
        >
          <header className="mb-10 max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-stone-500">
              Curated for you
            </p>
            <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
              Trending
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-stone-600">
              The latest men&apos;s style drops — newest picks appear first.
            </p>
          </header>
          {!configured ? (
            <div className="mb-10">
              <SetupNotice />
            </div>
          ) : null}
          <ProductGrid products={products} />
        </section>
      </main>
      <footer className="border-t border-stone-200/80 py-8 text-center text-xs text-stone-500">
        Affiliate discovery — purchases are completed on partner stores.
      </footer>
    </>
  );
}