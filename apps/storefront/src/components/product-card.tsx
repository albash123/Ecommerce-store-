'use client';
import Link from 'next/link';
import type { Product } from '@vanta/types';
import { Heart } from './icons';
import { useShop } from '@/lib/store';
import { money } from '@/lib/api';
import { QuickAdd } from './quick-add';
export function ProductCard({product,currency='PKR'}:{product:Product;currency?:string}) { const {wishlist,toggleWish,hydrated}=useShop(); const saved=hydrated && wishlist.some(item=>item.id===product.id); const colors=[...new Map(product.variants.filter(v=>v.active).map(v=>[v.color,v.colorHex])).entries()]; return <article className="product-card"><div className="product-photo"><Link href={`/products/${product.slug}`} aria-label={`View ${product.name}`}><img src={product.images[0]?.url} alt={product.images[0]?.alt || product.name} loading="lazy"/>{product.images[1] && <img className="alternate-photo" src={product.images[1].url} alt={product.images[1].alt} loading="lazy"/>}</Link><span className="product-badge">{product.salePrice?'SPECIAL PRICE':product.isNew?'NEW ARRIVAL':product.bestSeller?'BESTSELLER':''}</span><button className={`wish-button ${saved?'saved':''}`} aria-label={`${saved?'Remove':'Save'} ${product.name} ${saved?'from':'to'} wishlist`} aria-pressed={saved} onClick={()=>toggleWish(product)}><Heart size={18} fill={saved?'currentColor':'none'}/></button><QuickAdd product={product} currency={currency}/></div><div className="product-info"><div><Link href={`/products/${product.slug}`}>{product.name}</Link><p>{product.fit || product.category?.name}</p></div><div className="product-price">{money(product.salePrice ?? product.price,currency)}{product.salePrice && <del>{money(product.price,currency)}</del>}</div></div><div className="swatches">{colors.slice(0,5).map(([name,hex])=><span key={name} title={name} style={{background:hex}}/>)}<small>{colors.length>1?`${colors.length} colors`:'One considered color'}</small></div></article>; }


