# Hands of Hope Foundation — Website

**Extending Hands. Inspiring Hope.**

A production-quality, CMS-driven website for a Kenyan community foundation, built with **Next.js 15 (App Router) + TypeScript + Tailwind CSS**.

---

## Quick start

```bash
npm install

# 1. Configure .env (see .env.example):
#      ADMIN_PASSWORD=your-secret-password     (required for /admin)
#      ADMIN_SESSION_SECRET=any-long-random-string
#      DATABASE_URL=postgres://postgres:PASSWORD@localhost:5432/handsofhope

npm run dev        # development → http://localhost:3000
npm run build && npm run start   # production
```

On first run the app creates its schema and seeds starter content into PostgreSQL automatically.

| Area | URL |
|---|---|
| Public site | `http://localhost:3000` |
| Admin dashboard | `http://localhost:3000/admin` |
| Sitemap / Robots | `/sitemap.xml`, `/robots.txt` |

---

## Database — PostgreSQL

All content is stored in **PostgreSQL** (documents in a `content` table: `collection`, `id`, `data JSONB`).

- **Local development:** set `DATABASE_URL` in `.env` to your local server (e.g. `postgres://postgres:PASSWORD@localhost:5432/handsofhope`). Create the database once — schema and seed data are applied automatically.
  - No Postgres installed? Leave `DATABASE_URL` unset and `npm run dev` boots an **embedded PostgreSQL** daemon on `localhost:5433` (data in `./.pgdata`) instead.
- **Production:** point `DATABASE_URL` at any managed Postgres (Neon, Supabase, RDS…). Run `npm run db` to verify connectivity before deploying.
- Backup = standard `pg_dump`.

## What's inside

### Public pages
- **Home** — cinematic hero, animated impact statistics, who-we-are, six program cards, featured initiative, ways to help, sustainability model, stories, transparency, corporate partnerships, volunteer CTA, newsletter.
- **About** — story, mission/vision, values, leadership, governance, where we work (map).
- **Programs** index + full detail page per program (objectives, activities, impact, gallery, related projects).
- **Projects** index + detail pages with progress tracking and galleries.
- **Impact** — statistics, live project progress, reports, stories.
- **Stories** index + article pages (JSON-LD `Article` schema).
- **Get Involved** — volunteer application form, partnership, fundraising, careers.
- **Shop** — branded merchandise with order flow (no payment required upfront).
- **Donate** — one-time/monthly giving, presets + custom amounts, project designation, anonymous option.
- **Contact**, **Transparency**, **Safeguarding**, **Privacy**, **Terms**, custom 404 & error pages.

### Admin dashboard (`/admin`)
Password-protected (signed HttpOnly cookie). Manage:

Homepage copy · Impact statistics · Programs · Projects · Stories · Team members · Partners · Events · Shop products · Reports & policies · Contact enquiries · Newsletter subscribers · Volunteer applications · Donations · Shop orders · Site settings (emails, phone, socials).

> Content lives in PostgreSQL (see above). The admin dashboard manages it all — no code edits needed for day-to-day content.

### Honesty by design
- No fabricated testimonials, partner logos, certificates or registration numbers anywhere.
- Seeded stories are clearly labelled **"Illustrative"** until replaced with verified, consented stories.
- Team and partners collections ship **empty** rather than fake.
- A donation is only ever marked *confirmed* after payment verification.

---

## Payments architecture (M-Pesa ready)

See `src/lib/payments.ts`. The site ships with a **pending-manual provider**: giving intentions are recorded and staff complete them offline. To go live:

1. Implement the `MpesaProvider` class using Safaricom Daraja (STK Push + C2B confirmation callback).
2. Add credentials: `MPESA_CONSUMER_KEY`, `MPESA_SHORTCODE`, etc., and set `PAYMENT_PROVIDER=mpesa`.
3. Confirmation callbacks flip intents from `pending` → `confirmed` **only after provider verification** — the UI never claims success before that.

The same interface supports Stripe/PayPal/Flutterwave later.

## Analytics

Set `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX` to enable Google Analytics 4 automatically.

## Environment variables

| Variable | Purpose |
|---|---|
| `ADMIN_PASSWORD` | Admin login password (**required**) |
| `ADMIN_SESSION_SECRET` | Secret used to sign admin sessions |
| `DATABASE_URL` | PostgreSQL connection string (embedded local PG used if unset) |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for SEO/sitemap/OG |
| `NEXT_PUBLIC_GA_ID` | Optional GA4 measurement ID |
| `PAYMENT_PROVIDER` | `pending-manual` (default) or `mpesa` |
| `PAYSTACK_SECRET_KEY` | Paystack live/test secret key — donations switch to Paystack hosted checkout automatically when set |

### Paystack donations flow

1. Donor submits the form → intent recorded in Postgres (`status: pending`).
2. Server calls Paystack **Transaction Initialize** and redirects the donor to the hosted checkout (cards, bank, mobile money).
3. Paystack redirects back to `/donate/callback?reference=…`.
4. The server re-verifies the transaction directly with Paystack — only a verified `success` with a matching amount marks the gift `confirmed`. Anything else stays pending/failed and is shown honestly to the donor.

## Content & imagery

- All photography is hot-linked from Unsplash (every URL was verified working at build time). Replace with your own real programme photography via the admin image fields — stock photos should be a temporary stand-in for genuine, consented imagery.
- The logo is an original SVG (`src/components/Logo.tsx`, favicon at `src/app/icon.svg`). Swap in the official brand mark there when available.
- Emails/phone in **Admin → Site Settings** are placeholders — update once official addresses exist.

## Security notes

- Forms: server-side validation, honeypot fields, per-IP rate limiting.
- Admin: timing-safe password check, HMAC-signed session cookies, all API mutations guarded; admin pages are `noindex`.
- Security headers set in `next.config.mjs`.

## Project structure

```
src/
├── app/               # routes (public, api, admin)
├── components/        # site UI, home sections, admin UI
├── lib/               # db (PostgreSQL), auth, payments, forms, config
├── data/seed.ts       # starter content (seeded into PG on first run)
└── types.ts           # shared content models
scripts/               # PostgreSQL launcher + embedded daemon
```
