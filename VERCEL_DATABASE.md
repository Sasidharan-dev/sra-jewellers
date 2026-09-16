# Vercel database setup

The app uses `data/database.json` only for local development without a database. When `DATABASE_URL` is present on Vercel, authentication, profiles, orders, sessions, and wishlist data use PostgreSQL through Prisma.

## Supabase / PostgreSQL setup

1. Create a Supabase project.
2. Copy the pooled connection string into `DATABASE_URL`.
3. Copy the direct connection string into `DIRECT_URL`.
4. Keep both values server-only; never use them as `NEXT_PUBLIC_*` variables.
5. Every Vercel deployment runs `prisma db push` before the Next.js build, so the tables are created automatically.
6. For local database setup, run:

```bash
npx prisma generate
npx prisma migrate dev --name initial
```

For a hosted production database, run:

```bash
npx prisma migrate deploy
```

Then add the same `DATABASE_URL` and `DIRECT_URL` values in Vercel Project Settings → Environment Variables for Preview and Production.

Do not upload `data/database.json` or customer data to GitHub. Accounts created before PostgreSQL was enabled were stored only in temporary Vercel storage; create the customer account again after the first database-backed deployment.

## Production checklist

- Configure PostgreSQL/Supabase credentials.
- Run `prisma migrate deploy` during the deployment workflow.
- Move custom-design uploads to S3 or Cloudinary.
- Keep `AUTH_SECRET`, payment, email, and WhatsApp secrets in Vercel only.
- Test registration, order creation, admin status updates, and customer order history after deployment.
