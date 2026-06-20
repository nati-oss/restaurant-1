'use client';

import { useState } from 'react';
import { useOrders } from '@/hooks/useOrders';
import DashboardSidebar from '@/components/DashboardSidebar';
import OrderCard from '@/components/OrderCard';
import { RefreshCw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import type { OrderStatus } from '@/types';
import clsx from 'clsx';

const FILTERS: { label: string; value: string }[] = [
  { label: 'Live', value: 'live' },
  { label: 'Pending', value: 'pending' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Preparing', value: 'preparing' },
  { label: 'Ready', value: 'ready' },
  { label: 'Completed', value: 'completed' },
  { label: 'All', value: '' },
];

const LIVE_STATUSES: OrderStatus[] = ['pending', 'accepted', 'preparing', 'ready'];

export default function DashboardOrdersPage() {
  const [filter, setFilter] = useState('live');
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useOrders(
    filter === 'live' ? undefined : filter ? { status: filter } : undefined
  );

  const displayed =
    filter === 'live'
      ? orders?.filter((o) => LIVE_STATUSES.includes(o.status as OrderStatus))
      : orders;

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['orders'] });

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl font-bold">Orders</h1>
          <button onClick={refresh} className="btn-ghost flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={clsx(
                'flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                filter === f.value
                  ? 'bg-brand-500 text-white'
                  : 'bg-surface-raised text-neutral-400 hover:text-white'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card h-48 animate-pulse" />
            ))}
          </div>
        ) : !displayed?.length ? (
          <div className="text-center py-20 text-neutral-500">
            <p className="text-4xl mb-3">📋</p>
            <p>No orders here yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {displayed.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
