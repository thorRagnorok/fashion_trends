# Architecture — Men's Fashion Trending (Affiliate Discovery)

## System overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Vercel (Next.js 16)                       │
├─────────────────────────────────────────────────────────────────┤
│  Public (RSC)          │  Admin (RSC + Client)  │  API Routes   │
│  /                     │  /admin/*              │  /api/go/[id] │
│  /product/[id]         │  Supabase Auth         │  click + 302  │
└────────────┬───────────┴───────────┬────────────┴───────┬───────┘
             │                       │                    │
             └───────────────────────┼────────────────────┘
                                     ▼
                    ┌────────────────────────────────┐
                    │ Supabase (Postgres + Auth +    │
                    │ Storage bucket: product-images)│
                    └────────────────────────────────┘
```

**Data flow (Shop Now):** Visitor → `GET /api/go/:productId` → insert `product_clicks` → HTTP redirect to stored `affiliate_url` (parameters preserved).

**Trending feed:** `products` where `is_published = true`, ordered by `created_at DESC` (newest always on top).

## Folder structure

```
src/
├── app/
│   ├── layout.tsx                 # Root fonts, metadata
│   ├── globals.css
│   ├── page.tsx                   # Homepage = Trending only
│   ├── product/[id]/page.tsx      # Product detail
│   ├── api/go/[productId]/route.ts
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   ├── products/...
│   │   └── analytics/page.tsx
│   └── auth/callback/route.ts
├── components/
│   ├── layout/Header.tsx
│   ├── products/...
│   └── admin/...
├── lib/
│   ├── constants.ts
│   ├── types.ts
│   ├── products.ts                # Data access helpers
│   ├── analytics.ts
│   └── supabase/...
├── middleware.ts
supabase/migrations/001_initial.sql
```

## Database schema

See `supabase/migrations/001_initial.sql` for full DDL, indexes, RLS, and storage policies.

### Tables

| Table | Purpose |
|-------|---------|
| `products` | Core catalog (no price fields) |
| `product_images` | Optional gallery rows per product |
| `product_clicks` | Affiliate click events (`product_id`, `clicked_at`) |

### Key columns (`products`)

- `name`, `brand`, `category`, `description`
- `image_url` (primary)
- `affiliate_url`, `platform` (`myntra` \| `ajio` \| `amazon` \| `flipkart` \| `other`)
- `tag` (`trending` \| `new_arrival` \| `editors_pick` \| null)
- `is_published`, `created_at`, `updated_at`

### Security model

- **Public:** read published products + images; no direct click inserts (clicks via API + service role).
- **Admin:** Supabase Auth user; full CRUD on products; storage upload to `product-images`.

## Design tokens

- Neutral stone/black palette, editorial typography (Syne + DM Sans), generous whitespace, subtle hover transitions on cards.