'use client';

import { Clock, User, Hash } from 'lucide-react';
import type { Order, OrderStatus } from '@/types';
import StatusBadge from './StatusBadge';
import { useUpdateOrderStatus } from '@/hooks/useOrders';
import toast from 'react-hot-toast';

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: 'accepted',
  accepted: 'preparing',
  preparing: 'ready',
  ready: 'completed',
};

const NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
  pending: 'Accept Order',
  accepted: 'Start Preparing',
  preparing: 'Mark Ready',
  ready: 'Complete',
};

interface OrderCardProps {
  order: Order;
  currency?: string;
}

export default function OrderCard({ order, currency = '$' }: OrderCardProps) {
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();

  const handleAdvance = () => {
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    updateStatus(
      { id: order.id, status: next },
      {
        onSuccess: () => toast.success(`Order #${order.id} → ${next}`),
        onError: () => toast.error('Failed to update status'),
      }
    );
  };

  const timeAgo = () => {
    const diff = Date.now() - new Date(order.created_at).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m ago`;
  };

  const nextAction = NEXT_STATUS[order.status];
  const total = parseFloat(order.total_amount);

  return (
    <div className="card p-5 space-y-4 hover:border-brand-500/30 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">#{order.id}</span>
            <StatusBadge status={order.status} size="sm" />
          </div>
          <div className="flex items-center gap-4 mt-1 text-xs text-neutral-500">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {order.customer_name}
            </span>
            <span className="flex items-center gap-1">
              <Hash className="w-3 h-3" />
              Table {order.table_number}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {timeAgo()}
            </span>
          </div>
        </div>
        <span className="font-bold text-brand-400 text-lg whitespace-nowrap">
          {currency}{total.toFixed(2)}
        </span>
      </div>

      {/* Items */}
      <ul className="space-y-1.5">
        {order.items.map((item) => (
          <li key={item.id} className="flex justify-between text-sm">
            <span className="text-neutral-300">
              <span className="text-white font-medium">{item.quantity}×</span>{' '}
              {item.menu_item_name}
            </span>
            <span className="text-neutral-400">
              {currency}{parseFloat(item.subtotal).toFixed(2)}
            </span>
          </li>
        ))}
      </ul>

      {/* Notes */}
      {order.notes && (
        <p className="text-xs text-neutral-500 bg-surface-DEFAULT rounded-lg px-3 py-2">
          📝 {order.notes}
        </p>
      )}

      {/* Actions */}
      {nextAction && (
        <div className="pt-1 flex gap-2">
          <button
            onClick={handleAdvance}
            disabled={isPending}
            className="btn-primary flex-1 py-2 text-sm"
          >
            {isPending ? 'Updating…' : NEXT_LABEL[order.status]}
          </button>
          {order.status === 'pending' && (
            <button
              onClick={() =>
                updateStatus(
                  { id: order.id, status: 'cancelled' },
                  { onSuccess: () => toast.success('Order cancelled') }
                )
              }
              disabled={isPending}
              className="btn-secondary py-2 text-sm text-red-400 border-red-500/20 hover:border-red-500"
            >
              Decline
            </button>
          )}
        </div>
      )}
    </div>
  );
}
