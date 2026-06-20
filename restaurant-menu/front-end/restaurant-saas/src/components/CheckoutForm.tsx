'use client';

import { useState } from 'react';
import { useCartStore } from '@/lib/cartStore';
import type { CreateOrderPayload } from '@/types';

interface CheckoutFormProps {
  restaurantId: number;
  onSubmit: (payload: CreateOrderPayload) => void;
  loading?: boolean;
}

export default function CheckoutForm({
  restaurantId,
  onSubmit,
  loading,
}: CheckoutFormProps) {
  const { items, tableNumber, setTable } = useCartStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      restaurant: restaurantId,
      table_number: tableNumber,
      customer_name: name,
      customer_phone: phone,
      notes,
      items: items.map(({ menuItem, quantity, specialInstructions }) => ({
        menu_item: menuItem.id,
        quantity,
        special_instructions: specialInstructions || '',
      })),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-sm text-neutral-400 mb-1.5">
            Your Name <span className="text-red-400">*</span>
          </label>
          <input
            className="input"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-sm text-neutral-400 mb-1.5">
            Phone Number
          </label>
          <input
            className="input"
            placeholder="+1 234 567 890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-neutral-400 mb-1.5">
          Table Number <span className="text-red-400">*</span>
        </label>
        <input
          className="input"
          placeholder="e.g. 5"
          value={tableNumber}
          onChange={(e) => setTable(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm text-neutral-400 mb-1.5">
          Order Notes
        </label>
        <textarea
          className="input resize-none"
          rows={3}
          placeholder="Any allergies or special requests?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={loading || items.length === 0}
        className="btn-primary w-full"
      >
        {loading ? 'Placing order…' : 'Place Order'}
      </button>
    </form>
  );
}
