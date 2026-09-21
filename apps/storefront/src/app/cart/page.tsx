'use client';
import Link from 'next/link';
import { useShop } from '@/lib/store';
import { money } from '@/lib/api';
import { BagLines } from '@/components/shell';
import { ArrowUpRight, ShoppingBag } from '@/components/icons';
export default function CartPage(){const {items,hydrated}=useShop();return <section className="section"><div className="section-heading"><div><span className="eyebrow">YOUR EVERYDAY STARTS HERE</span><h2>The bag.</h2></div><Link className="text-link" href="/shop">Keep exploring<ArrowUpRight size={16}/></Link></div>{!hydrated?<p>Loading your bag…</p>:items.length?<div className="checkout-layout"><BagLines/><aside className="order-summary"><h2>A good edit.</h2><div className="summary-row"><span>Items</span><span>{items.reduce((n,i)=>n+i.quantity,0)}</span></div><div className="summary-row total"><span>Subtotal</span><span>{money(items.reduce((n,i)=>n+i.price*i.quantity,0))}</span></div><p className="muted" style={{fontSize:11,margin:'20px 0'}}>Shipping, taxes and discounts are calculated at checkout.</p><Link href="/checkout" className="button full">Checkout<ArrowUpRight size={18}/></Link></aside></div>:<div className="empty-state"><ShoppingBag size={40}/><h3>A little room for something good.</h3><p>Your bag is currently empty.</p><Link className="button" href="/shop">Explore the collection</Link></div>}</section>;}
