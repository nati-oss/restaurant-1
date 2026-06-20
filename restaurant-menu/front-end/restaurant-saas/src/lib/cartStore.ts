import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, MenuItem } from '@/types';

interface CartStore {
  items: CartItem[];
  restaurantId: number | null;
  restaurantSlug: string | null;
  tableNumber: string;
  addItem: (item: MenuItem, quantity?: number, instructions?: string) => void;
  removeItem: (menuItemId: number) => void;
  updateQuantity: (menuItemId: number, quantity: number) => void;
  clearCart: () => void;
  setTable: (table: string) => void;
  setRestaurant: (id: number, slug: string) => void;
  total: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      restaurantId: null,
      restaurantSlug: null,
      tableNumber: '',

      addItem: (menuItem, quantity = 1, instructions = '') => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.menuItem.id === menuItem.id
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.menuItem.id === menuItem.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { menuItem, quantity, specialInstructions: instructions },
            ],
          };
        });
      },

      removeItem: (menuItemId) => {
        set((state) => ({
          items: state.items.filter((i) => i.menuItem.id !== menuItemId),
        }));
      },

      updateQuantity: (menuItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(menuItemId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.menuItem.id === menuItemId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [], tableNumber: '' }),

      setTable: (tableNumber) => set({ tableNumber }),

      setRestaurant: (id, slug) =>
        set({ restaurantId: id, restaurantSlug: slug }),

      total: () =>
        get().items.reduce(
          (sum, i) => sum + parseFloat(i.menuItem.price) * i.quantity,
          0
        ),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'restaurant-cart' }
  )
);
