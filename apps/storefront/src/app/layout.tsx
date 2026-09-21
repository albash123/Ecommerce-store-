import type { Metadata } from 'next';
import type { SiteContent } from '@vanta/types';
import { api } from '@/lib/api';
import { Providers } from '@/components/providers';
import { Header, Footer } from '@/components/shell';
import './globals.css';
export const metadata: Metadata = {metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),title:{default:'VANTA STUDIO — Considered essentials',template:'%s | VANTA STUDIO'},description:'Considered clothing for a life in motion. Explore the latest collection from VANTA STUDIO.',openGraph:{type:'website',siteName:'VANTA STUDIO',title:'VANTA STUDIO — Considered essentials',description:'The everyday, reconsidered.'}};
export default async function RootLayout({children}:{children:React.ReactNode}) { let content:SiteContent|null=null;try{content=await api<SiteContent>('/content');}catch{/* Optional presentation data unavailable. */}return <html lang="en"><body><Providers><Header content={content}/><main id="main">{children}</main><Footer content={content}/></Providers></body></html>; }

