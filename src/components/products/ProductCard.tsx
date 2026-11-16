import Image from "next/image";
import Link from "next/link";
import { ProductTagBadge } from "@/components/products/ProductTagBadge";
import { ShopNowButton } from "@/components/products/ShopNowButton";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-sm border border-stone-200/80 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
      <Link
        href={`/product/${product.id}`}
        className="relative aspect-[3/4] overflow-hidden bg-stone-100"
      >
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {product.tag ? (
          <div className="absolute left-3 top-3">
            <ProductTagBadge tag={product.tag} />
          </div>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <Link href={`/product/${product.id}`} className="space-y-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-stone-500">
            {product.brand}
          </p>
          <h3 className="font-display text-lg leading-snug text-stone-900">
            {product.name}
          </h3>
          <p className="text-xs text-stone-500">{product.category}</p>
        </Link>
        <div className="mt-auto pt-2">
          <ShopNowButton productId={product.id} className="w-full rounded-sm" />
        </div>
      </div>
    </article>
  );
}