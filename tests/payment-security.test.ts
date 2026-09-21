import { describe, expect, it } from 'vitest';
import { couponOrderWhere } from '../apps/api/src/commerce/checkout.service';
import { canMarkReturnRefunded, reservedRefundAmount } from '../apps/api/src/commerce/orders.service';
import { orderView } from '../apps/api/src/commerce/order-view';

const order = {
  id: 'order-1', number: 'VA-1', userId: 'user-1', email: 'buyer@example.com',
  accessTokenHash: 'secret', idempotencyKey: 'key', requestHash: 'hash', status: 'CONFIRMED',
  paymentMethod: 'STRIPE', paymentStatus: 'PAID', subtotal: 1000, discount: 0, shipping: 0,
  tax: 0, total: 1000, currency: 'PKR', address: { city: 'Karachi' }, shippingMethodId: 'ship-1',
  couponId: null, trackingNumber: '', trackingUrl: '', notes: 'internal note', expiresAt: null,
  createdAt: new Date('2026-01-01'), updatedAt: new Date('2026-01-01'),
  items: [], shippingMethod: { id: 'ship-1', name: 'Standard', description: '', price: 0, freeAbove: null, countries: ['PK'], cities: [], minWeight: 0, maxWeight: null, minOrder: 0, maxOrder: null, cod: true, active: true },
  history: [{ id: 'history-1', orderId: 'order-1', status: 'CONFIRMED', note: 'private operations note', createdAt: new Date('2026-01-01') }],
  payments: [{ id: 'payment-1', orderId: 'order-1', provider: 'STRIPE', providerId: 'cs_secret', status: 'PAID', amount: 1000, createdAt: new Date('2026-01-01') }],
  refunds: [{ id: 'refund-1', orderId: 'order-1', amount: 100, reason: 'Return', providerId: 're_secret', status: 'COMPLETED', createdAt: new Date('2026-01-02') }],
} as never;

describe('payment and order security contracts', () => {
  it('hides provider identifiers and internal notes from the customer order view', () => {
    const view = orderView(order) as Record<string, unknown>;
    expect(view).not.toHaveProperty('notes');
    expect(view.payments).toEqual([{ provider: 'STRIPE', status: 'PAID', amount: 1000, createdAt: new Date('2026-01-01') }]);
    expect(view.refunds).toEqual([{ amount: 100, reason: 'Return', status: 'COMPLETED', createdAt: new Date('2026-01-02') }]);
    expect(view.history).toEqual([{ status: 'CONFIRMED', createdAt: new Date('2026-01-01') }]);
  });

  it('keeps provider details in the explicitly requested admin order view', () => {
    const view = orderView(order, true) as { payments: Array<{ providerId: string | null }> };
    expect(view.payments[0].providerId).toBe('cs_secret');
  });

  it('keys authenticated coupon history to the account while retaining canonical contact email', () => {
    expect(couponOrderWhere({ id: 'user-1', email: 'owner@example.com' }, 'delivery@example.com', 'coupon-1', false)).toEqual({
      status: { not: 'CANCELLED' }, couponId: 'coupon-1', OR: [{ userId: 'user-1' }, { userId: null, email: 'owner@example.com' }],
    });
  });

  it('reserves pending refund amounts and releases only definitive failures', () => {
    expect(reservedRefundAmount([{ amount: 400, status: 'PENDING' }, { amount: 300, status: 'COMPLETED' }, { amount: 200, status: 'FAILED' }])).toBe(700);
  });

  it('requires the complete order value to be refunded before a return is marked refunded', () => {
    expect(canMarkReturnRefunded(10_000, [{ amount: 9_999, status: 'COMPLETED' }])).toBe(false);
    expect(canMarkReturnRefunded(10_000, [{ amount: 10_000, status: 'COMPLETED' }])).toBe(true);
  });
});
