# unmask-store

OnMask **Standalone Commerce Platform** — Next.js app on Supabase (`Unmask stores`).

## Stack

- Next.js App Router (seller `/app`, brand `/brand`, storefront `/s/[slug]`)
- Supabase Auth + Postgres RLS
- Paystack (platform subscriptions via webhook-verified activation)

## Setup

1. Copy `.env.example` to `.env.local` and set Supabase + Paystack keys (see `.env.example`).
2. `npm install && npm run dev`

## Migrations

SQL under `supabase/migrations/` — target project `uczrdwfzbqwgysbqjuii`.

## V1 scope

Seller/brand accounts, plans, Paystack subscription webhook, store setup, products, public storefront, brand invitations, orders/customers foundations, RLS, OnMask integration stubs.
