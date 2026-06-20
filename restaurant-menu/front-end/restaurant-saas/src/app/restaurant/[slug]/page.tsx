'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useMenu } from '@/hooks/useRestaurant';
import { useCartStore } from '@/lib/cartStore';
import Navbar from '@/components/Navbar';
import RestaurantHeader from '@/components/RestaurantHeader';
import CategoryTabs from '@/components/CategoryTabs';
import MenuCard from '@/components/MenuCard';
import CartDrawer from '@/components/CartDrawer';
import type { MenuItem } from '@/types';
import { UtensilsCrossed } from 'lucide-react';

export default function RestaurantPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, isError } = useMenu(slug);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const { addItem, setRestaurant } = useCartStore();

  const handleAdd = (item: MenuItem) => {
    if (data?.restaurant) {
      setRestaurant(data.restaurant.id, slug);
    }
    addItem(item);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <UtensilsCrossed className="w-10 h-10 text-brand-500 animate-pulse mx-auto" />
          <p className="text-neutral-400">Loading menu…</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-2xl">😕</p>
          <p className="text-white font-semibold">Restaurant not found</p>
          <p className="text-neutral-400 text-sm">
            Double-check the link or scan the QR code again.
          </p>
        </div>
      </div>
    );
  }

  const { restaurant, categories, items } = data;
  const activeItems = items.filter((i) =>
    activeCategory ? i.category === activeCategory : true
  );
  const activeCategories = categories.filter((c) => c.is_active);
  const displayCategory = activeCategory ?? (activeCategories[0]?.id || null);

  return (
    <>
      <Navbar onCartClick={() => setCartOpen(true)} />

      <main className="pt-16 pb-24">
        <RestaurantHeader restaurant={restaurant} />

        {activeCategories.length > 0 && (
          <CategoryTabs
            categories={activeCategories}
            active={displayCategory}
            onChange={setActiveCategory}
          />
        )}

        <div className="max-w-5xl mx-auto px-4 mt-6 space-y-8">
          {activeCategories
            .filter((cat) =>
              displayCategory ? cat.id === displayCategory : true
            )
            .map((cat) => {
              const catItems = items.filter(
                (i) => i.category === cat.id && i.is_available
              );
              if (catItems.length === 0) return null;
              return (
                <section key={cat.id} id={`cat-${cat.id}`}>
                  <h2 className="font-display text-xl font-bold text-white mb-4">
                    {cat.name}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {catItems.map((item) => (
                      <MenuCard
                        key={item.id}
                        item={item}
                        currency={restaurant.currency}
                        onAdd={handleAdd}
                      />
                    ))}
                  </div>
                </section>
              );
            })}

          {activeItems.length === 0 && (
            <div className="text-center py-16 text-neutral-500">
              <UtensilsCrossed className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No items in this category</p>
            </div>
          )}
        </div>
      </main>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        currency={restaurant.currency}
      />
    </>
  );
}
