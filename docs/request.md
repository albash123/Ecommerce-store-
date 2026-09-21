# CODEX MASTER PROMPT

You are a senior full-stack software architect, senior React engineer, backend engineer, database architect, UI/UX designer, DevOps engineer, and QA engineer.

I want you to DESIGN AND BUILD a complete, production-ready, full-stack e-commerce platform for a premium fashion/streetwear brand.

This is NOT a simple demo store, landing page, static website, or frontend-only project.

Build a complete commercial e-commerce ecosystem consisting of:

1. Customer-facing storefront
2. Full backend REST API
3. PostgreSQL database
4. Authentication system
5. Shopping cart
6. Checkout
7. Product management
8. Inventory management
9. Order management
10. Customer management
11. Dynamic CMS
12. Campaign management
13. Discount/coupon engine
14. Homepage builder
15. Collection management
16. Media library
17. SEO management
18. Analytics dashboard
19. Role-based admin panel
20. Settings management
21. Shipping management
22. Payment architecture
23. Reviews
24. Wishlist
25. Notifications
26. Audit logs
27. Reporting
28. Responsive mobile/tablet/desktop experience

The primary products will initially be:

* Men's T-shirts
* Women's T-shirts
* Men's hoodies
* Women's hoodies
* Oversized T-shirts
* Graphic T-shirts
* Basic T-shirts
* Sweatshirts
* Hoodies
* Seasonal collections

However, the architecture MUST NOT be hardcoded only for these products.

The admin must be able to create entirely new categories, products, collections, campaigns, attributes, sizes, colors, banners, pages and menu structures without changing source code.

---

# 1. DESIGN DIRECTION

Create a premium international sportswear/streetwear shopping experience.

Take visual inspiration from premium brands such as:

* Adidas
* Nike
* Puma
* Under Armour
* New Balance
* ASOS
* premium streetwear stores

However:

DO NOT copy Adidas branding, logos, trademarks, copyrighted images, or reproduce their website pixel-for-pixel.

Create an ORIGINAL brand identity using similar high-level design principles:

* Bold
* Minimal
* Editorial
* Athletic
* Fashion-focused
* Strong typography
* High contrast
* Large product imagery
* Strong black and white aesthetic
* Clean grids
* Sophisticated animations
* Premium interaction design

The site should immediately feel like a professionally designed global fashion brand.

Do NOT make it look like:

* a generic Bootstrap website
* a basic Shopify template
* a cheap WooCommerce theme
* a SaaS dashboard
* a beginner React project

---

# 2. VISUAL LANGUAGE

Primary palette:

Black: #000000

White: #FFFFFF

Off-white backgrounds:
#F5F5F3
#F7F7F5

Dark gray:
#161616

Medium gray:
#777777

Light borders:
#E5E5E5

Use accent colors dynamically through CMS campaigns rather than hardcoding one permanent accent color.

For example, administrators should eventually be able to make a Valentine's campaign red, summer campaign orange/yellow, winter campaign blue, etc.

---

# 3. TYPOGRAPHY

Use premium bold typography.

Suggested fonts:

* Inter
* Archivo
* Space Grotesk
* Helvetica/Arial-style fallback

Product/category hero headings should use strong uppercase typography.

Example:

MEN'S ESSENTIALS

NEW SEASON.
NEW ENERGY.

BUILT FOR EVERYDAY.

WINTER COLLECTION 2026

Use:

* very large hero typography
* tight letter spacing
* strong font weights
* clean body copy
* clear hierarchy

Typography must scale responsively.

---

# 4. ANIMATION SYSTEM

The store must contain sophisticated animations, but animations must NEVER make shopping difficult.

Use:

* Framer Motion
* GSAP where appropriate
* CSS transitions
* IntersectionObserver

Animations should include:

### Page transitions

Smooth page-enter/page-exit animations.

### Hero animation

Hero image/video reveal.

Large headings animate into position.

CTA buttons subtly reveal.

### Scroll animations

Sections fade/slide upward when entering viewport.

### Product cards

On hover:

* image subtly zooms
* second product image can appear
* product information transitions
* wishlist icon appears
* Quick Add appears

### Navigation

Mega menu animated reveal.

### Cart

Cart should open as a smooth side drawer.

### Filters

Desktop filter sidebar transitions.

Mobile filters open as bottom sheet/drawer.

### Image galleries

Smooth gallery transitions.

### Buttons

Premium hover interactions.

Arrow movement.

Background fill animation.

### Campaign banners

Animated text and media.

### Loading

Skeleton loaders instead of ugly spinners whenever appropriate.

IMPORTANT:

Animations must remain GPU-friendly and performance-conscious.

Support:

prefers-reduced-motion

Do not animate every object unnecessarily.

The experience must remain smooth on average mobile devices.

---

# 5. TECH STACK

Use a professional TypeScript stack.

## Frontend

Use:

Next.js with React
TypeScript
Tailwind CSS
Framer Motion
GSAP where required
TanStack Query
Zustand
React Hook Form
Zod
Lucide Icons

Use Next.js server rendering/static rendering where appropriate for SEO and performance.

Do NOT unnecessarily turn everything into client components.

---

# 6. BACKEND

Create a separate backend application.

Use:

