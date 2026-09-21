# Vanta Commerce architecture

The requested stack is retained: independently deployable Next.js storefront and admin, a modular NestJS REST API, and PostgreSQL through Prisma. A modular monolith keeps checkout, inventory, coupon redemption and order history in one transaction. Splitting these into networked services would increase operational complexity without improving this initial business workflow.

## Data and security

All money is integer minor units (PKR paisa). Public product prices, stock and CMS records come from PostgreSQL. Checkout accepts variant identifiers, quantities, address, shipping method and coupon only. Serializable transactions and conditional stock updates reject overselling; unique idempotency keys prevent duplicate orders. Order snapshots preserve historical prices. Auth uses bcrypt, short-lived JWT access cookies, rotating opaque refresh cookies stored hashed, CSRF origin checks and RBAC guards. Guest orders require an unguessable access token.

## Structure

- `apps/storefront`: server-rendered catalog, product and CMS routes; client interactions for bag, search, checkout and account.
- `apps/admin`: separate Next.js application with permission-aware navigation and API-backed business editors.
- `apps/api/src`: auth, catalog, commerce, content, administration, media and communications modules with focused services.
- `packages/types`: public REST contracts; `packages/validation`: shared input schemas; `packages/ui`: shared primitives; `packages/config`: reusable defaults.
- `prisma`: normalized schema, committed SQL migrations and deterministic development seed.
- `tests`: business unit tests, HTTP integration tests, browser purchase flow.
- `docs`: API, deployment, verification and operational guidance.

## Routes and contracts

API prefix `/api`. Responses are `{success:true,data}` and errors `{success:false,message,errors}`. Lists return `{items,total,page,pageSize,pages}`. Public routes include `/content`, `/products`, `/products/:slug`, `/categories`, `/collections`, `/campaigns/:slug`, `/pages/:slug`, `/shipping`, `/checkout/quote`, `/checkout`, `/orders/:id?token=...`, `/reviews`, `/newsletter`, `/contact`. Authentication uses `/auth/register`, `/auth/login`, `/auth/logout`, `/auth/refresh`, `/auth/me`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/verify-email`. Account routes use `/account/orders`, `/account/addresses`, `/account/wishlist`, `/account/cart`, `/account/returns`.

Storefront pages: `/`, `/shop`, `/men`, `/women`, `/[gender]/[category]`, `/product/[slug]`, `/collections/[slug]`, `/campaign/[slug]`, `/search`, `/cart`, `/wishlist`, `/checkout`, `/order/[id]`, `/account`, `/account/orders`, `/pages/[slug]`, `/contact`. Admin runs on port 3001 under `/admin` and includes dashboard, products, categories, collections, inventory, orders, customers, campaigns, coupons, discounts, homepage, pages, menus, media, reviews, shipping, taxes, users, roles, settings, audit, returns, refunds, reports, newsletter and inquiries.

## Integrations

S3/R2 media adapter validates file type and size and keeps binaries out of the application filesystem. Stripe uses server-created Checkout sessions and signed, idempotent webhooks. COD and bank transfer use explicit payment states. Email uses a database outbox and configurable provider, with development preview restricted to administrators. Redis is optional for public content caching; personalized data is never cached. Scheduled campaigns are evaluated by time at query time, so restart or scheduler downtime cannot leave expired campaigns visible.

## Delivery scope

The build will be verified locally. Live payment, mail, object storage and production deployment require the operator's provider credentials. Development placeholders must be clearly documented. A successful build alone is not a production security or load certification.
