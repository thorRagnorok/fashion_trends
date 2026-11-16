import type { AnalyticsSummary, Product, ShoppingPlatform } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const supabase = await createClient();

  const [{ count: publishedCount }, { data: clicks, error: clicksError }] =
    await Promise.all([
      supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("is_published", true),
      supabase.from("product_clicks").select("id, product_id, clicked_at"),
    ]);

  if (clicksError) {
    console.error("getAnalyticsSummary clicks", clicksError);
  }

  const clickRows = clicks ?? [];
  const totalClicks = clickRows.length;

  const { data: products } = await supabase
    .from("products")
    .select("id, name, brand, platform");

  const productMap = new Map<string, Product>();
  (products ?? []).forEach((p) => {
    productMap.set(p.id, p as Product);
  });

  const countByProduct = new Map<string, number>();
  const countByPlatform = new Map<ShoppingPlatform, number>();
  const countByDay = new Map<string, number>();
  const countByMonth = new Map<string, number>();

  for (const click of clickRows) {
    const pid = click.product_id;
    countByProduct.set(pid, (countByProduct.get(pid) ?? 0) + 1);

    const product = productMap.get(pid);
    if (product) {
      const plat = product.platform as ShoppingPlatform;
      countByPlatform.set(plat, (countByPlatform.get(plat) ?? 0) + 1);
    }

    const d = new Date(click.clicked_at);
    const dayKey = d.toISOString().slice(0, 10);
    const monthKey = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    countByDay.set(dayKey, (countByDay.get(dayKey) ?? 0) + 1);
    countByMonth.set(monthKey, (countByMonth.get(monthKey) ?? 0) + 1);
  }

  const topProducts = [...countByProduct.entries()]
    .map(([id, clicksCount]) => {
      const p = productMap.get(id);
      return {
        id,
        name: p?.name ?? "Unknown",
        brand: p?.brand ?? "",
        clicks: clicksCount,
      };
    })
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 10);

  const clicksByPlatform = [...countByPlatform.entries()]
    .map(([platform, clicksCount]) => ({
      platform,
      clicks: clicksCount,
    }))
    .sort((a, b) => b.clicks - a.clicks);

  const dailyClicks = [...countByDay.entries()]
    .map(([date, clicksCount]) => ({ date, clicks: clicksCount }))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 30);

  const monthlyClicks = [...countByMonth.entries()]
    .map(([month, clicksCount]) => ({ month, clicks: clicksCount }))
    .sort((a, b) => b.month.localeCompare(a.month))
    .slice(0, 12);

  return {
    publishedCount: publishedCount ?? 0,
    totalClicks,
    topProducts,
    clicksByPlatform,
    dailyClicks,
    monthlyClicks,
  };
}