import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

export type BootstrapEnvironment = {
  DATABASE_URL?: string;
  APP_URL?: string;
  INITIAL_ADMIN_EMAIL?: string;
  INITIAL_ADMIN_NAME?: string;
  INITIAL_ADMIN_PASSWORD?: string;
};

export async function bootstrapProduction(db: PrismaClient, env: BootstrapEnvironment) {
  if (!env.DATABASE_URL) throw new Error('DATABASE_URL must be supplied explicitly.');
  const origin = z.url().safeParse(env.APP_URL);
  if (!origin.success || new URL(origin.data).protocol !== 'https:') {
    throw new Error('APP_URL must be the HTTPS storefront URL.');
  }
  const asset = (path: string) => new URL(path, origin.data).href;
  return db.$transaction(async (prisma) => {
    const adminExists = await prisma.user.count({ where: { kind: 'ADMIN' } });
    if (!adminExists) {
      const input = z.object({
        email: z.email().transform((value) => value.toLowerCase()),
        name: z.string().trim().min(2).max(100),
        password: z.string().min(10).max(128).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/),
      }).safeParse({ email: env.INITIAL_ADMIN_EMAIL, name: env.INITIAL_ADMIN_NAME, password: env.INITIAL_ADMIN_PASSWORD });
      if (!input.success) throw new Error('Set INITIAL_ADMIN_EMAIL, INITIAL_ADMIN_NAME and INITIAL_ADMIN_PASSWORD (10+ characters, uppercase, lowercase and number).');
      const role = await prisma.role.upsert({ where: { name: 'Initial Administrator' }, update: {}, create: { name: 'Initial Administrator', permissions: ['*'] } });
      await prisma.user.create({ data: { email: input.data.email, name: input.data.name, passwordHash: await bcrypt.hash(input.data.password, 12), kind: 'ADMIN', verified: true, active: true, roleId: role.id } });
    }
    await seedCatalog(prisma, asset);
    return { adminCreated: !adminExists };
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable, timeout: 300000, maxWait: 10000 });
}

