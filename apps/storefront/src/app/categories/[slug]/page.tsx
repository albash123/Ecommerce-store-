import { CatalogPage } from '@/lib/catalog-page';
import { api } from '@/lib/api';
import type { Category } from '@vanta/types';
import { notFound } from 'next/navigation';
export default async function CategoryPage({params,searchParams}:{params:Promise<{slug:string}>;searchParams:Promise<Record<string,string>>}){const {slug}=await params;const categories=await api<Category[]>('/categories');const category=categories.find(c=>c.slug===slug);if(!category)notFound();return <CatalogPage searchParams={searchParams} fixed={{category:slug}} title={category.name.toUpperCase()} description={category.description}/>;}
