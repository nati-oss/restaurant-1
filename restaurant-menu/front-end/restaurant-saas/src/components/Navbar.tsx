'use client';

import Link from 'next/link';
import { ShoppingBag, ChefHat } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import clsx from 'clsx';

interface NavbarProps {
  showCart?: boolean;
  onCartClick?: () => void;
  transparent?: boolean;
}

export default function Navbar({
  showCart = true,
  onCartClick,
  transparent = false,
}: NavbarProps) {
  const itemCount = useCartStore((s) => s.itemCount());

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-40 transition-colors',
        transparent
          ? 'bg-transparent'
          : 'bg-surface-DEFAULT/80 backdrop-blur-md border-b border-surface-border'
      )}
    >
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <ChefHat className="w-6 h-6 text-brand-500" />
          <span className="font-display font-bold text-lg tracking-tight">
            TableFlow
          </span>
        </Link>

        {showCart && (
          <button
            onClick={onCartClick}
            className="relative btn-ghost flex items-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="hidden sm:inline text-sm">Cart</span>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-fade-in">
                {itemCount}
              </span>
            )}
          </button>
        )}
      </div>
    </header>
  );
}
