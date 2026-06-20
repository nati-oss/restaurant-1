import type { OrderStatus } from '@/types';
import clsx from 'clsx';

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; classes: string; dot: string }
> = {
  pending: {
    label: 'Pending',
    classes: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    dot: 'bg-yellow-400 animate-pulse',
  },
  accepted: {
    label: 'Accepted',
    classes: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    dot: 'bg-blue-400',
  },
  preparing: {
    label: 'Preparing',
    classes: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
    dot: 'bg-orange-400 animate-pulse',
  },
  ready: {
    label: 'Ready!',
    classes: 'bg-green-500/10 text-green-400 border border-green-500/20',
    dot: 'bg-green-400',
  },
  completed: {
    label: 'Completed',
    classes: 'bg-neutral-500/10 text-neutral-400 border border-neutral-500/20',
    dot: 'bg-neutral-400',
  },
  cancelled: {
    label: 'Cancelled',
    classes: 'bg-red-500/10 text-red-400 border border-red-500/20',
    dot: 'bg-red-400',
  },
};

interface StatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;

  return (
    <span
      className={clsx(
        'badge',
        config.classes,
        size === 'sm' && 'text-xs px-2 py-0.5',
        size === 'lg' && 'text-sm px-4 py-1.5'
      )}
    >
      <span className={clsx('w-1.5 h-1.5 rounded-full', config.dot)} />
      {config.label}
    </span>
  );
}
