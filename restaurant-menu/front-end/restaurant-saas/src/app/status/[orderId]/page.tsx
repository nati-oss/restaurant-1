'use client';

import { useParams } from 'next/navigation';
import { useOrder } from '@/hooks/useOrders';
import StatusBadge from '@/components/StatusBadge';
import Navbar from '@/components/Navbar';
import { CheckCircle2, Circle, Clock, UtensilsCrossed } from 'lucide-react';
import type { OrderStatus } from '@/types';
import clsx from 'clsx';

const STEPS: { status: OrderStatus; label: string; desc: string }[] = [
  { status: 'pending', label: 'Order Received', desc: 'Your order is waiting to be accepted' },
  { status: 'accepted', label: 'Accepted', desc: 'The restaurant confirmed your order' },
  { status: 'preparing', label: 'Being Prepared', desc: "Chef is cooking your food" },
  { status: 'ready', label: 'Ready!', desc: 'Your order is ready for pickup/delivery' },
  { status: 'completed', label: 'Completed', desc: 'Enjoy your meal!' },
];

const STATUS_ORDER: OrderStatus[] = ['pending', 'accepted', 'preparing', 'ready', 'completed'];

export default function StatusPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { data: order, isLoading, isError } = useOrder(orderId);

  if (isLoading) {
    return (
      <>
        <Navbar showCart={false} />
        <div className="min-h-screen flex items-center justify-center pt-16">
          <div className="text-center space-y-3">
            <UtensilsCrossed className="w-10 h-10 text-brand-500 animate-pulse mx-auto" />
            <p className="text-neutral-400">Fetching your order…</p>
          </div>
        </div>
      </>
    );
  }

  if (isError || !order) {
    return (
      <>
        <Navbar showCart={false} />
        <div className="min-h-screen flex items-center justify-center pt-16">
          <p className="text-neutral-400">Order not found.</p>
        </div>
      </>
    );
  }

  const currentIdx = STATUS_ORDER.indexOf(order.status);

  return (
    <>
      <Navbar showCart={false} />
      <main className="pt-16 max-w-lg mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-neutral-500 text-sm mb-1">Order #{order.id}</p>
          <h1 className="font-display text-3xl font-bold text-white mb-3">
            {order.status === 'ready' ? '🎉 Your food is ready!' : 'Tracking your order'}
          </h1>
          <StatusBadge status={order.status} size="lg" />
          {order.estimated_time && (
            <p className="text-neutral-400 text-sm mt-3 flex items-center justify-center gap-1.5">
              <Clock className="w-4 h-4" />
              Estimated: {order.estimated_time} minutes
            </p>
          )}
        </div>

        {/* Progress Steps */}
        {order.status !== 'cancelled' && (
          <div className="card p-6 mb-6">
            <div className="space-y-0">
              {STEPS.map((step, idx) => {
                const done = idx <= currentIdx;
                const active = idx === currentIdx;
                return (
                  <div key={step.status} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={clsx(
                          'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors',
                          done
                            ? 'text-brand-400'
                            : 'text-neutral-600'
                        )}
                      >
                        {done ? (
                          <CheckCircle2 className={clsx('w-6 h-6', active && 'animate-pulse-soft')} />
                        ) : (
                          <Circle className="w-6 h-6" />
                        )}
                      </div>
                      {idx < STEPS.length - 1 && (
                        <div
                          className={clsx(
                            'w-0.5 flex-1 my-1 rounded min-h-6',
                            idx < currentIdx ? 'bg-brand-500' : 'bg-surface-border'
                          )}
                        />
                      )}
                    </div>
                    <div className="pb-6">
                      <p
                        className={clsx(
                          'font-semibold',
                          done ? 'text-white' : 'text-neutral-500'
                        )}
                      >
                        {step.label}
                      </p>
                      <p className="text-sm text-neutral-500 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Order Details */}
        <div className="card p-6">
          <h2 className="font-semibold text-white mb-4">Order Details</h2>
          <div className="space-y-2 mb-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-neutral-300">
                  <span className="text-white font-medium">{item.quantity}×</span>{' '}
                  {item.menu_item_name}
                </span>
                <span className="text-neutral-400">${parseFloat(item.subtotal).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-surface-border pt-3 flex justify-between font-bold text-white">
            <span>Total</span>
            <span className="text-brand-400">${parseFloat(order.total_amount).toFixed(2)}</span>
          </div>
          <div className="mt-4 pt-4 border-t border-surface-border grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-neutral-500">Customer</p>
              <p className="text-white">{order.customer_name}</p>
            </div>
            <div>
              <p className="text-neutral-500">Table</p>
              <p className="text-white">#{order.table_number}</p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-neutral-600 mt-6">
          This page refreshes automatically every 10 seconds
        </p>
      </main>
    </>
  );
}
