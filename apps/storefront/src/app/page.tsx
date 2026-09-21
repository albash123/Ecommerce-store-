import { api } from '@/lib/api';
import type { SiteContent } from '@vanta/types';
import { HomeSections } from '@/components/home-sections';
export const dynamic='force-dynamic';
export default async function Home(){const content=await api<SiteContent>('/content');return <HomeSections content={content}/>;}