Node.js
NestJS
TypeScript
REST API
Prisma ORM
PostgreSQL

Use a modular architecture.

Possible modules:

AuthModule
UsersModule
CustomersModule
ProductsModule
CategoriesModule
CollectionsModule
InventoryModule
OrdersModule
CartModule
CheckoutModule
PaymentsModule
ShippingModule
CouponsModule
CampaignsModule
CMSModule
MediaModule
ReviewsModule
WishlistModule
NotificationsModule
AnalyticsModule
SettingsModule
SeoModule
RolesModule
AuditModule

Do NOT create one giant controller or service.

Follow clean architecture principles.

---

# 7. PROJECT STRUCTURE

Create a monorepo.

Example:

apps/
storefront/
admin/
api/

packages/
ui/
types/
config/
validation/

prisma/

docs/

Storefront = customer website.

Admin = administrative CMS/dashboard.

API = NestJS backend.

Use shared TypeScript interfaces/types where useful.

---

# 8. DATABASE

Use PostgreSQL with Prisma.

Create normalized schemas and relationships.

The database should include entities similar to:

User

Role

Permission

Customer

CustomerAddress

Product

ProductVariant

ProductImage

ProductAttribute

ProductAttributeValue

Category

Collection

Brand

Tag

Inventory

InventoryTransaction

Warehouse

Cart

CartItem

Wishlist

WishlistItem

Order

OrderItem

OrderStatusHistory

Payment

PaymentTransaction

ShippingMethod

ShippingZone

Coupon

Discount

Campaign

CampaignProduct

CampaignCollection

HomepageSection

Banner

Page

Menu

MenuItem

Media

Review

Notification

EmailTemplate

SeoMetadata

SiteSetting

AuditLog

ReturnRequest

Refund

TaxRule

SearchLog

RecentlyViewedProduct

NewsletterSubscriber

AbandonedCart

Design the actual relationships correctly.

---

# 9. PRODUCT MANAGEMENT

The admin must be able to create products containing:

Product name

Slug

SKU

Description

Short description

Category

Subcategory

Collections

Gender

Tags

Regular price

Sale price

Cost price

Tax class

Product status

Featured status

New arrival status

Best seller status

Visibility

SEO title

SEO description

OG image

Size chart

Material

Fit

Care instructions

Model information

Shipping information

Return information

Product gallery

Product video

Variant images

---

# 10. PRODUCT VARIANTS

Products must support combinations such as:

Color:
Black
White
Beige
Red
Green

Size:
XS
S
M
L
XL
XXL

Each variation can have:

SKU

Barcode

Price override

Sale price override

Inventory quantity

Low stock threshold

Weight

Image

Availability

Status

Example:

Oversized Black Hoodie

Black / M = 23 stock

Black / L = 10 stock

White / M = 4 stock

White / XL = sold out

Stock must be tracked per variation.

---

# 11. PRODUCT MEDIA

Allow admins to upload:

JPG

PNG

WEBP

AVIF

Product images

Lifestyle imagery

Campaign imagery

Videos

Allow:

drag and drop

reordering

image alt text

featured image

variant-specific images

automatic thumbnails

Media should use an abstraction supporting:

AWS S3

or

Cloudflare R2

Do not permanently depend on storing uploads inside the application server.

---

# 12. STOREFRONT HOMEPAGE

The homepage MUST BE COMPLETELY CMS-DRIVEN.

DO NOT hardcode homepage sections permanently.

Administrators should be able to create/reorder/hide sections.

Homepage section types may include:

Hero

Hero video

Promotional banner

Announcement bar

Featured products

Featured collection

New arrivals

Men category

Women category

Best sellers

Image + text

Two-column campaign

Three-column categories

Editorial story

Shop the look

Product carousel

Full-width campaign

Newsletter

Instagram/social section

Recently viewed

Custom content

Administrators should control:

Heading

Subheading

CTA text

CTA URL

Background

Text color

Images

Desktop image

Mobile image

Video

Products

Collections

Section spacing

Alignment

Section status

Start date

End date

Display order

Campaign association

---

# 13. HOMEPAGE HERO

Create a cinematic hero.

Desktop approximately:

80-90vh.

Support:

full-screen image

background video

foreground product image

headline

description

primary CTA

secondary CTA

Examples:

NEW COLLECTION

SHOP MEN

SHOP WOMEN

Hero must support different desktop/mobile media through CMS.

---

# 14. HEADER

Create a premium sticky header.

Desktop structure:

LOGO

MEN
WOMEN
NEW ARRIVALS
COLLECTIONS
SALE

Search
Account
Wishlist
Cart

Support configurable menu links from CMS.

The header should react elegantly to scrolling.

---

# 15. MEGA MENU

Build dynamic mega menus.

Example:

MEN

CLOTHING

T-Shirts
Hoodies
Sweatshirts
Jackets

SHOP BY

New Arrivals
Best Sellers
Essentials
Sale

FEATURED

Summer Collection
Oversized Collection

Include promotional images.

Everything must come from admin CMS.

---

# 16. ANNOUNCEMENT BAR

Dynamic announcement bar.

Examples:

FREE SHIPPING ON ORDERS OVER PKR 5,000

MID-SEASON SALE — UP TO 40% OFF

NEW DROP AVAILABLE NOW

