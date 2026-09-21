export const API=process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
export type Row=Record<string,unknown> & {id:string};
export type Field={name:string;label:string;type:string;required?:boolean;options?:(string|{label:string;value:string})[];default?:unknown};
export type Resource={key:string;label:string;permission:string;readOnly?:boolean;canCreate?:boolean;canEdit?:boolean;canDelete?:boolean;fields:Field[];columns:string[]};
export type PageData={items:Row[];total:number;page:number;pageSize:number;totalPages?:number};
let refresh:Promise<boolean>|undefined;
export async function api<T>(path:string,method='GET',body?:unknown):Promise<T>{
  const options:RequestInit={method,credentials:'include',headers:body instanceof FormData?{}:{'Content-Type':'application/json'},body:body===undefined?undefined:body instanceof FormData?body:JSON.stringify(body)};
  let response=await fetch(API+path,options);
  if(response.status===401&&!['/auth/login','/auth/refresh','/auth/logout'].includes(path)){
    refresh??=fetch(API+'/auth/refresh',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:'{}'}).then(r=>r.ok).catch(()=>false).finally(()=>{refresh=undefined});
    if(await refresh)response=await fetch(API+path,options);
  }
  const payload=await response.json();
  if(!response.ok||payload.success===false)throw new Error(payload.message||'Request failed');
  return payload.data;
}
export const money=(value:unknown)=>new Intl.NumberFormat('en-PK',{style:'currency',currency:'PKR',maximumFractionDigits:0}).format(Number(value||0)/100);
export const title=(s:string)=>s.replace(/([A-Z])/g,' $1').replace(/[-_]/g,' ').replace(/^./,c=>c.toUpperCase());
export function display(value:unknown):string{if(value==null)return '—';if(typeof value==='boolean')return value?'Yes':'No';if(Array.isArray(value))return `${value.length} items`;if(typeof value==='object')return String((value as Record<string,unknown>).name||JSON.stringify(value));return String(value)}

export const mediaUrl=(value:string)=>value.startsWith('/')?(process.env.NEXT_PUBLIC_STOREFRONT_URL||'http://localhost:3000')+value:value;
