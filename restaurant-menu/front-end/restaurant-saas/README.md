# TableFlow — Restaurant Ordering SaaS Frontend

A production-style Next.js frontend for a restaurant QR ordering platform. Dark theme, mobile-first, real-time order tracking.

---

## Quick Start

### 1. Install dependencies

```bash
cd restaurant-saas
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and set your Django backend URL:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    → Landing page
│   ├── restaurant/[slug]/page.tsx  → Customer menu view (QR destination)
│   ├── cart/page.tsx               → Cart review
│   ├── checkout/page.tsx           → Order placement form
│   ├── status/[orderId]/page.tsx   → Live order tracking
│   ├── dashboard/
│   │   ├── page.tsx                → Login + dashboard overview
│   │   ├── orders/page.tsx         → Incoming orders management
│   │   ├── menu/page.tsx           → Menu & category management
│   │   └── statistics/page.tsx     → Revenue & analytics
│   └── kitchen/page.tsx            → Kitchen display (kanban)
├── components/
│   ├── Navbar.tsx
│   ├── RestaurantHeader.tsx
│   ├── CategoryTabs.tsx
│   ├── MenuCard.tsx
│   ├── CartDrawer.tsx
│   ├── CheckoutForm.tsx
│   ├── OrderCard.tsx
│   ├── StatusBadge.tsx
│   ├── DashboardSidebar.tsx
│   └── StatsCard.tsx
├── hooks/
│   ├── useRestaurant.ts
│   ├── useOrders.ts
│   └── useStats.ts
├── services/
│   └── api.ts                      → All API calls (axios)
├── lib/
│   ├── cartStore.ts                → Zustand cart (persisted)
│   └── authStore.ts                → Zustand auth (persisted)
└── types/
    └── index.ts                    → All TypeScript types
```

---

## Customer Flow

1. Customer scans QR code → `/restaurant/[slug]`
2. Browse menu by category
3. Add items → cart drawer opens
4. Go to `/cart` → review items
5. Go to `/checkout` → fill name, table number
6. Order placed → redirected to `/status/[orderId]`
7. Page auto-refreshes every 10s to show status updates

## Restaurant Dashboard Flow

1. Staff visits `/dashboard` → login with credentials
2. View overview stats
3. `/dashboard/orders` → accept, prepare, and complete orders
4. `/dashboard/menu` → manage items and categories
5. `/dashboard/statistics` → revenue and top sellers
6. `/kitchen` → full-screen kanban for kitchen staff

---

## API Endpoints Expected

```
GET    /restaurants/:slug/          → Restaurant info
GET    /restaurants/:slug/menu/     → Menu with categories and items
POST   /orders/                     → Create order
GET    /orders/                     → List orders (with ?status= filter)
GET    /orders/:id/                 → Single order
PATCH  /orders/:id/status/          → Update status
POST   /payments/                   → Create payment
GET    /dashboard/statistics/       → Stats
GET    /menu-items/                 → List items
POST   /menu-items/                 → Create item
PATCH  /menu-items/:id/             → Update item
DELETE /menu-items/:id/             → Delete item
GET    /categories/                 → List categories
POST   /categories/                 → Create category
PATCH  /categories/:id/             → Update category
DELETE /categories/:id/             → Delete category
POST   /auth/login/                 → Login (returns token + user)
POST   /auth/logout/                → Logout
```

### Auth

The app uses **Token authentication**. After login, the token is stored in `localStorage` and sent as `Authorization: Token <token>` on every request.

---

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** — dark design system with `brand-*` (orange) tokens
- **@tanstack/react-query** — data fetching, caching, auto-refetch
- **Zustand** — cart + auth state (persisted to localStorage)
- **Axios** — HTTP client with interceptors
- **react-hot-toast** — notifications
- **lucide-react** — icons

---

## Design System

| Token | Value | Use |
|-------|-------|-----|
| `brand-500` | `#f97316` | Primary actions, accents |
| `surface-DEFAULT` | `#0f0f0f` | Page background |
| `surface-raised` | `#1a1a1a` | Cards |
| `surface-border` | `#2a2a2a` | Borders, dividers |
| Font Display | Playfair Display | Headings |
| Font Body | Inter | Everything else |

---

## Build for Production

```bash
npm run build
npm start
```
