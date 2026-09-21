'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartLine, Product } from '@vanta/types';
import { addLine, setQuantity } from './cart-core.mjs';
interface ShopStore { cartOwner: string | null; authenticatedUser: string | null; notice: string; items: CartLine[]; wishlist: Product[]; bagOpen: boolean; hydrated: boolean; add: (line: CartLine) => void; quantity: (id: string, value: number) => void; remove: (id: string) => void; clear: () => void; toggleWish: (product: Product) => void; openBag: (value: boolean) => void; hydrate: () => void }
export const useShop = create<ShopStore>()(persist((set) => ({cartOwner:null,authenticatedUser:null,notice:'',items: [], wishlist: [], bagOpen: false, hydrated: false, add: line => set(state => ({items: addLine(state.items, line), bagOpen: true})), quantity: (id, value) => set(state => ({items: setQuantity(state.items, id, value)})), remove: id => set(state => ({items: state.items.filter(item => item.variantId !== id)})), clear: () => set({items: []}), toggleWish: product => set(state => ({wishlist: state.wishlist.some(item => item.id === product.id) ? state.wishlist.filter(item => item.id !== product.id) : [...state.wishlist, product]})), openBag: value => set({bagOpen: value}), hydrate: () => set({hydrated: true})}), {name: 'vanta-bag', partialize: state => ({items: state.items, wishlist: state.wishlist,cartOwner:state.cartOwner}), onRehydrateStorage: () => state => state?.hydrate()}));

