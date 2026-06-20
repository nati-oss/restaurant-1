'use client';

import Image from 'next/image';
import { Plus, Clock } from 'lucide-react';
import type { MenuItem } from '@/types';

interface MenuCardProps {
  item: MenuItem;
  currency?: string;
  onAdd: (item: MenuItem) => void;
}

export default function MenuCard({
  item,
  currency = '$',
  onAdd,
}: MenuCardProps) {
  const price = parseFloat(item.price);

  return (
    <div className="card flex gap-4 p-4 hover:border-brand-500/40 transition-colors group animate-fade-in">
      {/* Image */}
      {item.image && (
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden flex-shrink-0 bg-surface-border">
          <Image
            src={item.image}
            alt={item.name}
            width={112}
            height={112}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-white leading-snug">{item.name}</h3>
            {item.is_featured && (
              <span className="badge bg-brand-500/10 text-brand-400 border border-brand-500/20 flex-shrink-0 text-xs">
                ⭐ Popular
              </span>
            )}
          </div>
          {item.description && (
            <p className="text-neutral-400 text-sm mt-1 line-clamp-2">
              {item.description}
            </p>
          )}
          {item.preparation_time > 0 && (
            <span className="inline-flex items-center gap-1 text-xs text-neutral-500 mt-1.5">
              <Clock className="w-3 h-3" />
              {item.preparation_time} min
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="font-bold text-lg text-brand-400">
            {currency}{price.toFixed(2)}
          </span>

          {item.is_available ? (
            <button
              onClick={() => onAdd(item)}
              className="w-9 h-9 rounded-xl bg-brand-500 hover:bg-brand-600 text-white flex items-center justify-center transition-colors active:scale-90"
            >
              <Plus className="w-4 h-4" />
            </button>
          ) : (
            <span className="text-xs text-neutral-500 font-medium">Unavailable</span>
          )}
        </div>
      </div>
    </div>
  );
}
