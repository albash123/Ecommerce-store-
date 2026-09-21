# API security and commerce integrity review

Scope: `apps/api/src` and `prisma/schema.prisma`, reviewed 2026-09-16. Findings are ordered by practical impact.

## Remediation status — 2026-09-17

The findings below preserve the original review. Their current disposition is:

- Late Stripe success: implemented durable capture, pending automatic refund, provider idempotency and signed refund reconciliation. Provider credentials are not configured, so live Stripe behavior remains unverified.
- Ambiguous refunds: pending attempts reserve the refundable amount; only definitive provider rejections release it. Signed refund events reconcile successful attempts. Unknown results require operational follow-up.
- Privilege escalation: user and role writes check both current and proposed permissions. Administrator and role deletion also reject targets beyond the actor's permissions; customer IDs cannot be deleted through the administrator endpoint. Unit tests cover deletion denials; HTTP integration covers role-assignment escalation.
- Coupon identity: authenticated eligibility and usage are tied to the account, with canonical email matching historical guest purchases. Guest email ownership is not verified at checkout.
- Stripe replay: retrieves an existing session URL or repeats session creation with stable order-based parameters and provider idempotency. Metadata can reconnect a signed event when the provider ID was not persisted.
- Customer DTO: provider IDs and internal notes are omitted. Explicit administrator views retain operational information.
- Return refund state: conservatively requires the whole order's value to be refunded. Per-return refund allocation remains unimplemented and requires a schema/workflow extension.
- Guest access HMAC: remains an open design limitation. Tokens use a secret HMAC and stored hash, but rotation is coupled to the refresh secret. A dedicated rotating token key or encrypted independent random token is still required before claiming complete token lifecycle support.

Current verification is documented separately in `verification.md`. These changes do not constitute an independent penetration test or production certification.

## P0 — A late Stripe success can charge the customer after inventory was released

**Locations:** `apps/api/src/commerce/payment.service.ts:16`, `apps/api/src/commerce/payment.service.ts:20`

**Scenario:** `releaseExpired` or a concurrent cancellation changes an unpaid order to `CANCELLED` and restocks it. A delayed `checkout.session.completed` event then arrives with `payment_status=paid`. The webhook throws `Late payment requires reconciliation`, leaving the order cancelled and stock available even though Stripe captured money. Stripe retries do not resolve the state. The same units can be sold again while the first customer remains charged.

**Fix:** Treat a verified late payment as a durable reconciliation state in the same transaction. Either atomically re-reserve stock and restore/confirm the order when stock is still available, or create an idempotent automatic refund and mark the order `REFUND_PENDING`/`REFUNDED`. Persist the Stripe event before returning and alert operations; do not leave a paid event as an endlessly retried 4xx response.

## P1 — Ambiguous Stripe refund failures can issue duplicate refunds

**Location:** `apps/api/src/commerce/orders.service.ts:17-19`

**Scenario:** Stripe accepts a refund, but the API call times out or the process loses the response. The catch block marks the local refund `FAILED`. A subsequent admin retry creates a new refund row and therefore a new Stripe idempotency key (`refund.id`), allowing the same amount to be refunded twice.

**Fix:** Keep ambiguous attempts in `PROCESSING`/`UNKNOWN`, persist a stable business idempotency key before the provider call, and reconcile by that key or payment intent before permitting another refund. Handle Stripe refund webhooks and only mark `FAILED` for a definitive provider rejection.

## P1 — `users.manage` can be escalated to full super-admin access

**Locations:** `apps/api/src/admin/admin.service.ts:40-43`; `apps/api/src/common/security.ts:21`

**Scenario:** The role editor prevents a non-super-admin from placing `*` in a role, but the admin-user editor accepts any `roleId`. An administrator with `users.manage` can PATCH their own user and assign an existing role containing `*`, immediately bypassing every permission check.

**Fix:** When creating or updating admin users, load the target role and reject assignment of a `*` role unless the actor already has `*`. Also prevent non-super-admin actors from modifying/deleting super-admin users or changing their roles. Consider a non-delegable `isSystem`/privilege-rank field rather than inferring privilege from an editable string array.

## P1 — Authenticated customers can bypass coupon per-customer and first-order limits

