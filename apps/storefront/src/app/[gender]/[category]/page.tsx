import { notFound } from 'next/navigation';
import { CatalogPage } from '@/lib/catalog-page';
import { api } from '@/lib/api';
import type { Category } from '@vanta/types';
export default async function GenderCategory({params,searchParams}:{params:Promise<{gender:string;category:string}>;searchParams:Promise<Record<string,string>>}){const {gender,category:slug}=await params;if(!['men','women','unisex'].includes(gender))notFound();const categories=await api<Category[]>('/categories');const category=categories.find(c=>c.slug===slug);if(!category)notFound();return <CatalogPage searchParams={searchParams} fixed={{gender:gender.toUpperCase(),category:slug}} title={`${gender.toUpperCase()}'S ${category.name.toUpperCase()}`} description={category.description}/>;}
