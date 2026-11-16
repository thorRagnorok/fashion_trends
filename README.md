# THE DROP — Men's Fashion Trending (Affiliate)

Premium men's fashion discovery site with a single **Trending** feed (newest products first), product detail pages, Supabase-backed admin, affiliate click tracking, and basic analytics.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- Supabase (Postgres, Auth, Storage)
- Vercel (hosting)

## Quick start

1. **Install**

   ```bash
   npm install
   ```

2. **Supabase**

   - Create a project at [supabase.com](https://supabase.com).
   - Run `supabase/migrations/001_initial.sql` in the SQL editor.
   - Create an admin user under **Authentication → Users**.
   - Confirm email auth is enabled for email/password sign-in.

3. **Environment**

   ```bash
   cp .env.example .env.local
   ```

   Fill in URL, anon key, and service role key from **Project Settings → API**.

4. **Run**

   ```bash
   npm run dev
   ```

   - Public site: [http://localhost:3000](http://localhost:3000)
   - Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for folder layout, data flow, and security model.

## Deploy (Vercel)

1. Import the repo and add the same env vars as `.env.local`.
2. In Supabase **Authentication → URL configuration**, add your production site URL and `https://your-domain.com/auth/callback`.

## Affiliate clicks

`GET /api/go/[productId]` records a row in `product_clicks`, then redirects to the product's `affiliate_url` (query parameters preserved).