Admin can control:

Text

Link

Background color

Text color

Start/end date

Enabled/disabled

---

# 17. SHOP / PRODUCT LISTING PAGE

Create premium category pages.

Example URL:

/men/t-shirts

Include:

breadcrumb

category heading

category description

result count

sorting

filters

product grid

quick add

wishlist

pagination or infinite loading

---

# 18. FILTERING

Support advanced filtering by:

Category

Collection

Gender

Size

Color

Price range

Availability

Discount

Rating

Tags

Fit

Material

Sort options:

Featured

Newest

Best Selling

Price Low → High

Price High → Low

Highest Rated

Filters must update URL parameters.

Example:

/men/t-shirts?size=M&color=black&sort=newest

This enables shareable URLs and SEO-friendly behavior.

---

# 19. PRODUCT CARD

Premium product card.

Show:

Product image

Alternate hover image

Wishlist button

New badge

Sale badge

Best seller badge

Product name

Category

Available colors

Price

Original price

Discount

Quick Add

Color swatches

Smooth image transitions.

---

# 20. PRODUCT DETAIL PAGE

The product detail page is one of the most important screens.

Create:

Large image gallery

Image zoom

Thumbnail navigation

Product video support

Product name

Rating

Price

Discount

Available colors

Size selection

Size guide

Stock indication

Quantity selector

Add To Bag

Buy Now

Wishlist

Delivery information

Description

Materials

Fit information

Care guide

Returns

Accordion sections

Related products

Complete the look

Recently viewed

Customer reviews

Sticky Add-To-Bag on mobile.

If user attempts to add product without choosing required size/color, clearly highlight the missing selection.

---

# 21. SIZE GUIDE

CMS-managed size guide.

Allow different size guides for:

Men T-shirts

Women T-shirts

Hoodies

etc.

Display using polished modal/drawer.

---

# 22. SEARCH

Build full search functionality.

Search products using:

Product name

SKU

Category

Tags

Collection

Description

Implement an animated predictive search overlay.

As the user types:

"black hood"

show:

Products

Categories

Suggested terms

Recent searches

Popular searches

Include product thumbnail + price.

---

# 23. SHOPPING CART

Create both:

Cart Drawer

Full Cart Page

Cart drawer should slide in smoothly from the side.

Include:

Product image

Product name

Selected size

Selected color

Quantity

Price

Remove

Subtotal

Discount

Shipping message

Checkout CTA

Allow quantity updates without page refresh.

---

# 24. CHECKOUT

Create a clean checkout process.

Steps:

Contact

Shipping Address

Shipping Method

Payment

Order Review

Confirmation

Allow:

Guest checkout

Registered checkout

Remembered customer addresses

Create account after checkout

---

# 25. PAYMENT ARCHITECTURE

Create payment-provider abstraction.

Initially support easily configurable:

Stripe

Cash on Delivery

Bank Transfer

Also structure the system so regional providers can later be connected, such as:

JazzCash

Easypaisa

other gateways

Never store raw credit/debit card details.

Payment verification must happen server-side.

Use webhook architecture for online gateways.

---

# 26. SHIPPING

Admin can configure:

Shipping zones

Cities

Countries

Rates

Free shipping thresholds

Flat rates

Weight-based shipping

Order-value based shipping

COD availability

Example:

Pakistan

Standard shipping = PKR 250

Free shipping = orders above PKR 5,000

Islamabad/Rawalpindi same-day shipping could later be configured as another method.

---

# 27. TAX MANAGEMENT

Allow admin tax configuration.

Do not hardcode tax rules.

Support:

tax percentage

tax included/excluded pricing

tax zones

category-specific tax rules

---

# 28. CUSTOMER ACCOUNTS

Customers can:

Register

Login

Logout

Verify email

Forgot password

Reset password

Update profile

Manage addresses

View orders

Track orders

View wishlist

Manage newsletter subscription

View returns

Change password

Delete account request

---

# 29. AUTHENTICATION

Use secure authentication.

Implement:

Password hashing using Argon2 or bcrypt

JWT access tokens

Refresh tokens

HttpOnly secure cookies where appropriate

Email verification

Forgot-password tokens

Refresh-token rotation

Rate limiting

Logout invalidation

Do not store plain-text passwords.

---

# 30. ADMIN PANEL

Build a SEPARATE premium admin interface.

The admin panel is extremely important.

Routes could be:

/admin/dashboard

/admin/products

/admin/categories

/admin/collections

/admin/orders

/admin/customers

/admin/inventory

/admin/campaigns

/admin/discounts

/admin/coupons

/admin/content

/admin/homepage

/admin/pages

/admin/menus

/admin/media

/admin/reviews

/admin/shipping

/admin/payments

/admin/reports

/admin/users

/admin/roles

/admin/settings

/admin/audit-logs

---

# 31. ADMIN DASHBOARD

Dashboard cards:

Today's Revenue

Today's Orders

Total Customers

Average Order Value

Products Low In Stock

Pending Orders

Returns

Refunds

Conversion statistics

Sales chart

Top products

Top categories

Recent orders

Recent customers

Campaign performance

Use professional charts.

---

# 32. ORDER MANAGEMENT

Admin order list.

Columns:

Order ID

Customer

Date

Products

