# Vercel database setup

The app currently uses `data/database.json` for local development. The Prisma schema in `prisma/schema.prisma` is the production PostgreSQL blueprint.

## Supabase / PostgreSQL setup

1. Create a Supabase project.
2. Copy the pooled connection string into `DATABASE_URL`.
3. Copy the direct connection string into `DIRECT_URL`.
4. Keep both values server-only; never use them as `NEXT_PUBLIC_*` variables.
5. Run locally before deployment:

```bash
npx prisma generate
npx prisma migrate dev --name initial
```

For a hosted production database, run:

```bash
npx prisma migrate deploy
```

Then add the same `DATABASE_URL` and `DIRECT_URL` values in Vercel Project Settings → Environment Variables for Preview and Production.

## Important migration note

The current API still uses the JSON adapter so the portfolio demo works without credentials. Before using this as a live shop, replace the functions in `src/lib/server/db.ts` with Prisma queries and migrate existing local data manually. Do not upload `data/database.json` or customer data to GitHub.

## Production checklist

- Configure PostgreSQL/Supabase credentials.
- Run `prisma migrate deploy` during the deployment workflow.
- Move custom-design uploads to S3 or Cloudinary.
- Keep `AUTH_SECRET`, payment, email, and WhatsApp secrets in Vercel only.
- Test registration, order creation, admin status updates, and customer order history after deployment.