async function seedCatalog(prisma: Prisma.TransactionClient, asset: (path: string) => string) {
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;
const colors = [
  { name: 'Black', hex: '#161616', code: 'BLK' },
  { name: 'Stone', hex: '#D5CCBC', code: 'STN' },
] as const;
const imageFor = (kind: string) => kind === 'hoodie' || kind === 'sweatshirt' ? asset('/images/hoodie-stone.png') : asset('/images/tee-black.png');
const money = (rupees: number) => rupees * 100;
const id = (value: string) => `seed-${value}`;

const productSpecs = [
  ['Quiet Form Tee', 'quiet-form-tee', 'QFT', 'Men T-Shirts', 'MEN', 'tee', 3490],
  ['Axis Heavy Tee', 'axis-heavy-tee', 'AHT', 'Men T-Shirts', 'MEN', 'tee', 3890],
  ['After Hours Tee', 'after-hours-tee', 'AFT', 'Men T-Shirts', 'MEN', 'tee', 3690],
  ['Field Note Tee', 'field-note-tee', 'FNT', 'Men T-Shirts', 'MEN', 'tee', 3290],
  ['Studio Weight Tee', 'studio-weight-tee', 'SWT', 'Men T-Shirts', 'MEN', 'tee', 4190],
  ['Parallel Tee', 'parallel-tee', 'PRT', 'Men T-Shirts', 'MEN', 'tee', 3590],
  ['Soft Structure Tee', 'soft-structure-tee', 'SST', 'Women T-Shirts', 'WOMEN', 'tee', 3490],
  ['Contour Relaxed Tee', 'contour-relaxed-tee', 'CRT', 'Women T-Shirts', 'WOMEN', 'tee', 3690],
  ['Everyday Line Tee', 'everyday-line-tee', 'ELT', 'Women T-Shirts', 'WOMEN', 'tee', 3290],
  ['Motion Crop Tee', 'motion-crop-tee', 'MCT', 'Women T-Shirts', 'WOMEN', 'tee', 3390],
  ['Still Life Tee', 'still-life-tee', 'SLT', 'Women T-Shirts', 'WOMEN', 'tee', 3890],
  ['Open Frame Tee', 'open-frame-tee', 'OFT', 'Women T-Shirts', 'WOMEN', 'tee', 3590],
  ['Monument Oversized Tee', 'monument-oversized-tee', 'MOT', 'Oversized T-Shirts', 'UNISEX', 'tee', 4290],
  ['Common Ground Tee', 'common-ground-tee', 'CGT', 'Oversized T-Shirts', 'UNISEX', 'tee', 4490],
  ['Negative Space Tee', 'negative-space-tee', 'NST', 'Oversized T-Shirts', 'UNISEX', 'tee', 4590],
  ['Daily Volume Tee', 'daily-volume-tee', 'DVT', 'Oversized T-Shirts', 'UNISEX', 'tee', 4190],
  ['Foundry Pullover', 'foundry-pullover', 'FDP', 'Hoodies', 'MEN', 'hoodie', 7490],
  ['Transit Pullover', 'transit-pullover', 'TRP', 'Hoodies', 'MEN', 'hoodie', 7890],
  ['Drift Pullover', 'drift-pullover', 'DRP', 'Hoodies', 'WOMEN', 'hoodie', 7290],
  ['Sunday Structure Hoodie', 'sunday-structure-hoodie', 'SSH', 'Hoodies', 'WOMEN', 'hoodie', 7690],
  ['Blank Canvas Hoodie', 'blank-canvas-hoodie', 'BCH', 'Hoodies', 'UNISEX', 'hoodie', 8190],
  ['North Block Hoodie', 'north-block-hoodie', 'NBH', 'Hoodies', 'UNISEX', 'hoodie', 8490],
  ['Studio Loop Sweatshirt', 'studio-loop-sweatshirt', 'SLS', 'Sweatshirts', 'UNISEX', 'sweatshirt', 6490],
  ['Interval Sweatshirt', 'interval-sweatshirt', 'IVS', 'Sweatshirts', 'UNISEX', 'sweatshirt', 6790],
] as const;

const categorySpecs = [
  ['Men T-Shirts', 'men-t-shirts', 'Considered heavyweight T-shirts cut for men.', asset('/images/tee-black.png')],
  ['Women T-Shirts', 'women-t-shirts', 'Relaxed everyday T-shirts shaped for women.', asset('/images/editorial.png')],
  ['Oversized T-Shirts', 'oversized-t-shirts', 'Gender-inclusive volume, weight, and drape.', asset('/images/tee-black.png')],
  ['Hoodies', 'hoodies', 'Substantial fleece layers for everyday movement.', asset('/images/hoodie-stone.png')],
  ['Sweatshirts', 'sweatshirts', 'Clean crew layers with a relaxed studio fit.', asset('/images/editorial.png')],
] as const;

  const categories = new Map<string, { id: string; slug: string }>();
  for (const [position, [name, slug, description, image]] of categorySpecs.entries()) {
    const category = await prisma.category.upsert({
      where: { slug },
      update: {},
      create: { id: id(`category-${slug}`), name, slug, description, image, position, active: true, seoTitle: `${name} | VANTA STUDIO`, seoDescription: description },
    });
    categories.set(name, category);
  }

  const warehouse = await prisma.warehouse.upsert({
    where: { name: 'Karachi Fulfilment Studio' },
    update: {},
    create: { id: id('warehouse-karachi'), name: 'Karachi Fulfilment Studio' },
  });
  const productBySlug = new Map<string, { id: string; name: string; slug: string; price: number; sku: string; image: string }>();

  for (const [productIndex, [name, slug, sku, categoryName, gender, kind, rupees]] of productSpecs.entries()) {
    const category = categories.get(categoryName)!;
    const image = imageFor(kind);
    const product = await prisma.product.upsert({
      where: { slug },
      update: {},
      create: {
        id: id(`product-${slug}`), name, slug, sku, description: `${name} is cut from substantial cotton with a calm surface, generous shape, and finish made for repeat wear.`,
        shortDescription: 'Considered weight. Relaxed proportion. Built for everyday rotation.', price: money(rupees),
        salePrice: productIndex % 7 === 0 ? money(rupees - 500) : null, costPrice: money(Math.round(rupees * 0.42)), categoryId: category.id,
        gender, tags: ['essential', 'streetwear', kind], status: 'ACTIVE', visibility: true, featured: productIndex < 8,
        isNew: productIndex >= 16, bestSeller: productIndex % 6 === 0, material: kind === 'tee' ? '100% heavyweight combed cotton' : 'Heavyweight cotton-rich brushed fleece',
        fit: 'Oversized', care: 'Machine wash cold with like colors. Do not bleach. Line dry.', modelInfo: 'Relaxed unisex studio fit.',
        shippingInfo: 'Pakistan delivery in 2–5 working days.', returnInfo: 'Returns accepted within 14 days in original condition.',
        sizeGuide: { unit: 'cm', sizes: { XS: 48, S: 51, M: 54, L: 57, XL: 60, XXL: 63 } }, attributes: { weight: kind === 'tee' ? '260gsm' : '420gsm', finish: 'Garment washed' },
        seoTitle: `${name} | VANTA STUDIO`, seoDescription: `Shop the ${name}, an original premium streetwear essential.`, ogImage: image,
      },
    });
    productBySlug.set(slug, { id: product.id, name, slug, price: product.salePrice ?? product.price, sku, image });
    await prisma.productImage.upsert({
      where: { id: id(`image-${slug}-1`) },
      update: {},
      create: { id: id(`image-${slug}-1`), productId: product.id, url: image, alt: `${name} front view`, position: 0 },
    });
    for (const color of colors) {
      for (const size of sizes) {
        const variantSku = `${sku}-${color.code}-${size}`;
        const variant = await prisma.productVariant.upsert({
          where: { sku: variantSku },
          update: {},
          create: { id: id(`variant-${variantSku.toLowerCase()}`), productId: product.id, sku: variantSku, color: color.name, colorHex: color.hex, size, image, active: true, weight: kind === 'tee' ? 320 : 780, lowStockThreshold: 5 },
        });
        const quantity = 0;
        await prisma.inventory.upsert({
          where: { variantId_warehouseId: { variantId: variant.id, warehouseId: warehouse.id } },
          update: {},
          create: { variantId: variant.id, warehouseId: warehouse.id, quantity, reserved: 0 },
        });
      }
    }
  }

  const newArrivals = await prisma.collection.upsert({
    where: { slug: 'new-arrivals' },
    update: {},
    create: { id: id('collection-new-arrivals'), name: 'New Arrivals', slug: 'new-arrivals', description: 'The latest silhouettes from the studio.', image: asset('/images/hero.png'), active: true },
  });
  const seasonShift = await prisma.collection.upsert({
    where: { slug: 'season-shift' },
    update: {},
    create: { id: id('collection-season-shift'), name: 'Season Shift', slug: 'season-shift', description: 'Essential layers for changing pace and weather.', image: asset('/images/editorial.png'), active: true },
  });
  await prisma.collection.upsert({
    where: { slug: 'under-5000' },
    update: {},
    create: { id: id('collection-under-5000'), name: 'Under PKR 5,000', slug: 'under-5000', description: 'Dynamic edit of accessible studio essentials.', image: asset('/images/tee-black.png'), active: true, rules: { all: [{ field: 'price', operator: 'lte', value: money(5000) }, { field: 'status', operator: 'eq', value: 'ACTIVE' }] } },
  });
  const allProducts = [...productBySlug.values()];
  for (const product of allProducts.slice(16)) {
    await prisma.productCollection.upsert({ where: { productId_collectionId: { productId: product.id, collectionId: newArrivals.id } }, update: {}, create: { productId: product.id, collectionId: newArrivals.id } });
  }
  for (const product of allProducts.filter((entry) => entry.slug.includes('hoodie') || entry.slug.includes('pullover') || entry.slug.includes('sweatshirt'))) {
    await prisma.productCollection.upsert({ where: { productId_collectionId: { productId: product.id, collectionId: seasonShift.id } }, update: {}, create: { productId: product.id, collectionId: seasonShift.id } });
  }

  const campaign = await prisma.campaign.upsert({
    where: { slug: 'season-shift' },
    update: {},
    create: { id: id('campaign-season-shift'), name: 'SEASON SHIFT', slug: 'season-shift', description: 'A cross-category edit for changing days.', headline: "BUILT FOR WHAT'S NEXT.", subtitle: 'New silhouettes. Essential layers. Designed for everyday movement.', image: asset('/images/hero.png'), mobileImage: asset('/images/editorial.png'), themeColor: '#D5CCBC', textColor: '#FFFFFF', ctaText: 'SHOP THE DROP', ctaUrl: '/collections/season-shift', status: 'ACTIVE', startsAt: new Date('2020-01-01T00:00:00.000Z'), endsAt: new Date('2030-12-31T23:59:59.999Z') },
  });
  for (const product of allProducts.slice(0, 4).concat(allProducts.slice(16, 22))) {
    await prisma.campaignProduct.upsert({ where: { campaignId_productId: { campaignId: campaign.id, productId: product.id } }, update: {}, create: { campaignId: campaign.id, productId: product.id } });
  }
  await prisma.discount.upsert({
    where: { id: id('discount-season-shift') },
    update: {},
    create: { id: id('discount-season-shift'), name: 'Season Shift Edit', type: 'PERCENTAGE', value: 15, productIds: [], categoryIds: [], collectionIds: [seasonShift.id], startsAt: new Date('2020-01-01T00:00:00.000Z'), endsAt: new Date('2030-12-31T23:59:59.999Z'), active: true, campaignId: campaign.id },
  });

  await prisma.coupon.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: { id: id('coupon-welcome10'), code: 'WELCOME10', name: 'Welcome 10', description: 'Ten percent off a first order.', type: 'PERCENTAGE', value: 10, minOrder: money(3000), maxDiscount: money(2000), startsAt: new Date('2020-01-01T00:00:00.000Z'), endsAt: new Date('2030-12-31T23:59:59.999Z'), usageLimit: 10000, perCustomerLimit: 1, firstOrderOnly: true, active: true, productIds: [], categoryIds: [], collectionIds: [], excludedProductIds: [], customerEmails: [] },
  });

  await prisma.shippingMethod.upsert({
    where: { id: id('shipping-standard-pakistan') },
    update: {},
    create: { id: id('shipping-standard-pakistan'), name: 'Standard Pakistan Delivery', description: 'Tracked delivery in 2–5 working days.', price: money(250), freeAbove: money(5000), countries: ['PK'], cities: [], cod: true, active: true },
  });
  await prisma.taxRule.upsert({
    where: { id: id('tax-pakistan-standard') },
    update: {},
    create: { id: id('tax-pakistan-standard'), name: 'Pakistan Standard (configurable)', country: 'PK', taxClass: 'standard', rate: 0, included: false, active: true },
  });

  const settings: Record<string, Prisma.InputJsonValue> = {
    brandName: 'VANTA STUDIO', tagline: 'The everyday, reconsidered.', currency: 'PKR', currencySymbol: 'Rs.',
    contactEmail: 'hello@vantastudio.example', contactPhone: '+92 300 000 0000', country: 'PK', timezone: 'Asia/Karachi',
    announcement: 'FREE SHIPPING ON ORDERS OVER PKR 5,000', announcementLink: '/shop', announcementEnabled: true,
    freeShippingThreshold: money(5000), socialInstagram: 'https://instagram.com/vantastudio', defaultSeoTitle: 'VANTA STUDIO — Considered Streetwear',
    defaultSeoDescription: 'Original heavyweight essentials and relaxed layers designed for everyday movement.', taxRate: 0,
  };
  for (const [key, value] of Object.entries(settings)) {
    await prisma.siteSetting.upsert({ where: { key }, update: {}, create: { id: id(`setting-${key.toLowerCase()}`), key, value } });
  }

  const headerMenu = [
    { label: 'NEW', href: '/collections/new-arrivals' },
    { label: 'MEN', href: '/men', children: [{ label: 'T-Shirts', href: '/categories/men-t-shirts' }, { label: 'Hoodies', href: '/categories/hoodies' }] },
    { label: 'WOMEN', href: '/women', children: [{ label: 'T-Shirts', href: '/categories/women-t-shirts' }, { label: 'Hoodies', href: '/categories/hoodies' }] },
    { label: 'COLLECTIONS', href: '/collections', children: [{ label: 'Season Shift', href: '/collections/season-shift' }, { label: 'Under PKR 5,000', href: '/collections/under-5000' }] },
    { label: 'SALE', href: '/shop?sale=true' },
  ];
  const footerMenu = [
    { label: 'About', href: '/pages/about' }, { label: 'Contact', href: '/pages/contact' },
    { label: 'Shipping', href: '/pages/shipping-policy' }, { label: 'Returns', href: '/pages/returns-and-exchanges' },
    { label: 'FAQ', href: '/pages/faqs' }, { label: 'Size Guide', href: '/pages/size-guide' },
    { label: 'Privacy', href: '/pages/privacy-policy' }, { label: 'Terms', href: '/pages/terms-and-conditions' },
  ];
  await prisma.menu.upsert({ where: { name: 'header' }, update: {}, create: { id: id('menu-header'), name: 'header', items: headerMenu } });
  await prisma.menu.upsert({ where: { name: 'footer' }, update: {}, create: { id: id('menu-footer'), name: 'footer', items: footerMenu } });

  const pages = [
    ['About VANTA', 'about', 'We make considered essentials with weight, proportion, and repeat wear in mind.'],
    ['Contact', 'contact', 'Questions about fit, delivery, or an order? Contact hello@vantastudio.example.'],
    ['Privacy Policy', 'privacy-policy', 'We collect only the information needed to operate your account, fulfil orders, and improve the store.'],
    ['Terms & Conditions', 'terms-and-conditions', 'These terms govern purchases, account use, and access to the VANTA STUDIO storefront.'],
    ['Shipping Policy', 'shipping-policy', 'Pakistan delivery is PKR 250 and free on eligible orders over PKR 5,000.'],
    ['Returns & Exchanges', 'returns-and-exchanges', 'Unworn products in original condition may be returned within 14 days of delivery.'],
    ['Frequently Asked Questions', 'faqs', 'Find guidance on sizing, care, delivery, payments, and returns.'],
    ['Size Guide', 'size-guide', 'Choose your usual size for an oversized fit, or size down for a closer silhouette.'],
  ] as const;
  for (const [title, slug, copy] of pages) {
    const body = [{ type: 'heading', level: 1, text: title }, { type: 'paragraph', text: copy }];
    await prisma.page.upsert({ where: { slug }, update: {}, create: { id: id(`page-${slug}`), title, slug, body, status: 'PUBLISHED', seoTitle: `${title} | VANTA STUDIO`, seoDescription: copy, noindex: false } });
  }

  const featuredIds = allProducts.slice(0, 4).map((product) => product.id);
  const lookIds = [allProducts[12].id, allProducts[16].id, allProducts[18].id, allProducts[22].id];
  const sections = [
    ['hero', "BUILT FOR WHAT'S NEXT.", 'New silhouettes. Essential layers. Designed for everyday movement.', { image: asset('/images/hero.png'), mobileImage: asset('/images/editorial.png'), eyebrow: 'SEASON SHIFT / 26', ctaText: 'SHOP THE DROP', ctaUrl: '/collections/season-shift', secondaryText: 'Explore the studio', secondaryUrl: '/pages/about', background: '#161616', textColor: '#FFFFFF' }, true, campaign.id],
    ['products', 'THE NEW ROTATION.', 'Pieces with presence, built for repeat wear.', { eyebrow: 'NEW ARRIVALS', ctaText: 'VIEW ALL', ctaUrl: '/collections/new-arrivals', productIds: featuredIds, collectionSlug: 'new-arrivals', columns: 4 }, true, null],
    ['categories', 'CHOOSE YOUR POINT OF VIEW.', 'Five focused categories. One considered wardrobe.', { eyebrow: 'SHOP BY CATEGORY', ctaText: 'SHOP EVERYTHING', ctaUrl: '/shop', columns: 4 }, true, null],
    ['editorial', 'LESS, BUT BETTER.', 'Material, proportion, and the quiet details that make an everyday piece last.', { image: asset('/images/editorial.png'), eyebrow: 'STUDIO NOTES 01', ctaText: 'READ OUR STORY', ctaUrl: '/pages/about', imagePosition: 'left', background: '#E8E6DF', textColor: '#141414' }, true, null],
    ['campaign', 'SEASON SHIFT.', "Built for what's next, without leaving everyday comfort behind.", { image: asset('/images/hero.png'), eyebrow: 'THE CURRENT CAMPAIGN', ctaText: 'SHOP THE CAMPAIGN', ctaUrl: '/campaign/season-shift', imagePosition: 'right', background: '#161616', textColor: '#FFFFFF' }, true, campaign.id],
    ['shop-the-look', 'A COMPLETE ROTATION.', 'Weight, texture, and proportion designed to work together.', { eyebrow: 'SHOP THE LOOK', ctaText: 'EXPLORE THE EDIT', ctaUrl: '/collections/season-shift', image: asset('/images/editorial.png'), productIds: lookIds, columns: 4 }, true, null],
    ['announcement', 'FREE SHIPPING OVER PKR 5,000', 'DELIVERY ACROSS PAKISTAN', { ctaText: 'SHOP NOW', ctaUrl: '/shop', background: '#D5CCBC', textColor: '#161616' }, true, null],
    ['newsletter', 'NOTES FROM THE STUDIO.', 'New collections, quiet details, and early access. Sent occasionally.', { eyebrow: 'THE INNER CIRCLE', background: '#F5F5F3', textColor: '#161616' }, true, null],
    ['custom', 'CONSIDERED IN EVERY DETAIL.', 'Original garments. Responsible quantities. A slower point of view.', { eyebrow: 'OUR APPROACH', ctaText: 'DISCOVER VANTA', ctaUrl: '/pages/about', background: '#FFFFFF', textColor: '#161616' }, true, null],
    ['video', 'THE MAKING OF EVERYDAY.', 'A future studio-film slot, ready for media configured through the CMS.', { image: asset('/images/editorial.png'), videoUrl: '', eyebrow: 'STUDIO FILM', ctaText: 'OUR STORY', ctaUrl: '/pages/about', background: '#161616', textColor: '#FFFFFF' }, false, null],
  ] as const;
  for (const [position, section] of sections.entries()) {
    const [type, title, subtitle, config, enabled, campaignId] = section;
    await prisma.homepageSection.upsert({
      where: { id: id(`homepage-${type}`) },
      update: {},
      create: { id: id(`homepage-${type}`), type, title, subtitle, config, position, enabled, campaignId },
    });
  }


  for (const [index, [name, url, alt]] of [
    ['Season Shift Hero', asset('/images/hero.png'), 'Two models on brutalist concrete stairs'],
    ['Stone Hoodie Editorial', asset('/images/editorial.png'), 'Model wearing a stone hoodie in a concrete studio'],
    ['Black Oversized Tee', asset('/images/tee-black.png'), 'Black oversized T-shirt product view'],
    ['Stone Oversized Hoodie', asset('/images/hoodie-stone.png'), 'Stone oversized hoodie product view'],
  ].entries()) {
    await prisma.media.upsert({ where: { id: id(`media-${index + 1}`) }, update: {}, create: { id: id(`media-${index + 1}`), name, url, alt, mime: 'image/png' } });
  }


}
