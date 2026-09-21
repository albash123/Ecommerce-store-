import { CatalogPage } from '@/lib/catalog-page';
import { api } from '@/lib/api';
import type { Collection } from '@vanta/types';
import { notFound } from 'next/navigation';
export default async function CollectionPage({params,searchParams}:{params:Promise<{slug:string}>;searchParams:Promise<Record<string,string>>}){const {slug}=await params;const collections=await api<Collection[]>('/collections');const collection=collections.find(c=>c.slug===slug);if(!collection)notFound();return <CatalogPage searchParams={searchParams} fixed={{collection:slug}} title={collection.name.toUpperCase()} description={collection.description}/>;}
