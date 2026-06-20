'use client';

import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import Image from 'next/image';
import Link from 'next/link';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  currency?: string;
}

export default function CartDrawer({
  open,
  onClose,
  currency = '$',
}: CartDrawerProps) {
  const { items, updateQuantity, removeItem, total, restaurantSlug } =
    useCartStore();
  const cartTotal = total();

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-surface-raised border-l border-surface-border z-50 flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand-500" />
            <h2 className="font-display font-bold text-lg">Your Order</h2>
          </div>
          <button onClick={onClose} className="btn-ghost p-2">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-neutral-500">
              <ShoppingBag className="w-12 h-12 opacity-30" />
              <p>Your cart is empty</p>
              <button onClick={onClose} className="btn-ghost text-brand-400">
                Browse menu
              </button>
            </div>
          ) : (
            items.map(({ menuItem, quantity }) => (
              <div
                key={menuItem.id}
                className="flex items-center gap-3 animate-fade-in"
              >
                {menuItem.image && (
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-surface-border">
                    <Image
                      src={menuItem.image}
                      alt={menuItem.name}
                      width={56}
                      height={56}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm leading-snug line-clamp-1">
                    {menuItem.name}
                  </p>
                  <p className="text-brand-400 text-sm font-semibold">
                    {currency}
                    {(parseFloat(menuItem.price) * quantity).toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => updateQuantity(menuItem.id, quantity - 1)}
                    className="w-7 h-7 rounded-lg bg-surface-border hover:bg-brand-500/20 flex items-center justify-center transition-colors"
                  >
                    {quantity === 1 ? (
                      <Trash2 className="w-3 h-3 text-red-400" />
                    ) : (
                      <Minus className="w-3 h-3" />
                    )}
                  </button>
                  <span className="w-6 text-center text-sm font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(menuItem.id, quantity + 1)}
                    className="w-7 h-7 rounded-lg bg-surface-border hover:bg-brand-500/20 flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-4 border-t border-surface-border space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Subtotal</span>
              <span className="font-bold text-lg">
                {currency}
                {cartTotal.toFixed(2)}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="btn-primary w-full text-center block"
            >
              Checkout — {currency}{cartTotal.toFixed(2)}
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
