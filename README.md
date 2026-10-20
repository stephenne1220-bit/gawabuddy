# Gawa App

**Control your money** — mobile-first personal finance PWA for budgeting, saving, debt payoff, and planning future purchases.

Default currency: **KES (Kenyan Shillings)**.

## Features

- **Dashboard** — income, spending, budget health, category donut, emergency fund, bills, recent txns, debt summary
- **Budget** — Needs / Wants / Savings / Debt, progress bars, 50/30/20 template, rollover
- **Transactions** — search, filters, M-Pesa-style keypad (≤2 taps to log)
- **Savings** — emergency fund (3–6 months expenses) + goals with suggested monthly contribution
- **Debts** — balances, payments, Snowball vs Avalanche planner
- **Future Planner** — wishlist, priority, required monthly saving, Move to Budget
- **Bills & Recurring** — due dates, mark paid → auto transaction
- **Reports** — charts, savings rate, net worth, CSV export
- **Settings** — currency, dark mode, reset
- **PWA** — installable, offline-friendly (localStorage)

## Quick start

```bash
cd gawa-app
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

## Stack

React 19 · TypeScript · Vite · Tailwind v4 · Zustand · Recharts · Lucide · vite-plugin-pwa

Data is stored in **localStorage**. Types match a Supabase-ready schema for later cloud sync.

## Design

| Token | Value | Use |
|-------|-------|-----|
| Primary | `#0B3D2E` | Forest green |
| Accent | `#D4A017` | Gold FAB |
| Background | `#F8F5EC` | Cream |
| Danger | `#C0392B` | Overspend / debt |
| Success | `#1E8E3E` | Income / progress |

## Supabase (optional upgrade)

Tables: `profiles`, `accounts`, `categories`, `transactions`, `recurring_items`, `savings_goals`, `savings_transactions`, `debts`, `debt_payments`, `wishlist_items`.

Enable RLS: `auth.uid() = user_id` on every table.

## License

Personal use.
