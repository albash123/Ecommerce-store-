import { resource } from '@/lib/server-api';
import type { Metadata } from 'next';
import Link from 'next/link';
import { safeHref } from '@/lib/api';
import { ContactForm } from '@/components/contact';
const aliases:Record<string,string>={privacy:'privacy-policy',terms:'terms-and-conditions',returns:'returns-and-exchanges',shipping:'shipping-policy'};
interface Page {title:string;slug:string;body:unknown;seoTitle?:string;seoDescription?:string}
type Block={type?:string;text?:string;content?:string;heading?:string;title?:string;items?:string[];url?:string;src?:string;alt?:string;href?:string;label?:string;level?:number};
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;try{const page=await resource<Page>(`/pages/${aliases[slug]||slug}`);return {title:page.seoTitle||page.title,description:page.seoDescription,alternates:{canonical:`/pages/${aliases[slug]||slug}`}};}catch{return {title:'Page unavailable'};}}
export default async function CmsPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const page=await resource<Page>(`/pages/${aliases[slug]||slug}`);let blocks:Block[]=[];if(Array.isArray(page.body))blocks=page.body;else if(page.body&&typeof page.body==='object'&&'blocks' in page.body&&Array.isArray(page.body.blocks))blocks=page.body.blocks;else if(typeof page.body==='string')blocks=[{type:'paragraph',text:page.body}];return <article className="prose"><span className="eyebrow">FROM THE STUDIO</span><h1>{page.title}</h1>{blocks.filter(block=>!(block.type==='heading'&&block.text===page.title)).map((block,i)=>{if(block.type==='heading')return <h2 key={i}>{block.text||block.content||block.heading||block.title}</h2>;if(block.type==='image')return <img key={i} src={block.url||block.src} alt={block.alt||''} loading="lazy"/>;if(block.type==='list')return <ul key={i}>{block.items?.map((item,j)=><li key={j}>{item}</li>)}</ul>;if(block.type==='link')return <Link key={i} className="text-link" href={safeHref(block.href)}>{block.label||block.text} ↗</Link>;return <p key={i}>{block.text||block.content}</p>;})}{slug==='contact'&&<ContactForm/>}</article>;}