Amount

Payment Status

Fulfillment Status

Order Status

Shipping Method

Actions

Order statuses:

Pending

Confirmed

Processing

Packed

Shipped

Out for Delivery

Delivered

Cancelled

Returned

Refunded

Maintain an order status history.

---

# 33. ORDER DETAIL

Show:

Order number

Customer details

Billing details

Shipping address

Items

Variants

SKU

Quantity

Subtotal

Discount

Shipping

Tax

Grand total

Payment details

Payment transaction

Order notes

Timeline

Shipping tracking

Status history

Allow admin status changes.

---

# 34. INVENTORY MANAGEMENT

Create serious inventory management.

Track stock by:

Product

Variant

Warehouse

Maintain inventory transactions.

Transaction types:

Stock In

Sale

Return

Manual Adjustment

Damaged

Cancelled Order

Restock

Admin should be able to see:

Current Stock

Reserved Stock

Available Stock

Low Stock

Out of Stock

---

# 35. CAMPAIGN MANAGEMENT

THIS IS A VERY IMPORTANT FEATURE.

Admin must be able to create marketing campaigns.

Examples:

Summer Sale

Black Friday

Winter Drop

Independence Day

Valentine Campaign

Eid Collection

Flash Sale

Campaign fields:

Name

Slug

Description

Status

Start date/time

End date/time

Banner

Mobile banner

Hero media

Theme color

Text color

CTA

Products

Collections

Categories

Discount rules

Homepage sections

Announcement bar

Landing page

SEO metadata

A scheduled campaign should automatically activate and expire based on its timing.

---

# 36. CAMPAIGN LANDING PAGES

Example:

/campaign/summer-sale

Campaign pages can contain:

Hero

Countdown

Featured products

Collections

Editorial media

Offer messaging

CTAs

Campaign-specific branding.

---

# 37. DISCOUNT ENGINE

Support:

Percentage discounts

Fixed discounts

Product discount

Category discount

Collection discount

Cart discount

Buy X Get Y

Free shipping

Minimum order value

Maximum discount

Customer-specific discount

First-order discount

Date/time restrictions

Usage limits

Per-customer limits

---

# 38. COUPONS

Coupon fields:

Code

Name

Description

Discount type

Discount value

Minimum order

Maximum discount

Start date

Expiry date

Usage limit

Usage per user

Eligible products

Eligible categories

Eligible collections

Excluded products

Active status

Example:

WELCOME10

10% discount for first-time customers.

---

# 39. COLLECTION MANAGEMENT

Allow collections such as:

NEW ARRIVALS

ESSENTIALS

SUMMER 2026

OVERSIZED

GYM COLLECTION

WINTER COLLECTION

BEST SELLERS

Collections can be:

Manual

Dynamic

Dynamic collection rules may include:

category

tag

price

gender

new-arrival status

best-seller status

stock availability

---

# 40. MEN & WOMEN LANDING PAGES

Create premium editorial category pages.

Example:

/men

Hero

New Arrivals

Shop T-Shirts

Shop Hoodies

Trending Now

Campaign banner

Best Sellers

Editorial content

Same for:

/women

Everything configurable through CMS.

---

# 41. CMS PAGES

Admin should create/edit normal pages.

Examples:

About Us

Contact

Privacy Policy

Terms & Conditions

Shipping Policy

Returns & Exchanges

FAQs

Size Guide

Create rich-text CMS editing.

Support:

Headings

Paragraphs

Images

Videos

Lists

Quotes

Links

Buttons

Tables

---

# 42. MENU MANAGEMENT

Do not hardcode navigation.

Admin controls:

Header menu

Footer menu

Mega menus

Nested items

Links

Collections

Categories

Pages

External URLs

Ordering

Visibility

---

# 43. SITE SETTINGS

Create centralized settings.

Settings should include:

Store name

Logo

Dark logo

Light logo

Favicon

Contact email

Phone

WhatsApp

Address

Social links

Default currency

Currency symbol

Timezone

Country

Tax settings

Shipping settings

Email configuration

Order configuration

SEO defaults

Analytics codes

Social sharing image

Maintenance mode

---

# 44. SEO

SEO is mandatory.

Implement:

Server-rendered product metadata

Canonical URLs

Dynamic metadata

OpenGraph

Twitter cards

Product structured data

Breadcrumb structured data

Organization structured data

Sitemap.xml

Robots.txt

Category metadata

Product metadata

Campaign metadata

CMS page metadata

Admin-editable:

SEO title

Meta description

OG image

Canonical URL

Index/noindex

---

# 45. URL STRUCTURE

Use clean URLs.

Examples:

/

/men

/women

/men/t-shirts

/men/hoodies

/women/t-shirts

/women/hoodies

/product/essential-black-oversized-tee

/collections/new-arrivals

/collections/summer-2026

/campaign/summer-sale

/search?q=hoodie

/cart

/checkout

/account

/account/orders

---

# 46. WISHLIST

Allow logged-in customers to:

Add item

Remove item

View wishlist

Move wishlist item to cart

Guest wishlist may temporarily use local storage and merge after login.

---

# 47. REVIEWS

Customers can review purchased products.

Review fields:

Rating

Title

Review

Images

Verified Purchase

Admin approval

Admin reply

