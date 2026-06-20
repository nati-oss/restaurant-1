'use client';

import Link from 'next/link';
import { useCartStore } from '@/lib/cartStore';
import { ShoppingBag, ArrowLeft, Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';

export default function CartPage() {
  const { items, updateQuantity, removeItem, total, restaurantSlug } =
    useCartStore();
  const cartTotal = total();

  if (items.length === 0) {
    return (
      <>
        <Navbar showCart={false} />
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 pt-16">
          <ShoppingBag className="w-16 h-16 text-neutral-600" />
          <h2 className="font-display text-2xl font-bold">Cart is empty</h2>
          <p className="text-neutral-400">Add some items from the menu.</p>
          {restaurantSlug && (
            <Link
              href={`/restaurant/${restaurantSlug}`}
              className="btn-primary mt-2"
            >
              Back to Menu
            </Link>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar showCart={false} />
      <main className="pt-16 max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          {restaurantSlug && (
            <Link
              href={`/restaurant/${restaurantSlug}`}
              className="btn-ghost p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
          )}
          <h1 className="font-display text-3xl font-bold">Your Cart</h1>
        </div>

        <div className="space-y-4">
          {items.map(({ menuItem, quantity }) => (
            <div key={menuItem.id} className="card p-4 flex items-center gap-4">
              {menuItem.image && (
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-surface-border">
                  <Image
                    src={menuItem.image}
                    alt={menuItem.name}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white">{menuItem.name}</p>
                <p className="text-brand-400 text-sm">
                  ${parseFloat(menuItem.price).toFixed(2)} each
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(menuItem.id, quantity - 1)}
                  className="w-8 h-8 rounded-lg bg-surface-border hover:bg-brand-500/20 flex items-center justify-center transition-colors"
                >
                  {quantity === 1 ? (
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  ) : (
                    <Minus className="w-3.5 h-3.5" />
                  )}
                </button>
                <span className="w-8 text-center font-bold">{quantity}</span>
                <button
                  onClick={() => updateQuantity(menuItem.id, quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-surface-border hover:bg-brand-500/20 flex items-center justify-center transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="font-bold text-white w-16 text-right">
                ${(parseFloat(menuItem.price) * quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="card p-6 mt-6 space-y-3">
          <div className="flex justify-between text-neutral-400">
            <span>Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-white text-lg border-t border-surface-border pt-3">
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
        </div>

        <Link href="/checkout" className="btn-primary w-full mt-6 block text-center">
          Proceed to Checkout
        </Link>
      </main>
    </>
  );
}
