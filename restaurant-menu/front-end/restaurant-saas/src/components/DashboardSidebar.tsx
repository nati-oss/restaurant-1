'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  BarChart3,
  ChefHat,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '@/lib/authStore';
import { authApi } from '@/services/api';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const NAV = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/orders', label: 'Orders', icon: ClipboardList },
  { href: '/dashboard/menu', label: 'Menu', icon: UtensilsCrossed },
  { href: '/dashboard/statistics', label: 'Statistics', icon: BarChart3 },
  { href: '/kitchen', label: 'Kitchen View', icon: ChefHat },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { clearAuth, user } = useAuthStore();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore
    }
    clearAuth();
    router.push('/dashboard');
    toast.success('Logged out');
  };

  return (
    <aside className="w-60 flex-shrink-0 bg-surface-raised border-r border-surface-border flex flex-col min-h-screen">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-surface-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <ChefHat className="w-5 h-5 text-brand-500" />
          <span className="font-display font-bold">TableFlow</span>
        </Link>
        {user && (
          <p className="text-xs text-neutral-500 mt-1">{user.email}</p>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                active
                  ? 'bg-brand-500/10 text-brand-400'
                  : 'text-neutral-400 hover:text-white hover:bg-surface-border'
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-surface-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-400 hover:text-red-400 hover:bg-red-500/5 transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>
    </aside>
  );
}
