import Link from "next/link";

type Props = {
  productId: string;
  className?: string;
  label?: string;
};

export function ShopNowButton({
  productId,
  className = "",
  label = "Shop Now",
}: Props) {
  return (
    <Link
      href={`/api/go/${productId}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center bg-stone-900 px-6 py-3 text-sm font-medium tracking-wide text-white transition-all duration-300 hover:bg-stone-800 active:scale-[0.98] ${className}`}
    >
      {label}
    </Link>
  );
}