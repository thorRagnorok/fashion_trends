export type ShoppingPlatform =
  | "myntra"
  | "ajio"
  | "amazon"
  | "flipkart"
  | "other";

export type ProductTag = "trending" | "new_arrival" | "editors_pick";

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  image_url: string;
  affiliate_url: string;
  platform: ShoppingPlatform;
  tag: ProductTag | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductImage = {
  id: string;
  product_id: string;
  image_url: string;
  sort_order: number;
  created_at: string;
};

export type ProductWithImages = Product & {
  product_images: ProductImage[];
};

export type ProductClick = {
  id: string;
  product_id: string;
  clicked_at: string;
};

export type AnalyticsSummary = {
  publishedCount: number;
  totalClicks: number;
  topProducts: { id: string; name: string; brand: string; clicks: number }[];
  clicksByPlatform: { platform: ShoppingPlatform; clicks: number }[];
  dailyClicks: { date: string; clicks: number }[];
  monthlyClicks: { month: string; clicks: number }[];
};