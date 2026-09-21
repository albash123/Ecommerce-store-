import type { SiteContent } from '@vanta/types';
import { api } from '@/lib/api';
import { ContactForm } from '@/components/contact';
export const metadata={title:'Contact the studio'};
export default async function Contact(){const {settings}=await api<SiteContent>('/content');return <section className="section"><div className="catalog-heading"><div><span className="eyebrow">A CONVERSATION STARTS HERE</span><h1>LET’S TALK.</h1><p>Questions about an order, a fit, or something else? We’re here.</p></div></div><div className="checkout-layout"><ContactForm/><div><span className="eyebrow">DIRECT TO THE STUDIO</span><h2 style={{fontSize:28,letterSpacing:'-.04em',margin:'20px 0'}}>Good conversations.<br/>Better everyday.</h2><a className="underlined" href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a><p className="muted" style={{marginTop:30,fontSize:12}}>For order questions, include your order number so we can help you faster.</p></div></div></section>;}
