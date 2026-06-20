'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';
import { authApi } from '@/services/api';
import { ChefHat, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardSidebar from '@/components/DashboardSidebar';
import { useStats } from '@/hooks/useStats';
import StatsCard from '@/components/StatsCard';
import { DollarSign, ShoppingBag, TrendingUp, Clock } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.login({ username, password });
      setAuth(res.token, res.user);
      toast.success('Welcome back!');
      router.refresh();
    } catch {
      toast.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <ChefHat className="w-10 h-10 text-brand-500 mx-auto mb-3" />
          <h1 className="font-display text-3xl font-bold">Restaurant Login</h1>
          <p className="text-neutral-400 text-sm mt-2">
            Sign in to manage your restaurant
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <div>
            <label className="block text-sm text-neutral-400 mb-1.5">
              Username
            </label>
            <input
              className="input"
              placeholder="your@email.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                className="input pr-10"
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

function DashboardOverview() {
  const { data: stats, isLoading } = useStats();

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 p-8">
        <h1 className="font-display text-3xl font-bold mb-8">Overview</h1>

        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card p-5 h-24 animate-pulse" />
            ))}
          </div>
        ) : stats ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatsCard
                label="Total Revenue"
                value={`$${parseFloat(stats.total_revenue).toFixed(0)}`}
                icon={<DollarSign className="w-5 h-5" />}
                sub="All time"
                accent="green"
              />
              <StatsCard
                label="Today's Revenue"
                value={`$${parseFloat(stats.revenue_today).toFixed(0)}`}
                icon={<TrendingUp className="w-5 h-5" />}
                sub="Last 24h"
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Items */}
              <div className="card p-6">
                <h2 className="font-semibold text-white mb-4">Top Selling Items</h2>
                <ul className="space-y-3">
                  {stats.top_items.slice(0, 5).map((item, i) => (
                    <li key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-brand-500/10 text-brand-400 text-xs font-bold flex items-center justify-center">
                          {i + 1}
                        </span>
                        <span className="text-sm text-white">{item.menu_item__name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-brand-400">
                          ${parseFloat(item.total_revenue).toFixed(0)}
                        </p>
                        <p className="text-xs text-neutral-500">{item.total_quantity} sold</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Orders by Status */}
              <div className="card p-6">
                <h2 className="font-semibold text-white mb-4">Orders by Status</h2>
                <ul className="space-y-3">
                  {stats.orders_by_status.map((s) => (
                    <li key={s.status} className="flex items-center justify-between">
                      <span className="text-sm capitalize text-neutral-300">{s.status}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 rounded-full bg-surface-border overflow-hidden">
                          <div
                            className="h-full bg-brand-500 rounded-full"
                            style={{
                              width: `${Math.min((s.count / stats.total_orders) * 100, 100)}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-white w-6 text-right">
                          {s.count}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        ) : (
          <p className="text-neutral-400">No statistics yet.</p>
        )}
      </main>
    </div>
  );
}

export default function DashboardPage() {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated() ? <DashboardOverview /> : <LoginForm />;
}
