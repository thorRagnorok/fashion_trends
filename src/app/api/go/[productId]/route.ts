import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

type RouteContext = { params: Promise<{ productId: string }> };

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(_request: Request, context: RouteContext) {
  const { productId } = await context.params;

  if (!UUID_RE.test(productId)) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
  }

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
    const { error: insertError } = await admin
      .from("product_clicks")
      .insert({ product_id: productId });

    if (insertError) {
      console.error("click track insert failed", {
        productId,
        code: insertError.code,
        message: insertError.message,
        details: insertError.details,
      });
    }
  } catch (e) {
    console.error("click track unexpected error", { productId, error: e });
  }

  return NextResponse.redirect(product.affiliate_url, { status: 302 });
}