import type { Product, ProductWithImages } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

const PRODUCT_SELECT =
  "id, name, brand, category, description, image_url, affiliate_url, platform, tag, is_published, created_at, updated_at";

export async function getPublishedProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getPublishedProducts", error);
    return [];
  }
  return (data ?? []) as Product[];
}

export async function getProductById(
  id: string,
  options?: { admin?: boolean },
): Promise<ProductWithImages | null> {
  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select(`${PRODUCT_SELECT}, product_images(id, product_id, image_url, sort_order, created_at)`)
    .eq("id", id);

  if (!options?.admin) {
    query = query.eq("is_published", true);
  }

  const { data, error } = await query.single();

  if (error || !data) {
    return null;
  }

  const row = data as ProductWithImages & {
    product_images: ProductWithImages["product_images"];
  };
  row.product_images = (row.product_images ?? []).sort(
    (a, b) => a.sort_order - b.sort_order,
  );
  return row;
}

export async function getAllProductsAdmin(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAllProductsAdmin", error);
    return [];
  }
  return (data ?? []) as Product[];
}