# Vanta Commerce

A TypeScript fashion commerce monorepo: Next.js storefront, separate Next.js administration, NestJS REST API, and PostgreSQL/Prisma. Storefront catalog and homepage content are read from the API. The seeded fictional identity and original generated imagery are replaceable through business settings and content records.

## Applications

| Application | Local address | Source |
|---|---|---|
| Storefront | http://localhost:3000 | `apps/storefront` |
| Admin | http://localhost:3001/admin | `apps/admin` |
| REST API | http://localhost:4000/api | `apps/api` |
| API documentation | http://localhost:4000/api/docs | Development only |

See [architecture](docs/architecture.md), [REST contracts](docs/api-contract.md), [original specification](docs/request.md), [asset provenance](docs/asset-provenance.md), and [verification record](docs/verification.md).

## Prerequisites and setup

Use Node.js 22 or newer and pnpm 11.19.0. Docker is optional. The local PostgreSQL helper downloads native binaries as a development dependency; it creates a database only inside `.local/postgres` and binds it to loopback.

```sh
corepack enable
corepack prepare pnpm@11.19.0 --activate
pnpm install --frozen-lockfile
node scripts/setup-env.mjs
node scripts/run.mjs db:generate
```

`setup-env` preserves an existing `.env`; on first run it generates random local token secrets. `.env` and database files are ignored by Git. Review `.env.example` for all provider settings. Never use the development credentials for a public deployment.

Start PostgreSQL in a separate terminal:

```sh
node scripts/local-postgres.mjs
```

Alternatively start PostgreSQL and Redis with Docker:

```sh
docker compose up -d postgres redis
```

Apply committed migrations and seed the development database:

```sh
node scripts/run.mjs db:migrate
node scripts/run.mjs db:seed
node scripts/dev.mjs
```

The seed refuses production mode. It is idempotent and never truncates tables. It creates 24 products, 288 size/color variants, categories, collections, warehouse inventory, coherent sample orders and reviews, CMS sections, menus, settings, roles, and the `SEASON SHIFT` campaign. Stable seeded records may be updated on reseeding; use it on development databases.

### Local credentials

`setup-env.mjs` writes these explicitly development-only accounts:

- Admin: `admin@example.com` / `VantaDev2026!Change`
- Customer: consult `prisma/seed.ts` for seeded customer emails; password `CustomerDev2026!`

Override `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` and `SEED_CUSTOMER_PASSWORD` in `.env` before seeding to use your own local values. Production initialization must use a separately configured strong administrator password; the demo seed is prohibited there.

For a fresh production database, set `INITIAL_ADMIN_EMAIL`, `INITIAL_ADMIN_NAME`, and `INITIAL_ADMIN_PASSWORD` through your deployment secret manager, then run `node scripts/create-admin.mjs` after migrations. The password must contain at least 16 characters, uppercase, lowercase and a number. This command refuses to run when an administrator already exists. Remove the initial password from the environment after creation.

## Routine commands

```sh
node scripts/run.mjs typecheck
node scripts/run.mjs lint
node scripts/run.mjs test
node --test apps/storefront/src/lib/cart.test.mjs
node --env-file=.env tests/integration.mjs
node scripts/run.mjs test:e2e
node scripts/run.mjs build
```

Integration and browser tests require the database and all applications to be running. Integration tests create identifiable `QA` fixtures and exercise real database transactions, including racing two checkouts for one item. Browser tests use an installed Chrome browser. These commands do not connect to a production endpoint by default.

Start built applications individually:

```sh
node apps/api/dist/main.js
cd apps/storefront
node node_modules/next/dist/bin/next start -p 3000
# In another terminal, from apps/admin:
node node_modules/next/dist/bin/next start -p 3001
```

On Windows, the root runner uses explicit Node entry points to avoid shell shim/PATHEXT issues. API builds use TypeScript's decorator metadata; running the compiled API is preferred to transpile-only execution.

## Database changes

Edit `prisma/schema.prisma`, then use Prisma Migrate against a development database:

```sh
node node_modules/prisma/build/index.js migrate dev --name describe_change
node scripts/run.mjs db:generate
```

Commit generated SQL under `prisma/migrations`. Deploy with `migrate deploy`; do not use `db push` as a production migration workflow. Back up the database before migration and rehearse restoration.

All money is integer currency minor units: PKR 3,490 = `349000`. Tax rates are basis points: 18% = `1800`. Variant weight is grams. UTC timestamps are stored in PostgreSQL; the editor displays local datetime fields.

## Operations

