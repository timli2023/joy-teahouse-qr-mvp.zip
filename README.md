# Joy Teahouse QR Ordering MVP

A deployable starter for a 3-table, dine-in QR ordering flow with English / Arabic / Chinese menu labels, cash-at-counter checkout, an order dashboard, and basic menu management.

## What is included
- Customer page: `/order?table=01` (also `/`), language switch, product categories, cart, notes, submit order.
- Staff dashboard: `/admin`, protected by a manager PIN.
- Orders: table number, item snapshot, total, unpaid/paid, new/preparing/ready/served/cancelled.
- Menu management: add product, hide/reactivate product.
- Admin dashboard polls every 6 seconds so multiple staff devices see updates.

## Requirements
- Node.js 20.9+ (recommended)
- A Supabase project
- A deployment host such as Vercel

## Setup
1. Create a Supabase project at https://supabase.com.
2. In Supabase, open SQL Editor and run `supabase/schema.sql`.
3. In Supabase project settings, copy the Project URL and service-role key. Keep the service-role key private.
4. Copy `.env.example` to `.env.local` and fill:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_PIN` (use a long random value)
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` is included as a placeholder but not currently used by this server-side MVP.
5. Install and run:
   ```bash
   npm install
   npm run dev
   ```
6. Open `http://localhost:3000`. Admin dashboard is `http://localhost:3000/admin`.
7. Replace demo menu and prices in Supabase or add items in `/admin`.

## QR codes for tables
After deployment, print QR codes for:
- `https://YOUR-DOMAIN/order?table=01`
- `https://YOUR-DOMAIN/order?table=02`
- `https://YOUR-DOMAIN/order?table=03`

The customer route currently uses the home page and reads the `table` query parameter, so `/order?table=01` is an alias only if you add a rewrite. Easiest: print `https://YOUR-DOMAIN/?table=01` (and 02, 03).

## Deploy to Vercel
1. Push this project to a private GitHub repository.
2. Import the repository into Vercel.
3. Add the environment variables from `.env.local` in Vercel Project Settings.
4. Deploy, then test a real order on two separate devices.

## Important before real use
This is a functional MVP, not a fully hardened commercial POS. Before taking live customer orders:
- Replace demo products, translations and prices.
- Use a long random `ADMIN_PIN`; only share it with managers.
- Add stronger staff authentication (Supabase Auth), rate limiting, audit logs, backups and order cancellation/refund policy.
- Review local privacy, tax and e-payment requirements.
- The current starter limits table numbers to 1–3 and uses cash at counter.
- Product customization UI (cup size, sugar, ice and add-ons) is the next planned increment; the current cart sends a note and product quantities.
- Customer-facing order confirmation is shown on the submitting device; no SMS or push notification is configured.
- Do not expose `SUPABASE_SERVICE_ROLE_KEY` in browser code or any `NEXT_PUBLIC_` variable.

## Data and security
The API validates product IDs and calculates totals on the server using current database prices. Supabase service-role credentials are only read in server routes. RLS is enabled and there are no public direct-table policies.
