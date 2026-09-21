# Local verification — 17 September 2026

This is a working local commerce implementation, not a declaration that the entire 106-section specification or a production launch is complete.

## Executed checks

| Check | Result |
|---|---|
| PostgreSQL initialization, committed migration application and Prisma generation | Passed; native local database on port 54329 |
| Development seed and repeat seed | Passed; 24 stable catalog products, 288 variants, five categories; no table truncation |
| Nest API TypeScript compilation | Passed |
| Storefront production build | Passed after mobile-footer and curated-product fixes |
| Admin production build | Passed |
| ESLint | Passed with no errors or warnings |
| Vitest with `RUN_INTEGRATION=1` | 24 passed, zero skipped |
| Standalone cart unit tests | 6 passed |
| Database mutation scenarios | 18 passed |
| Live admin Chrome smoke | Passed: authentication, dashboard, product editor, category create/delete, homepage/menu/page/settings saves, reports, no browser exceptions |
| Admin Chrome fixture contracts | Passed in the earlier implementation stage |
| Browser COD checkout | Passed: product selection, cart, quote, placement, guest confirmation |
| Browser mobile shop | Passed: 375px layout, filter opening, stock filtering and closing |
| Browser curated homepage and shop-the-look | Passed: four configured products, marker dialog and product link |

The HTTP scenarios verify server-owned prices, duplicate-line aggregation, two competing checkouts for one unit, order replay, guest access control, cancellation/restocking once, CSRF rejection, role escalation rejection, CMS propagation, session rotation and logout. Every authorized resource list is also exercised. Additional scenarios cover average-rating sorting/pagination, persistent wishlist/cart/addresses, administrator coupon configuration and future/current/expired campaign windows with audit records.

`tests/cleanup-fixtures.mjs` archives only locally generated QA products and disables QA accounts, retaining orders and audit records. Browser purchases remain in the development database as test orders.

## Defects found through integrated verification

- Seed shipping countries used a full name while the API and storefront accept two-letter country codes. Seed data now uses `PK`.
- The mobile footer's newsletter imposed a grid minimum wider than the viewport. Grid children and the input can now shrink.
- CMS Pages sorting referred to a nonexistent `createdAt` field. It now uses `updatedAt`.
- Curated homepage product IDs were intersected with a collection filter. Explicit selections now take precedence.
- Administrator deletion lacked the existing-role privilege check used by edits. Deletion now checks target permissions and rejects customer IDs through that endpoint.

## Remaining work and limitations

- Stripe, Resend and S3/R2 credentials are absent. Real card payments, provider refund reconciliation, delivered email and binary uploads have not been tested against those providers. COD and registered image URLs work locally.
- Docker is unavailable in this environment. Docker configuration is supplied but was not executed; no public deployment was performed.
- Product videos, shop-the-look markers and fit/material/tag/rating controls have now been implemented. Broader device/accessibility coverage and real video-provider playback remain unverified. Rating filtering currently aggregates matching product IDs in the API; large catalogs need measured query/response benchmarks.
- Partial refunds are not allocated to individual return requests. Return-refunded status currently requires the full order value to be refunded.
- Guest order tokens remain coupled to the refresh secret. See the security review for token-lifecycle limitations and payment reconciliation follow-up.
- Load tests, independent penetration testing, production backup restoration, mail/domain setup, monitoring and production operational validation remain outstanding.
- The first-admin command was checked for missing-secret rejection. Creation in a fresh production database was not exercised; the current development database already contains administrators.

## Reproduce

Start the local database and applications as described in the README. Run:

```sh
node scripts/run.mjs lint
node scripts/run.mjs test
node --test apps/storefront/src/lib/cart.test.mjs
node --env-file=.env tests/integration.mjs
node --env-file=.env apps/admin/tests/live-smoke.mjs
node scripts/run.mjs test:e2e
node scripts/capture-preview.mjs
```

Set `RUN_INTEGRATION=1` to enable the four database-backed Vitest checks. The separate integration script already runs its database scenarios unconditionally against a local API. Preview images are in `docs/previews`.