Support:

Average rating

Rating breakdown

Review pagination

---

# 48. NEWSLETTER

Newsletter signup.

Admin can:

View subscribers

Export subscribers

Enable/disable signup section

Create promotional signup message

Track signup source.

---

# 49. EMAIL SYSTEM

Create transactional email architecture.

Templates:

Welcome

Verify Email

Password Reset

Order Received

Order Confirmed

Order Shipped

Order Delivered

Order Cancelled

Refund Processed

Return Update

Low Inventory notification

Admin should eventually be able to edit email content.

Use an abstraction compatible with services such as:

Resend

SendGrid

Amazon SES

---

# 50. NOTIFICATIONS

Admin notifications:

New order

Low inventory

New review

Return request

Failed payment

Customer notifications:

Order status

Payment confirmation

Shipping updates

Promotional messaging if opted in.

---

# 51. RETURNS

Customer can request return.

Return request contains:

Order

Products

Quantity

Reason

Description

Images

Return status

Statuses:

Requested

Approved

Rejected

Received

Refunded

Closed

---

# 52. REFUNDS

Admin can create:

Full refund

Partial refund

Maintain refund transaction records.

Never simply modify the original payment record without history.

---

# 53. ADMIN USERS

Admin users must be different from customer accounts where appropriate.

Support roles such as:

Super Admin

Administrator

Store Manager

Order Manager

Inventory Manager

Content Manager

Marketing Manager

Customer Support

---

# 54. RBAC

Build real role-based access control.

Permissions examples:

products.view

products.create

products.edit

products.delete

orders.view

orders.edit

customers.view

inventory.edit

campaigns.manage

cms.manage

users.manage

settings.manage

reports.view

Admin UI should hide inaccessible actions.

API MUST ALSO validate permissions server-side.

Never rely only on frontend permission checks.

---

# 55. AUDIT LOG

Track sensitive admin activity.

Examples:

Product edited

Price changed

Order status changed

Inventory updated

Coupon created

Campaign deleted

Admin created

Permission changed

Settings modified

Store:

Admin user

Action

Entity

Entity ID

Old values

New values

Timestamp

IP if appropriate.

---

# 56. ANALYTICS

Admin reporting:

Revenue

Orders

Customers

Average order value

Units sold

Top products

Top categories

Top collections

Sales over time

New vs returning customers

Coupon usage

Campaign performance

Low stock

Refund rate

Data must come from actual database records.

Do not fake dashboard numbers after seed data.

---

# 57. ABANDONED CART ARCHITECTURE

Track carts associated with:

logged-in customers

known customer email during checkout

Support identifying abandoned carts.

Admin dashboard can show:

Customer

Cart value

Items

Last activity

Recovery status

Design architecture so recovery emails can later be implemented.

---

# 58. RESPONSIVE DESIGN

The entire system must work professionally on:

320px mobile

375px mobile

430px mobile

Tablet

Laptop

Desktop

Large desktop

Design mobile intentionally.

Do NOT simply shrink desktop layout.

Mobile navigation should use a premium full-screen or drawer menu.

Mobile product page should include sticky Add To Bag.

Mobile filters should use bottom drawer/full-screen drawer.

---

# 59. ACCESSIBILITY

Follow WCAG-friendly practices.

Include:

Keyboard navigation

Visible focus states

ARIA labels

Accessible modals

Accessible drawers

Semantic HTML

Image alt tags

Good contrast

Reduced motion preference.

---

# 60. PERFORMANCE

Aim for excellent Core Web Vitals.

Use:

Next/Image

Responsive images

Lazy loading

Image compression

Code splitting

Dynamic imports

Caching

Server rendering

Static generation where applicable

Avoid unnecessarily large JavaScript bundles.

Do not let GSAP/animation libraries harm performance.

---

# 61. API SECURITY

Implement:

Helmet/security headers

CORS rules

Rate limiting

Request validation

DTO validation

Authentication guards

Authorization guards

SQL injection protection via Prisma

XSS precautions

Secure cookie configuration

CSRF protection where architecture requires it

File upload validation

Maximum upload limits

MIME checking

API error normalization

Never expose internal stack traces in production.

---

# 62. API FORMAT

Use consistent API responses.

Example success:

{
"success": true,
"data": {},
"message": "Product created successfully"
}

Example error:

{
"success": false,
"message": "Product not found",
"errors": []
}

Use correct HTTP status codes.

---

# 63. API DOCUMENTATION

Add Swagger/OpenAPI documentation.

Example:

/api/docs

Document:

Authentication

Products

Orders

Categories

Campaigns

CMS

Customers

Admin

etc.

---

# 64. VALIDATION

Use shared and server-side validation.

Frontend:

Zod

Backend:

NestJS DTO validation / class-validator or equivalent.

Backend validation is authoritative.

Do not trust frontend data.

---

# 65. ERROR HANDLING

Create useful errors.

Examples:

Product unavailable

Variant sold out

Coupon expired

Coupon already used

Invalid shipping method

Insufficient stock

Payment failed

Unauthorized request

Validation failed

Use toast notifications and inline validation in frontend.

---

# 66. LOADING STATES

Every asynchronous UI should have professional loading behavior.

Use:

Skeleton cards

Button loading indicators

Checkout processing state

