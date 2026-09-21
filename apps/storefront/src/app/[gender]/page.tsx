import { notFound } from 'next/navigation';
import { CatalogPage } from '@/lib/catalog-page';
export default async function GenderPage({params,searchParams}:{params:Promise<{gender:string}>;searchParams:Promise<Record<string,string>>}){const {gender}=await params;if(!['men','women','unisex'].includes(gender))notFound();return <CatalogPage searchParams={searchParams} fixed={{gender:gender.toUpperCase()}} title={`${gender.toUpperCase()}'S ESSENTIALS`}/>;}
