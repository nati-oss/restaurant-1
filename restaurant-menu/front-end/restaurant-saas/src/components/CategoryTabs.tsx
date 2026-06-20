'use client';

import { useRef, useEffect } from 'react';
import type { Category } from '@/types';
import clsx from 'clsx';

interface CategoryTabsProps {
  categories: Category[];
  active: number | null;
  onChange: (id: number) => void;
}

export default function CategoryTabs({
  categories,
  active,
  onChange,
}: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [active]);

  return (
    <div className="sticky top-16 z-30 bg-surface-DEFAULT/90 backdrop-blur border-b border-surface-border">
      <div
        ref={scrollRef}
        className="flex gap-1 overflow-x-auto px-4 py-3 no-scrollbar"
        style={{ scrollbarWidth: 'none' }}
      >
        {categories.map((cat) => (
          <button
            key={cat.id}
            ref={active === cat.id ? activeRef : undefined}
            onClick={() => onChange(cat.id)}
            className={clsx(
              'flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
              active === cat.id
                ? 'bg-brand-500 text-white'
                : 'bg-surface-raised text-neutral-400 hover:text-white hover:bg-surface-border'
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
