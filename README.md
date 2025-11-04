# Stripe Playground Demo

A comprehensive Next.js + TypeScript demo showing many Stripe payment flows. Uses the App Router, Tailwind CSS, Zod validation, and optional Prisma/Postgres for event storage.

Important notes:
- Secrets are never exposed to the client. Use environment variables. No credentials are hardcoded.
- DB is optional via `ENABLE_DB`. Without DB, webhooks are not persisted but still handled.
- Mock mode via `USE_MOCK_STRIPE=true` allows running the UI without real Stripe keys.

## Quickstart

1) Install

```bash
pnpm install
# or npm install
```

2) Setup environment

Copy `.env.example` to `.env.local` and fill values:

- `STRIPE_SECRET_KEY` (server secret)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (publishable)
- `STRIPE_WEBHOOK_SECRET` (from Stripe CLI or dashboard)
- Toggle `ENABLE_DB`, `ENABLE_CONNECT`, `USE_MOCK_STRIPE` as needed

3) (Optional) DB + Prisma

```bash
# If using DB
pnpm dlx prisma migrate dev --name init
```

4) Run dev

```bash
pnpm run dev
# http://localhost:3000
```

## Scripts

- `dev` - start Next.js dev server
- `build`/`start` - production build & run
- `seed` - seed Stripe sample products/prices/coupons
- `test` - run Playwright tests
- `lint`/`format` - code quality

## Major Pages

- Home: overview and navigation
- Checkout: create Checkout Sessions
- Payment Element: on-site element flow
- Card Element: manual card confirm
- Payment Request Button: Apple Pay / Google Pay
- REST API: server endpoints and curl
- Iframe integration: postMessage pattern
- Subscriptions: plans and trials
- One-time direct payment: simple charge
- Saved payment methods: setup + reuse
- Billing: invoices + hosted portal
- Webhooks: receive and list events
- Connect: account + transfers (when enabled)
- Customers: portal and metadata
- Advanced: SCA/3DS, Tax, Multi-currency
- Dev Tools: raw request console

## REST Endpoints (initial)

- `POST /api/stripe/payment_intents` - create a PaymentIntent
- `POST /api/stripe/checkout_sessions` - create a Checkout Session
- `POST /api/webhooks/stripe` - webhook receiver (verification enabled if `STRIPE_WEBHOOK_SECRET` is set)

More endpoints (subscriptions, setup intents, ephemeral keys, connect) follow the same validation pattern and can be added similarly.

## cURL Examples

```bash
# Create PaymentIntent
curl -sX POST http://localhost:3000/api/stripe/payment_intents \
  -H 'Content-Type: application/json' \
  -d '{"amount": 2000, "currency": "usd"}'

# Create Checkout Session
curl -sX POST http://localhost:3000/api/stripe/checkout_sessions \
  -H 'Content-Type: application/json' \
  -d '{"mode": "payment", "quantity": 1}'
```

## Webhooks

Use Stripe CLI to forward events:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Set `STRIPE_WEBHOOK_SECRET` to the secret printed by the CLI.

## Testing

Playwright is configured. Example smoke tests visit the Home page. Run:

```bash
pnpm test
```

## Mapping Notes

- Legacy Charges API is not used; examples use Payment Intents, Checkout Sessions, Billing Portal, and Subscriptions APIs.
- SCA/3DS uses `stripe.confirmPayment` with Payment Element.

## Security

- All secret key usage is server-side.
- Input validation is done using Zod.
- Webhook signatures are verified when `STRIPE_WEBHOOK_SECRET` is set.

## License

MIT