- Products: create category, product, unique variant SKUs, prices and stock; publish with `ACTIVE`. Archive products with historical order/inventory references instead of deleting them.
- Inventory: stock is tracked by variant and warehouse; adjustments require a reason and create immutable ledger entries. Checkout calculates prices and stock inside a serializable transaction.
- Orders: review snapshots and history, change permitted fulfillment status, add tracking, confirm bank-transfer receipt, and record refunds. COD capture is recorded at delivery.
- CMS: edit section content/configuration, order, enabled state and schedule. Edit nested menus, page blocks and site settings without modifying source code.
- Campaigns: `SCHEDULED` or `ACTIVE` records are publicly available only during their configured UTC interval. Visibility is evaluated when content is requested, not dependent on a cron tick.
- Roles: permissions are checked on the API and used to hide unavailable admin actions. Administrators cannot delegate privileges they do not possess.
- Reports: revenue, order counts, product/category/collection sales and coupon usage are derived from database orders. Collection totals may overlap when a product belongs to multiple collections.
- CSV: exports stream paginated records; spreadsheet formula prefixes are escaped. Product imports accept up to 100 rows and return per-row errors. `variants`, `images`, `tags`, and `collectionIds` columns contain JSON.

## Media storage

Set `S3_ENDPOINT`, `S3_REGION`, `S3_BUCKET`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`, and `S3_PUBLIC_URL`. AWS S3 and Cloudflare R2 use the same adapter. The bucket's public/CDN URL must allow reading the uploaded media. Uploads require `cms.manage`; image files are decoded, checked, converted to WEBP and given thumbnails. Max image input is 10 MB / 40 million pixels; video input is capped at 50 MB. No raw uploads are stored inside the application server.

Without storage credentials, the Media library can register existing HTTP(S) media URLs, and local original seed assets remain usable. Upload attempts report a configuration error.

## Payments and shipping

COD and bank transfer are available locally. Configure public bank instructions in site settings. Confirm bank transfers only after external receipt; recording an offline refund requires an external payment reference.

For Stripe, set `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`, and register `/api/payments/stripe/webhook` with Stripe. Payment status comes from signed server-side events; card data never reaches this application. Use provider test mode and verify successful, declined, expired and retried payments before enabling live keys. Regional payment adapters can be introduced beside `PaymentService`.

Shipping methods support country/city targeting, gram weight bounds, order value bounds, flat rates, free thresholds and COD eligibility. Tax rules are configured by country and product tax class with inclusive/exclusive pricing. Coupons support scope restrictions, percentage/fixed/free-shipping/buy-X-get-Y discounts, caps, dates and usage limits.

## Email and notifications

`EMAIL_PROVIDER=outbox` stores transactional messages without sending mail. Set `EMAIL_PROVIDER=resend`, `EMAIL_API_KEY` and a verified `EMAIL_FROM` for delivery. Never point development testing at real customer addresses. The outbox worker retries failures; email templates are editable in admin. Verification/reset links are only in the private outbox, never returned by public authentication endpoints. Development administrators with `settings.manage` can access `/admin/email-preview/:id` for a known outbox record.

## Deployment

Storefront and admin are separate Next.js deployments (Vercel or any Node host). Set `NEXT_PUBLIC_API_URL` before frontend build, `API_URL` for storefront server fetches, `NEXT_PUBLIC_STOREFRONT_URL` for admin media previews, and `APP_URL` for metadata. Host the NestJS API on a Node/Docker provider with managed PostgreSQL, optional Redis and external object storage.

Use HTTPS and same-site subdomains for storefront/admin/API so secure HttpOnly `SameSite=Lax` cookies work. Set `NODE_ENV=production`, strong independent JWT secrets, exact `APP_URL` / `ADMIN_URL` origins and `BIND_ADDRESS=0.0.0.0` behind your reverse proxy. Public storefront settings deliberately exclude arbitrary private keys. CORS and Origin checks protect cookie-authenticated writes. The API listens only on loopback by default.

```sh
docker compose up --build api
```

The provided Compose file is a local environment, not a substitute for production TLS, secret management, monitoring and backups. The Docker API image runs as a non-root user and applies committed migrations at startup. Review [verification](docs/verification.md) for which external services have actually been tested.

## Troubleshooting

- Database unreachable: start the local PostgreSQL terminal or Docker services; check `DATABASE_URL` and port `54329`.
- Native PostgreSQL fails under a restricted Windows runner: run the documented helper in your normal user terminal or use Docker; never change system account privileges for the application.
- Prisma missing generated client: rerun `db:generate` after installation or schema changes.
- Empty storefront: verify API `/api/health`, run migrations/seed, and confirm `API_URL` and `NEXT_PUBLIC_API_URL`.
- Cookie login fails: use the exact configured hosts, keep all local apps on `localhost`, and use HTTPS for production.
- Media upload unavailable: configure the storage environment and bucket public URL.
- Tax/shipping mismatch: verify amounts are in minor units, weights in grams and country codes uppercase ISO two-letter codes.
- Editor rejects product deletion: historical orders and stock transactions are protected; archive the product.
- Dependency policy prompt: allowed native build dependencies are declared in `pnpm-workspace.yaml`. Do not bypass your organization's package policy.
