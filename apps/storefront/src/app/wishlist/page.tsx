'use client';
import Link from 'next/link';
import { useShop } from '@/lib/store';
import { ProductCard } from '@/components/product-card';
import { Heart } from '@/components/icons';
export default function WishlistPage(){const {wishlist,hydrated}=useShop();return <section className="section"><div className="section-heading"><div><span className="eyebrow">KEEP IT CLOSE</span><h2>Your wishlist.</h2></div><span className="muted">{hydrated?wishlist.length:0} pieces</span></div>{hydrated&&wishlist.length?<div className="product-grid">{wishlist.map(product=><ProductCard key={product.id} product={product}/>)}</div>:<div className="empty-state"><Heart size={36}/><h3>Some things stay with you.</h3><p>Save the pieces you love and find them here.</p><Link className="button" href="/shop">Find your favorites</Link></div>}</section>;}
