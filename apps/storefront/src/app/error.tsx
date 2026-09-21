'use client';
export default function ErrorPage({reset}:{error:Error;reset:()=>void}){return <div className="empty-state page-empty"><span className="eyebrow">A SHORT INTERMISSION</span><h1>We’ll be right back.</h1><p>We couldn’t connect to the store. Please check your connection and try again.</p><button className="button" onClick={reset}>Try again</button></div>;}
