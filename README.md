# EasyBills

A modern, premium fintech-style web app for bill payments — airtime, data, electricity, cable TV, exam pins and more. Frontend-only with a mock API layer that mirrors real REST responses, so swapping in a real backend later requires no UI changes.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000

To build for production:

```bash
npm run build
npm run start
```

## Demo credentials

- Login: any email + a password of 6+ characters
- OTP verification code: `123456`

## What's implemented

- **Landing page**: hero, services grid, how-it-works, features, agent/profit-margin teaser, FAQ, footer — with an install-to-home-screen prompt
- **Auth**: login & register with a split image/form layout, OTP verification, forgot password
- **Dashboard**: wallet balance (scratch-to-reveal), quick actions, recent transactions
- **Wallet**: overview, fund (bank transfer / card / virtual account), withdraw, history with filters, statement of account link
- **Services**: Airtime purchase, Data bundle purchase, Electricity bill payment (with meter lookup) — each with a confirmation modal and a receipt screen with working Share (Web Share API / clipboard fallback) and Download (real file export). Other bill categories (water, cable, WAEC, NECO, JAMB, NABTEB, recharge cards, betting, gift cards) are scaffolded on the services page as "coming soon".
- **Transactions**: searchable, filterable history + transaction detail/receipt page with working share/download
- **Statement of Account**: date-range filter (presets or custom), running summary, and CSV export of the user's activity
- **Floating AI support chat**: available on every page (including the landing page), gives contextual mock replies about airtime, wallet, bills, security, refunds and agents; conversation is persisted to `sessionStorage` for the browser session only
- **Admin Panel** (`/admin`): a full 26-page back office — Dashboard, Analytics, Revenue, Sales, Transactions, Wallets (with pending withdrawal approvals), Customers, Agents, Commissions, Products, Bill Providers, Pricing, Profit Settings (the margin/markup system from the spec, with a live cost → customer-pays preview), Orders, Coupons, Announcements, Notifications, Reports (downloadable), Support Tickets, Blog, Pages (CMS), Roles & Permissions, Settings, Audit Logs, Activity Logs, and API Management. Collapsible sidebar, searchable/paginated data tables throughout, and recharts-powered charts on the dashboard/analytics/revenue/sales pages.
- **Profile & Notifications** pages
- **PWA**: manifest, service worker with offline caching, offline fallback page, install prompt (shown app-wide), app icons
- **Dark / light mode**, mobile bottom navigation with a floating quick-purchase button
- **Design system**: a single-hue teal (`brand`) color theme (accented only by neutral ink/paper and status colors — success green, danger red), Space Grotesk / Inter / IBM Plex Mono type, and a signature "notch card" perforated-edge motif echoing physical recharge/scratch cards

## Project structure

```
app/                  Next.js App Router routes
components/
  ui/                 Base design-system primitives (button, card, input, dialog, etc.)
  layout/              App shell, bottom nav, top bar, site header/footer
  dashboard/           Balance card, quick actions, transaction list item
  landing/             Marketing page sections
  shared/              Reusable cross-cutting components (notch card, receipt, AI chat, auth shells...)
lib/
  api/                 Mock API functions — swap internals for real fetch calls later
  mock-data/           Dummy data (users, wallet, transactions, providers, plans)
  types/               Shared TypeScript types
  validators/          Zod schemas used by react-hook-form
hooks/                 React Query hooks wrapping the mock API
public/
  icons/               PWA app icons
  manifest.json         Web app manifest
  sw.js                 Service worker
  offline.html          Offline fallback page
```

## Connecting a real backend later

Every function in `lib/api/*.ts` currently does:

```ts
await delay(1000);
return dummyData;
```

Replace the body with a real `fetch(...)` call to your backend — the function signatures, return shapes, and every component that calls them stay the same. The same applies to `lib/api/ai-support.ts`: swap the keyword-matching mock for a real AI API call (e.g. to your own backend proxying a model) and the chat widget's UI and sessionStorage persistence keep working unchanged.

## Next steps / not yet built

This build focused on a deep, polished core user flow. Not yet implemented: the admin panel, remaining bill categories (cable, water, WAEC/NECO/JAMB/NABTEB, recharge cards, betting, gift cards), referral module, live support ticket UI, and KYC/2FA settings screens. The mock API and component patterns here make all of these straightforward to add following the same structure.
