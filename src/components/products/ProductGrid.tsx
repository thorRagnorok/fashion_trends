import { ProductCard } from "@/components/products/ProductCard";
import type { Product } from "@/lib/types";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="rounded-sm border border-dashed border-stone-300 bg-white px-8 py-20 text-center">
        <p className="font-display text-xl text-stone-800">Nothing trending yet</p>
        <p className="mt-2 text-sm text-stone-500">
          New picks land here first — check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}