Table loading

Search loading

Image placeholders

Never leave users wondering whether something happened.

---

# 67. EMPTY STATES

Design attractive empty states.

Examples:

Empty cart

Empty wishlist

No orders

No reviews

No search results

No campaign products

No admin data

Include useful calls-to-action.

---

# 68. 404 & ERROR PAGES

Create custom:

404

500

maintenance page

offline/error fallback where appropriate.

Keep them aligned with the fashion brand style.

---

# 69. ADMIN UX

Admin interface should feel professional, like a modern commercial commerce management application.

Use:

Sidebar navigation

Top navigation

Breadcrumbs

Data tables

Search

Filters

Pagination

Bulk actions

Modals

Drawers

Confirmation dialogs

Toasts

Form sections

Tabs

Image upload

Drag/drop sorting

Do NOT over-animate the admin.

Prioritize clarity and efficiency.

---

# 70. BULK OPERATIONS

Admin should be able to:

Select products

Activate/deactivate

Assign categories

Assign collections

Update status

Delete where safe

Export products

Potentially import products through CSV

Order bulk actions can include:

Export

Status updates where appropriate.

---

# 71. IMPORT / EXPORT

Implement architecture for:

Product CSV import

Product CSV export

Orders CSV export

Customers CSV export

Newsletter export

Inventory export

Validate imported data and report errors clearly.

---

# 72. GLOBAL COMMAND/SEARCH EXPERIENCE

Admin can have global search.

Search:

Products

Orders

Customers

SKU

Campaign

Quick navigation.

---

# 73. CONTACT PAGE

Create premium contact page.

Fields:

Name

Email

Phone optional

Subject

Order number optional

Message

Store inquiry information.

Store submissions in database so administrators can review them.

---

# 74. FOOTER

Dynamic CMS-controlled footer.

Possible groups:

SHOP

Men

Women

New Arrivals

Sale

HELP

Contact

Shipping

Returns

Size Guide

FAQ

ABOUT

Our Story

Careers

Privacy

Terms

Newsletter signup

Social icons.

---

# 75. BRAND STORY SECTION

The frontend should include optional editorial sections similar to premium lifestyle brands.

Use:

Large photography

Asymmetrical layouts

Strong typography

Whitespace

Scroll reveals

Magazine-inspired styling.

---

# 76. "SHOP THE LOOK"

Allow admin to create a lifestyle image and attach multiple products.

Customer sees an editorial image and clickable product markers/cards.

Clicking a marker displays the corresponding product.

---

# 77. RECENTLY VIEWED PRODUCTS

Track recently viewed products.

Guest:

LocalStorage

Authenticated:

Optionally database-backed.

Display on product pages/homepage when useful.

---

# 78. STOCK PROTECTION

Very important.

Never trust cart quantities.

When checkout happens:

Backend must validate inventory again.

Prevent customers from purchasing more units than available.

Create strategy for temporarily reserved inventory if needed.

Avoid race-condition overselling.

Use appropriate database transactions.

---

# 79. PRICE SECURITY

Never trust prices sent by frontend.

Frontend should only send:

Product/variant IDs

Quantity

Coupon code

Backend calculates:

Product price

Discount

Shipping

Tax

Final amount

This is mandatory.

---

# 80. DATABASE TRANSACTIONS

Use database transactions for important workflows:

Order creation

Payment confirmation

Inventory deduction

Refund

Return processing

Prevent partially completed states.

---

# 81. TESTING

Create tests.

Backend:

Unit tests

API integration tests

Critical checkout tests

Inventory tests

Coupon tests

Authentication tests

Frontend:

Critical component tests

Checkout validation

Cart behavior

Use Playwright for critical end-to-end flows where practical.

E2E example:

Customer visits store

→ selects hoodie

→ chooses black

→ chooses size M

→ adds to bag

→ opens cart

→ checkout

→ enters address

→ selects shipping

→ places COD test order

→ receives confirmation

→ order appears in admin

→ inventory decreases.

---

# 82. SEED DATA

Create professional development seed data.

Include:

20-30 products

Men's T-shirts

Women's T-shirts

Hoodies

Multiple colors

Multiple sizes

Categories

Collections

Customers

Orders

Campaigns

Coupons

Homepage sections

Reviews

Admin account

Use clearly fictional brand/product names.

Do NOT use copyrighted Adidas/Nike product images.

Use placeholder/local demo images that can easily be replaced.

---

# 83. BRAND PLACEHOLDER

Use a temporary fictional premium brand name.

For example:

NOVA ATHLETICS

or another original fashion brand.

Make branding easy to change from settings.

DO NOT embed brand name everywhere in source files.

Read brand information from global configuration/CMS wherever reasonable.

---

# 84. DEMO CAMPAIGN

Create a seeded campaign:

SEASON SHIFT

Headline:

BUILT FOR WHAT'S NEXT.

Subheading:

New silhouettes. Essential layers. Designed for everyday movement.

CTA:

SHOP THE DROP

Include:

T-shirts

Hoodies

Men

Women

Use original placeholder imagery.

---

# 85. ADMIN LOGIN

Seed development admin:

[admin@example.com](mailto:admin@example.com)

Use a development password documented in README.

Force production deployments to set/change credentials through environment configuration.

