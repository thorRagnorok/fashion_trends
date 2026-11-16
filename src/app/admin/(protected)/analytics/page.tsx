import { getAnalyticsSummary } from "@/lib/analytics";
import { PLATFORM_LABELS } from "@/lib/constants";

export default async function AnalyticsPage() {
  const stats = await getAnalyticsSummary();

  return (
    <div className="space-y-8">
      <h2 className="font-display text-xl font-semibold text-stone-900">Analytics</h2>
      <p className="text-sm text-stone-500">
        Clicks are outbound Shop Now events — not confirmed orders or commissions.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Published products" value={stats.publishedCount} />
        <StatCard label="Total Shop Now clicks" value={stats.totalClicks} />
      </div>

      <section>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-stone-500">
          Most clicked products
        </h3>
        {stats.topProducts.length === 0 ? (
          <p className="text-sm text-stone-500">No clicks recorded yet.</p>
        ) : (
          <ul className="divide-y divide-stone-100 rounded-sm border border-stone-200 bg-white">
            {stats.topProducts.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between px-4 py-3 text-sm"
              >
                <span>
                  <span className="font-medium text-stone-900">{p.name}</span>
                  <span className="text-stone-500"> · {p.brand}</span>
                </span>
                <span className="font-mono text-stone-700">{p.clicks}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-stone-500">
          Clicks by platform
        </h3>
        <ul className="space-y-2">
          {stats.clicksByPlatform.map((row) => (
            <li
              key={row.platform}
              className="flex justify-between rounded-sm border border-stone-200 bg-white px-4 py-2 text-sm"
            >
              <span>{PLATFORM_LABELS[row.platform]}</span>
              <span className="font-mono">{row.clicks}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <ClickList title="Daily clicks (last 30)" rows={stats.dailyClicks} />
        <ClickList
          title="Monthly clicks"
          rows={stats.monthlyClicks.map((r) => ({ date: r.month, clicks: r.clicks }))}
        />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-sm border border-stone-200 bg-white px-6 py-5">
      <p className="text-xs uppercase tracking-wide text-stone-500">{label}</p>
      <p className="font-display mt-2 text-3xl font-semibold text-stone-900">{value}</p>
    </div>
  );
}

function ClickList({
  title,
  rows,
}: {
  title: string;
  rows: { date: string; clicks: number }[];
}) {
  return (
    <section>
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-stone-500">
        {title}
      </h3>
      {rows.length === 0 ? (
        <p className="text-sm text-stone-500">No data yet.</p>
      ) : (
        <ul className="max-h-64 space-y-1 overflow-y-auto text-sm">
          {rows.map((r) => (
            <li
              key={r.date}
              className="flex justify-between rounded-sm bg-white px-3 py-1.5 ring-1 ring-stone-100"
            >
              <span className="text-stone-600">{r.date}</span>
              <span className="font-mono text-stone-800">{r.clicks}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
