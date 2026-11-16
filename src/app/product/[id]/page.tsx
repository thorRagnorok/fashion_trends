export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { ProductTagBadge } from "@/components/products/ProductTagBadge";
import { ShopNowButton } from "@/components/products/ShopNowButton";
import { PLATFORM_LABELS } from "@/lib/constants";
import { getProductById } from "@/lib/products";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return { title: "Product" };
  return {
    title: product.name,
    description: product.description.slice(0, 160),
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  const gallery = product.product_images ?? [];

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/#trending"
          className="text-sm text-stone-500 transition-colors hover:text-stone-900"
        >
          ← Back to Trending
        </Link>

        <section className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-4">
            <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-stone-100">
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            {gallery.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {gallery.map((img) => (
                  <div
                    key={img.id}
                    className="relative aspect-square overflow-hidden rounded-sm bg-stone-100"
                  >
                    <Image
                      src={img.image_url}
                      alt=""
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-3">
              {product.tag ? <ProductTagBadge tag={product.tag} /> : null}
              <span className="text-xs uppercase tracking-widest text-stone-500">
                {product.category}
              </span>
            </div>
            <p className="mt-4 text-sm font-medium uppercase tracking-[0.2em] text-stone-500">
              {product.brand}
            </p>
            <h1 className="font-display mt-2 text-3xl font-semibold text-stone-900 sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-6 text-base leading-relaxed text-stone-600 whitespace-pre-wrap">
              {product.description}
            </p>
            <p className="mt-8 text-sm text-stone-500">
              Shop on{" "}
              <span className="font-medium text-stone-800">
                {PLATFORM_LABELS[product.platform]}
              </span>
            </p>
            <div className="mt-8">
              <ShopNowButton productId={product.id} className="rounded-sm px-10" />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}