Never hardcode production passwords.

---

# 86. ENVIRONMENT VARIABLES

Create:

.env.example

Include variables such as:

DATABASE_URL=

REDIS_URL=

JWT_SECRET=

JWT_REFRESH_SECRET=

S3_ENDPOINT=

S3_BUCKET=

S3_ACCESS_KEY=

S3_SECRET_KEY=

STRIPE_SECRET_KEY=

STRIPE_WEBHOOK_SECRET=

NEXT_PUBLIC_API_URL=

EMAIL_PROVIDER=

EMAIL_API_KEY=

APP_URL=

ADMIN_URL=

Do not commit secrets.

---

# 87. DOCKER

Provide Docker support.

Create:

docker-compose.yml

Local development should easily start:

PostgreSQL

Redis

API

Optionally frontend/admin.

Document commands clearly.

---

# 88. README

Create an excellent README covering:

Project overview

Architecture

Tech stack

Prerequisites

Installation

Environment variables

Database setup

Prisma migrations

Seed database

Start development

Build production

Run tests

Docker

Admin login

Deployment

Media storage

Payment configuration

Email configuration

Common troubleshooting.

---

# 89. DATABASE MIGRATIONS

Use Prisma migrations properly.

Do not use random database manipulation scripts as a replacement for schema migrations.

Create seed scripts separately.

---

# 90. DEPLOYMENT READINESS

Architecture should support deployment such as:

Storefront/Admin:
Vercel

Backend:
Railway / Render / AWS / Docker VPS

Database:
Managed PostgreSQL

Redis:
Managed Redis

Media:
AWS S3 / Cloudflare R2

Do not tightly couple the project to a single provider.

---

# 91. DESIGN COMPONENT SYSTEM

Create reusable components.

Examples:

Button

IconButton

Container

Section

Heading

Badge

Modal

Drawer

Accordion

Tabs

ProductCard

ProductGrid

ProductCarousel

Price

ColorSwatch

SizeSelector

QuantitySelector

Breadcrumb

Pagination

Toast

Skeleton

FormInput

Select

Checkbox

Radio

DataTable

ConfirmationModal

ImageUploader

RichTextEditor

Use consistent design tokens.

---

# 92. STOREFRONT DESIGN DETAILS

Use plenty of whitespace.

Desktop container:

approximately 1400-1600px where appropriate.

Product listing grid:

Desktop: 4 columns

Medium: 3 columns

Tablet: 2-3 columns

Mobile: 2 columns where product cards remain readable.

Do not use excessive rounded cards.

The design should feel sharp and editorial rather than soft SaaS UI.

Use borders more than heavy shadows.

Use shadows sparingly.

Buttons may use squared or slightly rounded corners.

Example primary button:

BLACK BACKGROUND

WHITE TEXT

UPPERCASE

Medium-large horizontal padding

Arrow icon

Hover inversion/animation.

---

# 93. PREMIUM MICRO-INTERACTIONS

Include tasteful details such as:

Animated underline navigation

Wishlist heart transition

Cart count animation

Image crossfade

Animated filter counts

Button arrow slide

Page progress states

Mobile menu staged reveal

Hover image swapping

Smooth accordion interactions

Animated toast notifications

Header transformation on scroll.

Do not sacrifice usability.

---

# 94. CART PERSISTENCE

Guest cart must persist using browser storage.

When a guest logs in:

Merge guest cart with server cart safely.

Avoid duplicate variants.

Respect current inventory.

---

# 95. CUSTOMER DATA PRIVACY

Provide architecture supporting:

Marketing opt-in

Newsletter unsubscribe

Account deletion requests

Personal data management

Do not expose customer private information publicly.

---

# 96. PAGINATION

Backend lists must implement pagination.

Do not retrieve thousands of database entries at once.

Use pagination for:

Products

Orders

Customers

Reviews

Audit logs

Campaigns

Admin tables.

---

# 97. DATABASE INDEXES

Add appropriate indexes for frequently queried fields:

Product slug

SKU

Category

Collection relationships

Customer email

Order number

Order status

Created dates

Campaign dates

Coupon code

Search-related fields.

Review query performance.

---

# 98. CACHING

Use Redis or equivalent caching selectively for:

Homepage content

Categories

Collections

Site settings

Popular products

Campaign configuration

Invalidate cache when related content changes.

Do not cache personalized or security-sensitive responses incorrectly.

---

# 99. LOGGING

Backend should use structured logging.

Log:

Application errors

Payment webhook failures

Authentication abnormalities

Order failures

External service errors

Do not log passwords, payment details or access tokens.

---

# 100. DEVELOPMENT QUALITY RULES

Follow these rules strictly:

Do not create giant files.

Do not put everything in page.tsx.

Do not duplicate logic.

Do not hardcode CMS content.

Do not hardcode product data.

Do not hardcode categories.

Do not expose secrets.

Do not suppress TypeScript errors with `any` unless absolutely justified.

Do not leave broken TODO code.

Do not create fake buttons.

Every visible major button must work.

Do not create admin menus with non-functional pages.

Do not create a frontend that looks complete while backend functionality is missing.

---

# 101. IMPLEMENTATION PROCESS

Do NOT attempt to write the entire application as one enormous unstructured code dump.

