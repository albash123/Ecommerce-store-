import type { MetadataRoute } from 'next';
import type { SiteContent,Product,Paginated } from '@vanta/types';
import { api } from '@/lib/api';
export const dynamic='force-dynamic';
export default async function sitemap():Promise<MetadataRoute.Sitemap>{const base=process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000';const content=await api<SiteContent>('/content');const paths=new Set(['','/shop','/men','/women','/contact',...content.categories.map(c=>`/categories/${c.slug}`),...content.collections.map(c=>`/collections/${c.slug}`)]);let page=1,pages=1;do{const batch=await api<Paginated<Product>>(`/products?page=${page}&pageSize=100`);batch.items.forEach(product=>paths.add(`/products/${product.slug}`));pages=batch.pages;page++;}while(page<=pages);for(const item of content.menus.footer){if(item.href.startsWith('/pages/'))paths.add(item.href);}return [...paths].map(path=>({url:`${base}${path}`,changeFrequency:path?'weekly':'daily',priority:path?0.7:1}));}
