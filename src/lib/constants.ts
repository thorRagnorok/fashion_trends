import type { ProductTag, ShoppingPlatform } from "@/lib/types";

export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "THE DROP";

export const PRODUCT_CATEGORIES = [
  "T-Shirts",
  "Shirts",
  "Hoodies & Sweatshirts",
  "Jackets & Coats",
  "Jeans",
  "Trousers",
  "Shorts",
  "Sneakers",
  "Footwear",
  "Accessories",
  "Watches",
  "Bags",
  "Ethnic Wear",
  "Activewear",
  "Innerwear",
] as const;

export const SHOPPING_PLATFORMS: {
  value: ShoppingPlatform;
  label: string;
}[] = [
  { value: "myntra", label: "Myntra" },
  { value: "ajio", label: "AJIO" },
  { value: "amazon", label: "Amazon" },
  { value: "flipkart", label: "Flipkart" },
  { value: "other", label: "Other" },
];

export const PRODUCT_TAGS: { value: ProductTag; label: string }[] = [
  { value: "trending", label: "Trending" },
  { value: "new_arrival", label: "New Arrival" },
  { value: "editors_pick", label: "Editor's Pick" },
];

export const PLATFORM_LABELS: Record<ShoppingPlatform, string> = {
  myntra: "Myntra",
  ajio: "AJIO",
  amazon: "Amazon",
  flipkart: "Flipkart",
  other: "Other",
};

export const TAG_LABELS: Record<ProductTag, string> = {
  trending: "Trending",
  new_arrival: "New Arrival",
  editors_pick: "Editor's Pick",
};

export const STORAGE_BUCKET = "product-images";