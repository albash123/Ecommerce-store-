# Commerce platform implementation plan

Goal: deliver and verify the requested fashion commerce platform using the user specification in `docs/request.md`.
Architecture: modular NestJS API with transactional PostgreSQL; independent Next.js storefront and admin.
Tech stack: TypeScript, Next.js, React, Tailwind, Framer Motion, Zustand, TanStack Query, RHF, Zod, NestJS, Prisma, PostgreSQL.

Global constraints: no hardcoded catalog/CMS content in frontend; integer money; backend authorization; preserve transaction history; no production secrets; original imagery; no inert buttons; responsive and reduced-motion support.

- [ ] Task 1 — Foundation and database: create workspace packages, schema and SQL migration; seed 24 products and variants, CMS, roles and business settings. Verify Prisma validation, migration and seed on PostgreSQL.
- [ ] Task 2 — API business modules: write behavioral tests for stock, pricing, discount boundaries and status transitions before implementation. Implement auth, permissions, catalog, customer features, checkout, payment webhooks, administration, content, storage and outbox. Verify with HTTP tests including concurrent checkout and forbidden permissions.
- [ ] Task 3 — Storefront: consume `packages/types` and documented endpoints. Build original editorial design with generated imagery, database-fed sections, listing/filter URLs, product selection, bag, wishlist, account and COD checkout. Verify browser flow and mobile layout.
- [ ] Task 4 — Admin: consume schema-described API resources and dedicated workflow endpoints. Build typed forms, product/variant editors, media upload, stock adjustment, order timeline, CMS section reorder, content/campaign/shipping/coupon editors and database reports. Verify create product -> storefront and order -> status history.
- [ ] Task 5 — Integrate and review: unit/integration/E2E tests, TypeScript, lint and production builds; review authorization, prices, stock concurrency and private data. Fix defects, document exact results and any unverified external integrations.

REST details and editor resource schemas live in `docs/api-contract.md`. Each task is reviewed for spec coverage and quality. Work runs directly in this new isolated project folder; the user explicitly requested immediate implementation.
