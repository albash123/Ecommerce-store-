# Administration application

Separate Next.js application at `http://localhost:3001/admin`, with cookie authentication, automatic refresh, permission-filtered resource navigation and per-action create/edit/delete controls returned by the API.

## Implemented

- Live dashboard and reports, proportional revenue/quantity charts, recent orders, explicit loading/error/empty states.
- Searchable paginated tables for every authorized metadata resource, CSV exports, product CSV import, selection and activate/archive/delete operations, plus category/collection assignments preserving product status.
- Product editor with variant SKU/color/size/pricing/stock/activation, ordered image gallery with alt text, collection assignment, SEO and all metadata fields.
- Searchable paginated product/category/collection pickers for campaign, coupon and collection targeting; campaign scheduling and appearance controls.
- Homepage section content/style controls, drag sorting and keyboard-accessible move-up controls, enabled/schedule fields; structured page blocks and nested navigation menu editor.
- Media multipart upload and existing URL creation; category, collection, coupon, shipping, tax, settings, email-template, role and admin-user editors.
- Order detail, history, fulfillment/tracking update, refund request, offline payment confirmation; return decisions, offline refund completion and reasoned inventory adjustment.
- Customer details with related addresses/orders, audit logs, inquiries, notification edits, review moderation and remaining read-only business records.
- Responsive navigation, scoped search, save feedback, destructive confirmations, authentication failure states.
- Shop-the-look marker coordinates are editable for each selected product. Video section URLs have a dedicated content field.

## Verification evidence

- Direct TypeScript check passed repeatedly.
- Next.js 16.3.5 optimized production build passed; `/admin/[[...route]]` dynamically rendered.
- `node apps/admin/tests/smoke.mjs` passed using real headless Chrome and isolated HTTP fixtures: JSON string settings round trip; canDelete hiding; reports permission visibility; mobile sidebar behavior; product creation payload with numeric price, variant stock/SKU and ordered image; no browser JavaScript exceptions.
- Final verification after all admin edits and dependency restoration: TypeScript passed; optimized production build passed; Chrome contract smoke passed. Production admin server started on port 3001. Live database/API integration awaits the root API and seed.

- Follow-up on 17 September: live Chrome smoke passed against PostgreSQL and the running API, including login, dashboard, product editor, category creation/deletion, homepage/menu/page/settings saves and reports. The CMS Pages API sorting defect found during this check was fixed. All authorized admin list endpoints pass the HTTP integration sweep.

## Practical limits

- Media uploads need configured storage; API reports provider configuration errors.
- Advanced arbitrary JSON settings and some metadata fields use a JSON editor. Safe structured homepage/page/menu editors cover their common workflows.
- The administration app uses API enforcement as the authority for permissions; hidden controls are supplementary UX.
