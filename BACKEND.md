# SRA Jewellers backend

The project now includes a server-side API under `src/app/api` and a local persistent store at `data/database.json`.

Implemented endpoints:

- `GET /api/products` and `GET /api/products/:slug`
- `GET /api/categories`, `/api/collections`, `/api/gold-rate`
- `POST /api/orders` and `GET /api/orders/:orderId`
- `POST /api/contact`
- `POST /api/custom-design-requests` (multipart upload, 8MB limit)
- `POST /api/newsletter`

Checkout, order tracking, contact, and custom-design forms are connected to these APIs. Orders, contact messages, design requests, and newsletter subscriptions persist in the `data` folder.

Razorpay flow is wired through `/api/payments/razorpay/order`, `/api/payments/razorpay/verify`, and `/api/payments/razorpay/webhook`. Add `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `RAZORPAY_WEBHOOK_SECRET` to `.env.local` or Vercel. Configure the Razorpay webhook URL as `https://your-domain.com/api/payments/razorpay/webhook` for `payment.captured` and `order.paid` events. The server verifies the checkout HMAC signature before marking an order as paid.

This file-based store is intended for local development only. Vercel Functions do not provide a persistent writable filesystem, so orders, accounts, sessions, and uploads must be moved to PostgreSQL/Supabase and object storage before production deployment. Vercel's own guidance recommends persistent storage for writes. See: https://vercel.com/kb/guide/why-does-my-serverless-function-work-locally-but-not-when-deployed

Do not commit `data/database.json` or `data/uploads/`; they are ignored for this reason. Before connecting customer credentials, rotate any test credentials and remove local customer data from the deployment workspace.

All future service settings are listed as empty placeholders in `.env.local.example`. Copy it to `.env.local` for local development and fill only the services that are available. Never commit `.env.local`.

Production database migration groundwork is available in `prisma/schema.prisma`. Follow `VERCEL_DATABASE.md` to provision PostgreSQL/Supabase and run Prisma migrations before switching the server adapter from the local JSON store.
