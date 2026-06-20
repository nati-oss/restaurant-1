'use client';

import { useStats } from '@/hooks/useStats';
import DashboardSidebar from '@/components/DashboardSidebar';
import StatsCard from '@/components/StatsCard';
import { DollarSign, ShoppingBag, TrendingUp, Clock, Trophy } from 'lucide-react';

export default function StatisticsPage() {
  const { data: stats, isLoading } = useStats();

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 p-8">
        <h1 className="font-display text-3xl font-bold mb-8">Statistics</h1>

        {isLoading ? (
          <p className="text-neutral-400">Loading…</p>
        ) : !stats ? (
          <p className="text-neutral-400">No statistics available yet.</p>
        ) : (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatsCard
                label="Total Revenue"
                value={`$${parseFloat(stats.total_revenue).toFixed(2)}`}
                icon={<DollarSign className="w-5 h-5" />}
                accent="green"
                sub="All time"
              />
              <StatsCard
                label="Today's Revenue"
                value={`$${parseFloat(stats.revenue_today).toFixed(2)}`}
                icon={<TrendingUp className="w-5 h-5" />}
                accent="orange"
              />
              <StatsCard
                label="Total Orders"
                value={stats.total_orders}
                icon={<ShoppingBag className="w-5 h-5" />}
                accent="blue"
              />
              <StatsCard
                label="Orders Today"
                value={stats.orders_today}
                icon={<Clock className="w-5 h-5" />}
                accent="purple"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Top Items */}
              <div className="card p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Trophy className="w-5 h-5 text-brand-400" />
                  <h2 className="font-semibold text-white">Top Selling Items</h2>
                </div>
                {stats.top_items.length === 0 ? (
                  <p className="text-neutral-500 text-sm">No data yet.</p>
                ) : (
                  <ul className="space-y-4">
                    {stats.top_items.map((item, i) => {
                      const maxRevenue = parseFloat(stats.top_items[0].total_revenue);
                      const pct = (parseFloat(item.total_revenue) / maxRevenue) * 100;
                      return (
                        <li key={i}>
                          <div className="flex justify-between text-sm mb-1.5">
                            <span className="text-white font-medium">
                              {i + 1}. {item.menu_item__name}
                            </span>
                            <span className="text-brand-400 font-semibold">
                              ${parseFloat(item.total_revenue).toFixed(0)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 rounded-full bg-surface-border overflow-hidden">
                              <div
                                className="h-full bg-brand-500 rounded-full transition-all duration-700"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-xs text-neutral-500 w-16 text-right">
                              {item.total_quantity} sold
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {/* Revenue by Day */}
              <div className="card p-6">
                <h2 className="font-semibold text-white mb-5">Revenue — Last 7 Days</h2>
                {stats.revenue_by_day.length === 0 ? (
                  <p className="text-neutral-500 text-sm">No data yet.</p>
                ) : (
                  <div className="space-y-3">
                    {stats.revenue_by_day.slice(-7).map((d) => {
                      const maxRev = Math.max(
                        ...stats.revenue_by_day.map((x) => parseFloat(x.revenue))
                      );
                      const pct =
                        maxRev > 0
                          ? (parseFloat(d.revenue) / maxRev) * 100
                          : 0;
                      const date = new Date(d.date).toLocaleDateString('en', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      });
                      return (
                        <div key={d.date} className="flex items-center gap-3">
                          <span className="text-xs text-neutral-500 w-24 flex-shrink-0">
                            {date}
                          </span>
                          <div className="flex-1 h-6 rounded-lg bg-surface-border overflow-hidden">
                            <div
                              className="h-full bg-brand-500/70 rounded-lg flex items-center px-2 transition-all duration-700"
                              style={{ width: `${Math.max(pct, 4)}%` }}
                            >
                              <span className="text-xs font-semibold text-white whitespace-nowrap">
                                ${parseFloat(d.revenue).toFixed(0)}
                              </span>
                            </div>
                          </div>
                          <span className="text-xs text-neutral-500 w-12 text-right">
                            {d.orders} orders
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Status breakdown */}
            <div className="card p-6">
              <h2 className="font-semibold text-white mb-5">Order Status Breakdown</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {stats.orders_by_status.map((s) => (
                  <div key={s.status} className="text-center">
                    <p className="text-3xl font-display font-bold text-white">{s.count}</p>
                    <p className="text-xs text-neutral-400 capitalize mt-1">{s.status}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
