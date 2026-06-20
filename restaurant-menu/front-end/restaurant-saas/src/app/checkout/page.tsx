'use client';

import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/cartStore';
import { useCreateOrder } from '@/hooks/useOrders';
import CheckoutForm from '@/components/CheckoutForm';
import Navbar from '@/components/Navbar';
import type { CreateOrderPayload } from '@/types';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, restaurantId, clearCart, total } = useCartStore();
  const { mutate: createOrder, isPending } = useCreateOrder();
  const cartTotal = total();

  const handleSubmit = (payload: CreateOrderPayload) => {
    createOrder(payload, {
      onSuccess: (order) => {
        clearCart();
        toast.success('Order placed!');
        router.push(`/status/${order.id}`);
      },
      onError: () => {
        toast.error('Failed to place order. Please try again.');
      },
    });
  };

  if (!restaurantId || items.length === 0) {
    return (
      <>
        <Navbar showCart={false} />
        <div className="min-h-screen flex items-center justify-center pt-16">
          <div className="text-center">
            <p className="text-neutral-400 mb-4">Nothing to checkout.</p>
            <Link href="/" className="btn-primary">
              Go Home
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar showCart={false} />
      <main className="pt-16 max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/cart" className="btn-ghost p-2">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-display text-3xl font-bold">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3">
            <div className="card p-6">
              <h2 className="font-semibold text-white mb-5">Your Details</h2>
              <CheckoutForm
                restaurantId={restaurantId}
                onSubmit={handleSubmit}
                loading={isPending}
              />
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-2">
            <div className="card p-6 sticky top-20">
              <h2 className="font-semibold text-white mb-4">Order Summary</h2>
              <ul className="space-y-3 mb-4">
                {items.map(({ menuItem, quantity }) => (
                  <li key={menuItem.id} className="flex items-center gap-3">
                    {menuItem.image && (
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-surface-border">
                        <Image
                          src={menuItem.image}
                          alt={menuItem.name}
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white line-clamp-1">
                        {menuItem.name}
                      </p>
                      <p className="text-xs text-neutral-500">×{quantity}</p>
                    </div>
                    <span className="text-sm font-medium text-brand-400">
                      ${(parseFloat(menuItem.price) * quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-surface-border pt-4 flex justify-between font-bold text-white">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