**Location:** `apps/api/src/commerce/checkout.service.ts:20`

**Scenario:** Coupon eligibility and prior usage are keyed only by the caller-supplied checkout email. A signed-in customer can submit a new alias/email on every checkout while orders remain attached to the same `userId`, repeatedly redeeming `WELCOME10` or another first-order/per-customer coupon. Customer allowlists can also be evaluated against an email different from the authenticated account.

**Fix:** For authenticated checkout, require `input.email === principal.email` or overwrite it server-side, and count coupon/order usage by `userId` with normalized email as a guest fallback. For guests, store explicit coupon redemptions against a normalized identity and enforce limits transactionally with a unique constraint.

## P1 — Checkout idempotency replay can strand Stripe orders

**Locations:** `apps/api/src/commerce/checkout.service.ts:31-38`; `prisma/schema.prisma:240-272`

**Scenario:** If the first Stripe checkout response is lost after the order/session is created, retrying the same idempotency key returns the existing order but no `paymentUrl`. If `startStripe` fails once, the order is cancelled; every identical retry returns that cancelled order instead of making checkout recoverable. Customers can be left unable to pay without inventing a new idempotency key.

**Fix:** Persist provider checkout state and a recoverable session reference/URL, then return the same payment continuation on valid replays. Define explicit replay behavior for cancelled pre-payment attempts (for example, return a terminal conflict instructing the client to use a new key). Add integration tests for response loss, provider timeout, concurrent duplicate requests, and replay after cancellation.

## P2 — The customer order DTO exposes internal payment/refund identifiers

**Locations:** `apps/api/src/commerce/order-view.ts:2-4`; `apps/api/src/commerce/checkout.controller.ts:15`; `apps/api/src/account/account.controller.ts:19`; `prisma/schema.prisma:303-321`

**Scenario:** `orderView` removes only order-level secrets and passes included `payments` and `refunds` through unchanged. Customer and guest order responses therefore expose Stripe session/provider IDs, refund provider IDs, internal payment record IDs, and raw transaction-oriented status fields. These identifiers increase the impact of an order-token leak and unnecessarily expose provider internals.

**Fix:** Create separate customer/admin order serializers. The customer DTO should expose only payment method/status and safe refund summaries; omit `providerId`, internal IDs, event IDs, and operational notes. Keep the richer representation behind `orders.view`.

## P2 — Return status can claim a refund using an unrelated partial refund

**Location:** `apps/api/src/commerce/orders.service.ts:22`

**Scenario:** Moving a return to `REFUNDED` checks only whether any completed refund exists for the order. One small refund can therefore satisfy the check for another or multiple return requests, producing false refund state and misleading customers/audits.

**Fix:** Relate refunds to a return request and/or return items in the schema. Before `REFUNDED`, require completed refund value to cover the refundable amount for that specific return, accounting for earlier linked refunds.

## P2 — Guest order access tokens are deterministically derived from idempotency keys

**Locations:** `apps/api/src/commerce/checkout.service.ts:31-32`; `apps/api/src/commerce/checkout.controller.ts:15`; `prisma/schema.prisma:246-248`

**Scenario:** The guest bearer token is an HMAC of the checkout idempotency key. Idempotency keys are commonly retained in browser state and request telemetry and are not normally treated as long-lived authorization credentials. Exposure of the server refresh secret plus logged checkout keys compromises every guest order token; replay also regenerates the bearer token indefinitely.

**Fix:** Generate a separate random order-access token once and store only its hash. Do not derive authorization from the idempotency key. If replay must return access, store the token encrypted with a dedicated rotation-capable key or use a short-lived exchange tied to the exact replay and redact idempotency keys from all telemetry.

## Verified safeguards

- Checkout prices, discounts, shipping, taxes, and stock are recalculated server-side.
- Stock deduction uses serializable transactions plus optimistic inventory predicates and retries Prisma serialization conflicts.
- Payment webhooks verify Stripe signatures and compare amount/currency before confirming an order.
- Cookie-authenticated mutations enforce allowed origins, and production startup rejects weak placeholder JWT secrets.
- Generic admin mutations use a fixed resource registry, strict schemas, permission checks, and audit snapshots with sensitive-key redaction.
