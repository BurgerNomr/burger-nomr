# Burger Nomr

## Overview

Burger Nomr is Cape Town's halaal burger review platform. A mobile-optimised web app built with React + Vite on the frontend and Express + Drizzle ORM on the backend. Supabase handles authentication.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **Frontend**: React + Vite (artifacts/burger-nomr)
- **Backend**: Express 5 (artifacts/api-server)
- **Database**: PostgreSQL (Replit DB) + Drizzle ORM
- **Auth**: Supabase (email/password)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Design System

- **Background**: #FDF6EE (warm cream)
- **Primary/CTA**: #E8420A (orange-red)
- **Dark/text**: #1A1208 (near black)
- **Muted**: #7A6A58 (warm brown)
- **Display font**: Bebas Neue
- **Body font**: DM Sans
- **Mobile-first**: max-width 430px, bottom navigation

## Pages

- `/` — Home: hero, recent restaurants, quick actions
- `/explore` — Explore/Search: search + area filter
- `/map` — Map: restaurants grouped by Cape Town area
- `/top10` — Top 10 Leaderboard: ranked by Nom+ score
- `/restaurant/:id` — Restaurant detail + reviews
- `/profile` — User profile + review history
- `/settings` — Settings + sign out
- `/rate/:restaurantId` — Multi-step Nom+ rating flow (Patty / Bun / Sauce / Value)
- `/submit` — Submit a new restaurant

## Database Tables

- `restaurants` — id (uuid), name, area, address, description, image_url, price_range, tags[], latitude, longitude, created_at
- `reviews` — id (uuid), restaurant_id, user_id, user_name, user_avatar, overall_rating, patty_rating, bun_rating, sauce_rating, value_rating, comment, created_at
- `users` — id (text/supabase uid), name, email, avatar_url, joined_at

## Nom+ Rating System

Reviews rate 4 dimensions (1–5): Patty, Bun, Sauce, Value. Overall = average of the 4.

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks
- `pnpm --filter @workspace/db run push` — push DB schema changes
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Environment Variables

- `SUPABASE_URL` — Supabase project URL (secret)
- `SUPABASE_ANON_KEY` — Supabase anon/public key (secret)
- `DATABASE_URL` — Replit PostgreSQL connection string (auto-managed)
- `SESSION_SECRET` — Express session secret (secret)
