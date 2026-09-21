'use client';
import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { User, Product, Paginated, CartLine } from '@vanta/types';
import { api, post } from '@/lib/api';
import { useShop } from '@/lib/store';
import { X } from './icons';
type RemoteCart = {items: {variantId: string; quantity: number}[]};

export function SessionSync() {
  const {data: user} = useQuery({queryKey: ['me'], queryFn: () => api<User>('/auth/me'), retry: false});
  const hydrated = useShop(s => s.hydrated);
  const authenticatedUser = useShop(s => s.authenticatedUser);
  const items = useShop(s => s.items);
  const wishlist = useShop(s => s.wishlist);
  const notice = useShop(s => s.notice);
  const syncing = useRef(false);
  const previousWishes = useRef<string[]>([]);
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const currentUser = useRef(user?.id);
  currentUser.current = user?.id;

  useEffect(() => {
    if (!hydrated || !user || authenticatedUser === user.id || syncing.current) return;
    syncing.current = true;
    (async () => {
      try {
        const state = useShop.getState();
        const same = state.cartOwner === user.id;
        const [remote, wishes] = await Promise.all([
          same ? api<RemoteCart>('/account/cart') : post<RemoteCart>('/account/cart', {items: state.items.map(({variantId, quantity}) => ({variantId, quantity}))}),
          same ? api<Product[]>('/account/wishlist') : post<Product[]>('/account/wishlist', {productIds: state.wishlist.map(p => p.id)}),
        ]);
        const lines: CartLine[] = [];
        if (remote.items.length) {
          const products = await api<Paginated<Product>>(`/products?variantIds=${encodeURIComponent(remote.items.map(i => i.variantId).join(','))}&pageSize=100`);
          for (const item of remote.items) {
            const product = products.items.find(p => p.variants.some(v => v.id === item.variantId));
            const variant = product?.variants.find(v => v.id === item.variantId);
            if (!product || !variant || !variant.active || variant.stock <= 0) continue;
            lines.push({variantId: variant.id, quantity: Math.min(item.quantity, variant.stock), productId: product.id, name: product.name, slug: product.slug, image: variant.image || product.images[0]?.url || '', size: variant.size, color: variant.color, price: variant.salePrice ?? variant.price ?? product.salePrice ?? product.price, stock: variant.stock});
          }
        }
        if (currentUser.current === user.id) {
          previousWishes.current = wishes.map(p => p.id);
          useShop.setState({items: lines, wishlist: wishes, cartOwner: user.id, authenticatedUser: user.id});
        }
      } catch {
        if (currentUser.current === user.id) useShop.setState({notice: 'Your bag is saved on this device. We couldn’t sync your account. Please refresh to try again.'});
      } finally { syncing.current = false; }
    })();
  }, [hydrated, user, authenticatedUser]);

  useEffect(() => {
    if (!authenticatedUser) return;
    const timeout = setTimeout(() => {
      const payload = {items: items.map(({variantId, quantity}) => ({variantId, quantity}))};
      queue.current = queue.current.catch(() => {}).then(() => {
        if (currentUser.current === authenticatedUser) return api('/account/cart', {method: 'PUT', body: JSON.stringify(payload)});
      }).catch(() => useShop.setState({notice: 'Your bag is saved on this device. Account sync is temporarily unavailable.'}));
    }, 350);
    return () => clearTimeout(timeout);
  }, [items, authenticatedUser]);

  useEffect(() => {
    if (!authenticatedUser) return;
    const ids = wishlist.map(p => p.id);
    const timeout = setTimeout(() => {
      queue.current = queue.current.catch(() => {}).then(async () => {
        if (currentUser.current !== authenticatedUser) return;
        const removed = previousWishes.current.filter(id => !ids.includes(id));
        await post('/account/wishlist', {productIds: ids});
        await Promise.all(removed.map(id => api(`/account/wishlist/${id}`, {method: 'DELETE'})));
        previousWishes.current = ids;
      }).catch(() => useShop.setState({notice: 'Your favorites are saved on this device. Account sync is temporarily unavailable.'}));
    }, 350);
    return () => clearTimeout(timeout);
  }, [wishlist, authenticatedUser]);

  return notice ? <div className="toast" role="status"><span>{notice}</span><button className="icon-button" aria-label="Dismiss message" onClick={() => useShop.setState({notice: ''})}><X size={17}/></button></div> : null;
}
