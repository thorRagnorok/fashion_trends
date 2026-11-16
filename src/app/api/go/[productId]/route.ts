import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

type RouteContext = { params: Promise<{ productId: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { productId } = await context.params;

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const supabase = await createClient();
  const { data: product, error } = await supabase
    .from("products")
    .select("id, affiliate_url, is_published")
    .eq("id", productId)
    .eq("is_published", true)
    .single();

  if (error || !product?.affiliate_url) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  try {
    const admin = createAdminClient();
    await admin.from("product_clicks").insert({ product_id: productId });
  } catch (e) {
    console.error("click track", e);
  }

  return NextResponse.redirect(product.affiliate_url, { status: 302 });
}