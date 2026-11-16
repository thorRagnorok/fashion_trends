type Props = {
  productId: string;
  className?: string;
  label?: string;
};

/**
 * Plain anchor — not next/link — so Next.js never prefetches GET /api/go/:id
 * (prefetch was creating spurious product_clicks rows on homepage scroll/hover).
 */
export function ShopNowButton({
  productId,
  className = "",
  label = "Shop Now",
}: Props) {
  return (
    <a
      href={`/api/go/${productId}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center bg-stone-900 px-6 py-3 text-sm font-medium tracking-wide text-white transition-all duration-300 hover:bg-stone-800 active:scale-[0.98] ${className}`}
    >
      {label}
    </a>
  );
}