# Storefront implementation report

## Implemented

- Next.js App Router and React storefront in `apps/storefront`, shared API types, Tailwind 4 design tokens, Lucide icons, Framer Motion page transitions with reduced-motion support.
- CMS-backed server-rendered homepage: ordered/scheduled visible hero, products, categories, editorial, campaign, shop-the-look product edit, announcement, newsletter, custom and video sections. Products and CMS content have no mock-data fallback.
- Configurable brand wordmark, CMS navigation with keyboard-accessible dropdown menus, mobile menu, announcement, dynamic footer links, newsletter consent and unsubscribe.
- Cinematic original black/off-white editorial layout with API-provided original imagery, responsive 4/2-column product grids, hover-image transition, quick-add variant dialog, wishlist controls.
- Catalog, category, collection and gender pages; URL-backed search/category/collection/gender/size/color/price/in-stock/sale filters; server sorting and pagination; predictive search with recent searches and category suggestions.
- Product detail gallery, zoom, thumbnails, exact active size/color selection, unavailable-size states, stock cap, quantity, add-to-bag/buy-now, size guide, materials/fit/care disclosures, reviews submission/list, related products and local recently viewed products.
- Zustand persisted guest bag/wishlist, native-dialog bag drawer and full bag, inventory-capped quantities; authenticated account merge and restoration via variant IDs. Exact replacement PUT cart sync prevents repeated additive login merges. Wishlist removals persist to account. Sync failures are visible.
- React Hook Form/Zod checkout validation, guest and authenticated contact/address entry, saved addresses, API-derived shipping/payment methods, coupon field, quote-first review, server-derived monetary totals, UUID idempotency key, COD/bank/Stripe redirection, token-protected guest order confirmation and customer order timeline.
- Login/register/logout, HttpOnly-cookie API credentials, refresh-token retry, email verification, forgot/reset password, profile and marketing opt-in, password change, account-deletion request, address management, paginated orders, return requests/history.
- Contact form persists through API. Structured CMS blocks render as safe React text without executing stored markup.
- Product/CMS/campaign SEO metadata, Product JSON-LD, live sitemap, robots, custom loading/error/404 views, skip link, visible focus, native dialog focus trapping and responsive mobile sticky add-to-bag.

## Routes

`/`, `/shop`, `/search`, `/categories`, `/categories/[slug]`, `/collections`, `/collections/[slug]`, `/men`, `/women`, `/unisex`, `/[gender]/[category]`, `/products/[slug]`, `/product/[slug]`, `/campaigns/[slug]`, `/campaign/[slug]`, `/pages/[slug]`, `/contact`, `/wishlist`, `/cart`, `/checkout`, `/orders/[id]`, `/order/[id]`, `/account`, `/account/reset-password`, `/account/verify-email`, `/unsubscribe`, `/sitemap.xml`, `/robots.txt`.

Account also supports backend email links `/account?verify=TOKEN` and `/account?reset=TOKEN`. Policy aliases resolve privacy/terms/shipping/returns to seeded policy slugs. `/pages/contact` includes the contact submission form.

## Verification

- Six Node cart/variant unit tests pass: duplicate additions cap inventory, zero-stock rejection, zero removes line, quantity caps inventory, exact color/size selection, and API maximum 50 units.
- Direct TypeScript `tsc --noEmit` passed with the final implementation.
- Production 
ext build` passed on Next 16.3.5 / React 19.3.0 / Framer Motion 13.3.0; all storefront routes compiled. The earlier motion-dom mismatch was resolved by the central dependency upgrade.
- Five Vitest checkout schema tests pass: valid COD details, missing shipping, invalid email, unsupported payment, whitespace-only required fields. The whitespace regression was observed failing and corrected with trim validation.
- Storefront ESLint returned no errors; three unused-import warnings were then removed.
- Production server started successfully on http://localhost:3000 (session 68864).
- Live Chrome checkout and mobile shop/filter checks passed after integrated fixes. The curated homepage selection also passed. See `verification.md` for the current test record.

## Scope limits requiring honest disclosure

- Shop-the-look now renders a configured lifestyle image, numbered product markers and product dialogs. Admin controls marker positions by percentage; a drag-on-image authoring canvas is not provided.
- A few auxiliary brand phrases and fallback metadata remain presentation defaults. Products, menus, homepage section content/order, campaigns, CMS pages and store settings are fetched from API.
- Product video URLs now render native video controls with a poster. CMS video sections are supported; actual external video delivery depends on the configured storage/CDN.
- Fit, material, tag and minimum-rating filters have been added. Highest-rated sorting uses average approved-review ratings, with stable pagination and unrated products last.
- Card/media rendering uses native images with lazy loading (not an optimized image CDN). Production media optimization must be configured separately.
- Bank-transfer instructions and email delivery are backend/provider configuration responsibilities. Raw card details are never collected by this storefront.
- External production service configuration and operational/security review remain root release responsibilities.

