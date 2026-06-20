import Link from 'next/link';
import { ChefHat, QrCode, ClipboardList, TrendingUp } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-surface-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ChefHat className="w-6 h-6 text-brand-500" />
          <span className="font-display font-bold text-xl">TableFlow</span>
        </div>
        <Link href="/dashboard" className="btn-secondary text-sm py-2 px-4">
          Restaurant Login
        </Link>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 badge bg-brand-500/10 text-brand-400 border border-brand-500/20 mb-6">
          <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
          Restaurant SaaS Platform
        </div>

        <h1 className="font-display text-5xl sm:text-7xl font-bold text-white leading-none tracking-tight max-w-3xl">
          Orders, simplified.
        </h1>

        <p className="mt-6 text-lg text-neutral-400 max-w-xl">
          QR-code ordering, real-time kitchen updates, and a full dashboard —
          everything your restaurant needs, in one place.
        </p>

        <div className="flex flex-wrap gap-4 mt-10 justify-center">
          <Link href="/dashboard" className="btn-primary text-base px-8">
            Open Dashboard
          </Link>
          <Link
            href="/restaurant/demo"
            className="btn-secondary text-base px-8"
          >
            See Demo Menu
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-24 max-w-3xl w-full text-left">
          {[
            {
              icon: QrCode,
              title: 'QR Ordering',
              desc: 'Customers scan, browse, and order — no app install required.',
            },
            {
              icon: ClipboardList,
              title: 'Live Kitchen',
              desc: 'Real-time order queue with one-tap status updates.',
            },
            {
              icon: TrendingUp,
              title: 'Analytics',
              desc: 'Revenue, top dishes, and order trends at a glance.',
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card p-6">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-brand-400" />
              </div>
              <h3 className="font-semibold text-white">{title}</h3>
              <p className="text-sm text-neutral-400 mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
