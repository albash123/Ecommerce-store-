import Link from 'next/link';
export default function NotFound(){return <div className="empty-state page-empty"><span className="eyebrow">404 / A DIFFERENT DIRECTION</span><h1>Not here. Still out there.</h1><p>That page doesn’t exist. Find your way back to the collection.</p><Link href="/shop" className="button">Explore the collection</Link></div>;}