Work systematically.

### PHASE 1 — Architecture

First inspect the workspace.

Then create:

architecture plan

folder structure

database model

API plan

frontend routes

admin routes

dependency plan.

Then implement.

Do not stop after explaining the architecture.

Actually build the project.

---

### PHASE 2 — Foundation

Create:

Monorepo

Frontend

Admin

API

PostgreSQL

Prisma

Authentication

RBAC

Global styles

Component library

Docker/environment setup.

---

### PHASE 3 — Commerce Core

Build:

Products

Variants

Categories

Collections

Inventory

Storefront listing

Product page

Search

Cart

Wishlist.

---

### PHASE 4 — Checkout

Build:

Customer addresses

Shipping

Coupons

Taxes

Checkout

Orders

Payment architecture

Order confirmation

Inventory deduction.

---

### PHASE 5 — CMS

Build:

Homepage builder

Announcement bar

Hero management

Menus

Pages

Media

SEO

Site settings.

---

### PHASE 6 — Marketing

Build:

Campaigns

Campaign scheduling

Campaign landing pages

Coupons

Discounts

Newsletter

Promotional content.

---

### PHASE 7 — Administration

Complete:

Dashboard

Orders

Customers

Inventory

Reports

Returns

Refunds

Roles

Permissions

Audit logs.

---

### PHASE 8 — Polish

Complete:

Animations

Responsive behavior

Accessibility

Performance

SEO

Loading states

Empty states

Error pages.

---

### PHASE 9 — QA

Run:

TypeScript checks

Linting

Unit tests

Integration tests

E2E tests

Production builds.

Fix all critical issues.

Do not finish while build errors remain.

---

# 102. CODING BEHAVIOR

While working:

Inspect existing files before modifying them.

Do not overwrite useful code unnecessarily.

Explain important architecture decisions briefly.

Create files directly.

Install dependencies when required.

Run database migrations.

Seed the database.

Run development/build commands.

Fix errors yourself.

Continue until the feature being implemented actually works.

If one library causes major compatibility problems, choose an appropriate stable alternative rather than abandoning the feature.

---

# 103. FRONTEND QUALITY EXPECTATION

The final storefront should look like something a professional agency could realistically deliver to a major apparel company.

When I open the homepage I should see:

Premium header

Large cinematic campaign hero

Smooth typography animation

Men/Women entry points

New arrivals

Editorial imagery

Product carousel

Featured campaign

Shop-the-look experience

Newsletter section

Professional footer

The experience should immediately communicate:

PREMIUM

SPORT

STREETWEAR

FASHION

ENERGY

QUALITY.

---

# 104. ADMIN QUALITY EXPECTATION

When I login to the administration system I should be able to operate the business without editing code.

I must be able to:

Create products

Create product variations

Upload images

Change prices

Control stock

Create collections

Create categories

Create menus

Change homepage sections

Launch campaigns

Schedule campaigns

Create discounts

Create coupons

Change banners

Change hero media

Change announcement messages

Manage customers

Manage orders

Process returns

Track inventory

Manage shipping

Manage site settings

Control SEO

Create pages

Moderate reviews

View reports

Manage admin users and permissions.

That is the definition of "dynamic CMS" for this project.

Do not call it a dynamic CMS if major storefront content still requires source-code edits.

---

# 105. FINAL ACCEPTANCE CRITERIA

The project is considered complete only when:

1. Customer storefront works.
2. Admin application works.
3. Backend API works.
4. PostgreSQL database works.
5. Authentication works.
6. Products can be created from admin.
7. Variants can be created.
8. Product images can be managed.
9. Products created in admin appear on storefront.
10. Categories work.
11. Collections work.
12. Search works.
13. Filtering works.
14. Cart works.
15. Wishlist works.
16. Coupon system works.
17. Checkout works.
18. COD test order can be completed.
19. Order appears in admin.
20. Inventory decreases correctly.
21. Order status can be changed.
22. Customer can see order.
23. Homepage content can be changed in CMS.
24. Navigation can be changed in CMS.
25. Campaign can be created and scheduled.
26. Campaign can automatically start/end.
27. Discounts work.
28. Shipping configuration works.
29. SEO metadata works.
30. Responsive mobile design works.
31. Animations work smoothly.
32. Role permissions work.
33. Audit logging works.
34. Seed data works.
35. Database migrations work.
36. Production frontend build succeeds.
37. Production admin build succeeds.
38. Backend build succeeds.
39. README contains setup instructions.
40. No critical TypeScript/build errors remain.

---

# 106. IMPORTANT FINAL INSTRUCTION

Do not treat this request as:

"Create an e-commerce homepage."

Treat it as:

"Engineer a production-grade fashion commerce platform."

The most important areas are:

PREMIUM UI/UX

DYNAMIC CMS

PRODUCT VARIANTS

INVENTORY

ORDERS

CAMPAIGNS

CHECKOUT

PERFORMANCE

RESPONSIVE DESIGN

ADMIN CONTROL

SECURITY

ANIMATIONS

SCALABILITY.

Start by examining the current VS Code workspace and producing the architecture/folder plan.

Then immediately start implementation.

Do not stop at the planning stage.

Build the actual application step-by-step, test each major module as it is completed, and keep the project runnable throughout development.
