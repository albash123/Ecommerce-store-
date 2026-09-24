import { describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import type { PrismaClient } from '@prisma/client';
import { bootstrapProduction } from '../prisma/bootstrap-production';

type Row = Record<string, unknown>;
function memoryDatabase() {
  const tables = new Map<string, Map<string, Row>>();
  const table = (name: string) => {
    if (!tables.has(name)) tables.set(name, new Map());
    return tables.get(name)!;
  };
  const client = new Proxy({}, {
    get(_target, name: string) {
      if (name === '$transaction') return async (run: (db: unknown) => Promise<unknown>) => run(client);
      return {
        createMany: async ({ data }: { data: Row[] }) => {
          for (const item of data) {
            const key = name === 'productVariant' ? String(item.sku) : `${item.variantId}:${item.warehouseId}`;
            if (!table(name).has(key)) table(name).set(key, { id: `${name}-${table(name).size}`, ...item });
          }
        },
        findMany: async ({ where }: { where: { sku: { in: string[] } } }) => [...table(name).values()].filter((row) => where.sku.in.includes(String(row.sku))),
        count: async () => [...table(name).values()].filter((row) => row.kind === 'ADMIN').length,
        create: async ({ data }: { data: Row }) => {
          const row = { id: `${name}-${table(name).size}`, ...data };
          table(name).set(String(row.id), row);
          return row;
        },
        upsert: async ({ where, create, update }: { where: Row; create: Row; update: Row }) => {
          const key = JSON.stringify(where);
          const existing = table(name).get(key);
          const row = existing ? { ...existing, ...update } : { id: `${name}-${table(name).size}`, ...create };
          table(name).set(key, row);
          return row;
        },
      };
    },
  }) as PrismaClient;
  return { client, tables, table };
}

const environment = {
  DATABASE_URL: 'postgresql://unused.example/database',
  APP_URL: 'https://store.example',
  INITIAL_ADMIN_EMAIL: 'owner@example.com',
  INITIAL_ADMIN_NAME: 'Store Owner',
  INITIAL_ADMIN_PASSWORD: 'TestBootstrapPass123',
};

describe('production bootstrap', () => {
  it('creates catalog, CMS and one hashed admin without fabricated sales or available stock', async () => {
    const db = memoryDatabase();
    expect(await bootstrapProduction(db.client, environment)).toEqual({ adminCreated: true });
    expect(db.table('product').size).toBe(24);
    expect(db.table('homepageSection').size).toBe(10);
    expect(db.table('inventory').size).toBe(288);
    expect([...db.table('inventory').values()].every((row) => row.quantity === 0 && row.reserved === 0)).toBe(true);
    const users = [...db.table('user').values()];
    expect(users).toHaveLength(1);
    expect(users[0]).toMatchObject({ email: 'owner@example.com', kind: 'ADMIN', verified: true });
    expect(users[0].passwordHash).not.toBe(environment.INITIAL_ADMIN_PASSWORD);
    expect(String(users[0].passwordHash)).toMatch(/^\$2[aby]\$/);
    for (const model of ['customerAddress', 'order', 'orderItem', 'payment', 'paymentTransaction', 'review']) expect(db.tables.has(model)).toBe(false);
    expect([...db.table('productImage').values()].every((row) => String(row.url).startsWith('https://store.example/images/'))).toBe(true);
  });

  it('preserves edited content, inventory and administrator credentials on rerun', async () => {
    const db = memoryDatabase();
    await bootstrapProduction(db.client, environment);
    const product = [...db.table('product').values()][0];
    product.name = 'Owner-edited product';
    const stock = [...db.table('inventory').values()][0];
    stock.quantity = 73;
    const initialUser = structuredClone([...db.table('user').values()][0]);
    expect(await bootstrapProduction(db.client, { DATABASE_URL: environment.DATABASE_URL, APP_URL: environment.APP_URL })).toEqual({ adminCreated: false });
    expect([...db.table('product').values()][0].name).toBe('Owner-edited product');
    expect([...db.table('inventory').values()][0].quantity).toBe(73);
    expect([...db.table('user').values()]).toEqual([initialUser]);
    expect(db.table('product').size).toBe(24);
  });

  it('rejects missing production configuration or admin credentials before writing records', async () => {
    const db = memoryDatabase();
    await expect(bootstrapProduction(db.client, {})).rejects.toThrow('DATABASE_URL must');
    await expect(bootstrapProduction(db.client, { ...environment, APP_URL: 'http://localhost:3000' })).rejects.toThrow('APP_URL must');
    await expect(bootstrapProduction(db.client, { ...environment, INITIAL_ADMIN_PASSWORD: '' })).rejects.toThrow('Set INITIAL_ADMIN_');
    expect([...db.tables.values()].every((table) => table.size === 0)).toBe(true);
  });

  it('the CLI refuses missing explicit configuration even when a local .env exists', () => {
    const result = spawnSync(process.execPath, ['--experimental-strip-types', 'scripts/bootstrap-production.mjs'], {
      cwd: resolve(import.meta.dirname, '..'),
      env: { ...process.env, DATABASE_URL: '', APP_URL: '' },
      encoding: 'utf8',
    });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('DATABASE_URL must be supplied explicitly.');
    expect(result.stdout).not.toContain('initialized');
  });
});
