# First production deployment

Deploy the API with `DATABASE_URL`, distinct strong `JWT_SECRET` and
`JWT_REFRESH_SECRET`, `NODE_ENV=production`, and the final HTTPS storefront and
admin origins in `APP_URL` and `ADMIN_URL`. The API Vercel build command already
generates Prisma, compiles the validation package and API, and applies migrations.

Use the database integration's production connection string. Do not substitute
the development `.env` database. From the repository root, with `DATABASE_URL`
and `APP_URL` explicitly supplied in the process environment:

```sh
node node_modules/prisma/build/index.js generate
node node_modules/prisma/build/index.js migrate deploy
node --experimental-strip-types scripts/bootstrap-production.mjs
```

The first bootstrap also requires `INITIAL_ADMIN_EMAIL`, `INITIAL_ADMIN_NAME`
and `INITIAL_ADMIN_PASSWORD` (10 or more characters containing uppercase,
lowercase and a number). Supply those through secret environment settings, never
in source or command arguments. Remove `INITIAL_ADMIN_PASSWORD` after success.
An existing administrator and its credentials are preserved on subsequent runs.

The bootstrap creates the Vanta catalog, menus, CMS pages, homepage sections,
promotions and default Pakistan shipping configuration. Image URLs point to
`APP_URL`, including when displayed in the separate admin application. It does
not create customer accounts, orders, payments, or reviews. New inventory starts
at zero; enter actual available stock through the admin panel before accepting
orders. Existing records, stock and content edits are preserved. The bootstrap
runs in a single transaction and rolls back on failure.

Do not run `prisma/seed.ts` against production. It is a development fixture that
inserts fictional sales and reviews and resets existing seeded data. Do not add
either seed script to the normal build command.

For each Next.js deployment, set `API_URL` to the live API URL ending in `/api`
and `NEXT_PUBLIC_API_URL=/api`, then rebuild so the same-origin rewrite is
included. For the storefront also set `NEXT_PUBLIC_ADMIN_URL` to the live admin
URL ending in `/admin` and `NEXT_PUBLIC_SITE_URL` to its own HTTPS origin.

After deploying, verify `/api/health` reports `database: connected`, `/api/content`
contains the CMS data, the homepage shows catalog images, and admin sign-in works
through the same-origin API proxy. `EMAIL_PROVIDER=outbox` only stores messages;
email delivery, card payments and uploads require their separate provider
configuration.
