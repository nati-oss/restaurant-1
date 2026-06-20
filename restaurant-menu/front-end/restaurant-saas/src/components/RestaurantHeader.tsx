import Image from 'next/image';
import { MapPin, Phone, Clock } from 'lucide-react';
import type { Restaurant } from '@/types';

interface RestaurantHeaderProps {
  restaurant: Restaurant;
}

export default function RestaurantHeader({ restaurant }: RestaurantHeaderProps) {
  return (
    <div className="relative">
      {/* Cover */}
      <div className="h-48 sm:h-64 bg-gradient-to-br from-brand-800 to-neutral-900 relative overflow-hidden">
        {restaurant.cover_image && (
          <Image
            src={restaurant.cover_image}
            alt={restaurant.name}
            fill
            className="object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-DEFAULT via-transparent to-transparent" />
      </div>

      {/* Info strip */}
      <div className="max-w-5xl mx-auto px-4 pb-6">
        <div className="flex items-end gap-4 -mt-12 relative z-10">
          {/* Logo */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-surface-border bg-surface-raised overflow-hidden flex-shrink-0 shadow-xl">
            {restaurant.logo ? (
              <Image
                src={restaurant.logo}
                alt={restaurant.name}
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl">
                🍽️
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 pb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight">
                {restaurant.name}
              </h1>
              <span
                className={`badge text-xs ${
                  restaurant.is_open
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${restaurant.is_open ? 'bg-green-400' : 'bg-red-400'}`}
                />
                {restaurant.is_open ? 'Open' : 'Closed'}
              </span>
            </div>
            {restaurant.description && (
              <p className="text-neutral-400 text-sm mt-1 line-clamp-2">
                {restaurant.description}
              </p>
            )}
          </div>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-4 mt-4 text-sm text-neutral-400">
          {restaurant.address && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-500" />
              {restaurant.address}
            </span>
          )}
          {restaurant.phone && (
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-brand-500" />
              {restaurant.phone}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-brand-500" />
            Pickup in 15–30 min
          </span>
        </div>
      </div>
    </div>
  );
}
