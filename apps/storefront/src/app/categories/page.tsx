import Link from 'next/link';
import type { Category } from '@vanta/types';
import { api } from '@/lib/api';
import { ArrowUpRight } from '@/components/icons';
export const metadata={title:'Explore categories'};
export default async function Categories(){const categories=await api<Category[]>('/categories');return <section className="section"><div className="catalog-heading"><div><span className="eyebrow">BUILD YOUR ROTATION</span><h1>THE ESSENTIALS.</h1></div></div><div className="collection-grid">{categories.map(c=><Link className="collection-card" href={`/categories/${c.slug}`} key={c.id}>{c.image&&<img src={c.image} alt={c.name}/>}<div><h2>{c.name}</h2><p>{c.description}</p><span className="text-link">Explore<ArrowUpRight size={17}/></span></div></Link>)}</div></section>;}
