'use client';

import { useOrders, useUpdateOrderStatus } from '@/hooks/useOrders';
import { Clock, ChefHat } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import type { Order, OrderStatus } from '@/types';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const KITCHEN_STATUSES: OrderStatus[] = ['accepted', 'preparing', 'ready'];

const COLUMN_CONFIG = {
  accepted: { label: '📥 New', color: 'border-blue-500/30 bg-blue-500/5' },
  preparing: { label: '👨‍🍳 Preparing', color: 'border-orange-500/30 bg-orange-500/5' },
  ready: { label: '✅ Ready', color: 'border-green-500/30 bg-green-500/5' },
};

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  accepted: 'preparing',
  preparing: 'ready',
  ready: 'completed',
};

function KitchenOrderCard({ order }: { order: Order }) {
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();
  const next = NEXT_STATUS[order.status];
  const age = Math.floor(
    (Date.now() - new Date(order.created_at).getTime()) / 60000
  );

  return (
    <div
      className={clsx(
        'rounded-2xl border p-4 space-y-3',
        age > 20 ? 'border-red-500/40 bg-red-500/5' : 'border-surface-border bg-surface-raised'
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-bold text-white text-lg">#{order.id}</p>
          <p className="text-sm text-neutral-400">Table {order.table_number}</p>
        </div>
        <span
          className={clsx(
            'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg',
            age > 20
              ? 'bg-red-500/10 text-red-400'
              : age > 10
              ? 'bg-yellow-500/10 text-yellow-400'
              : 'bg-neutral-800 text-neutral-400'
          )}
        >
          <Clock className="w-3 h-3" />
          {age}m
        </span>
      </div>

      <ul className="space-y-1.5">
        {order.items.map((item) => (
          <li key={item.id} className="flex gap-2 text-sm">
            <span className="font-bold text-brand-400 w-5">{item.quantity}×</span>
            <div>
              <span className="text-white">{item.menu_item_name}</span>
              {item.special_instructions && (
                <p className="text-xs text-neutral-500 mt-0.5">
                  {item.special_instructions}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>

      {order.notes && (
        <p className="text-xs text-neutral-500 bg-surface-DEFAULT rounded-lg px-3 py-2">
          📝 {order.notes}
        </p>
      )}

      {next && (
        <button
          onClick={() =>
            updateStatus(
              { id: order.id, status: next },
              {
                onSuccess: () =>
                  toast.success(
                    `#${order.id} → ${next === 'completed' ? 'Completed' : next}`
                  ),
              }
            )
          }
          disabled={isPending}
          className="btn-primary w-full py-2 text-sm"
        >
          {next === 'preparing'
            ? 'Start Cooking'
            : next === 'ready'
            ? 'Mark Ready'
            : 'Complete'}
        </button>
      )}
    </div>
  );
}

export default function KitchenPage() {
  const { data: orders = [], isLoading } = useOrders();

  const byStatus = (status: OrderStatus) =>
    orders.filter((o) => o.status === status);

  return (
    <div className="min-h-screen bg-surface-DEFAULT">
      {/* Header */}
      <header className="border-b border-surface-border px-6 py-4 flex items-center gap-3">
        <ChefHat className="w-6 h-6 text-brand-500" />
        <h1 className="font-display font-bold text-xl">Kitchen Display</h1>
        <span className="text-xs text-neutral-500 ml-auto">
          Auto-refreshes every 15s
        </span>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-neutral-400">Loading orders…</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-x divide-surface-border min-h-[calc(100vh-73px)]">
          {KITCHEN_STATUSES.map((status) => {
            const config = COLUMN_CONFIG[status];
            const colOrders = byStatus(status);
            return (
              <div key={status} className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-white">{config.label}</h2>
                  <span className="badge bg-surface-raised text-neutral-400 border border-surface-border">
                    {colOrders.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {colOrders.length === 0 ? (
                    <p className="text-center py-10 text-neutral-600 text-sm">
                      No orders
                    </p>
                  ) : (
                    colOrders.map((order) => (
                      <KitchenOrderCard key={order.id} order={order} />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
