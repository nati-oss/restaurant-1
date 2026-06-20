import type { ReactNode } from 'react';
import clsx from 'clsx';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  sub?: string;
  accent?: 'orange' | 'green' | 'blue' | 'purple';
}

const ACCENT_MAP = {
  orange: 'text-brand-400 bg-brand-500/10',
  green: 'text-green-400 bg-green-500/10',
  blue: 'text-blue-400 bg-blue-500/10',
  purple: 'text-purple-400 bg-purple-500/10',
};

export default function StatsCard({
  label,
  value,
  icon,
  sub,
  accent = 'orange',
}: StatsCardProps) {
  return (
    <div className="card p-5 flex items-start gap-4">
      <div
        className={clsx(
          'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
          ACCENT_MAP[accent]
        )}
      >
        {icon}
      </div>
      <div>
        <p className="text-neutral-400 text-sm">{label}</p>
        <p className="font-display font-bold text-2xl text-white mt-0.5">
          {value}
        </p>
        {sub && <p className="text-xs text-neutral-500 mt-1">{sub}</p>}
      </div>
    </div>
  );
}
