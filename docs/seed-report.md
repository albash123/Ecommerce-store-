# Development seed report

`prisma/seed.ts` creates a repeatable development catalog without deleting existing records. Seed-owned records use stable IDs or unique keys and are updated in place on later runs.

## Seeded data

- 24 original VANTA STUDIO products across five categories
- 288 variants: Black and Stone, each in XS, S, M, L, XL, and XXL
- Per-variant inventory in the Karachi fulfilment warehouse
- Manual `New Arrivals` and `Season Shift` collections, plus a rules-based `Under PKR 5,000` collection
- `SEASON SHIFT` campaign, associated products, and a scheduled collection discount active from 2020 through 2030
- `WELCOME10` first-order coupon
- PKR 250 Pakistan shipping with free shipping at PKR 5,000
- Configurable zero-rate tax rule
- Three fictional customers with coherent paid, delivered orders, payment records, order histories, and verified reviews
- Super Admin, Store Manager, and Customer Support roles with real permission strings
- Header/footer menus, eight structured pages, site settings, and CMS homepage records for every supported section type
- Original local image assets from `/images/hero.png`, `/images/editorial.png`, `/images/tee-black.png`, and `/images/hoodie-stone.png`

## Safety and credentials

The script refuses to run when `NODE_ENV=production`. It requires strong values of at least 12 characters in both `SEED_ADMIN_PASSWORD` and `SEED_CUSTOMER_PASSWORD`; passwords are hashed with bcrypt and never stored in source. `SEED_ADMIN_EMAIL` defaults to `admin@example.com` for development only.

## Run

After dependencies, PostgreSQL, the Prisma client, and migrations are ready:

```bash
pnpm db:seed
```

All monetary integers are stored in paisa.
