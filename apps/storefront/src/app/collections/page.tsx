import Link from 'next/link';
import type { Collection } from '@vanta/types';
import { api } from '@/lib/api';
import { ArrowUpRight } from '@/components/icons';
export const metadata={title:'Collections'};
export default async function Collections(){const collections=await api<Collection[]>('/collections');return <section className="section"><div className="catalog-heading"><div><span className="eyebrow">CONSIDERED TOGETHER</span><h1>THE COLLECTIONS.</h1><p>Different perspectives. One considered everyday.</p></div></div><div className="collection-grid">{collections.map((c,i)=><Link key={c.id} href={`/collections/${c.slug}`} className="collection-card">{c.image&&<img src={c.image} alt={c.name}/>}<div><span className="eyebrow">EDIT / {String(i+1).padStart(2,'0')}</span><h2>{c.name}</h2><p>{c.description}</p><span className="text-link">Explore the edit<ArrowUpRight size={17}/></span></div></Link>)}</div></section>;}
