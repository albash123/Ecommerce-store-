import type { ApiResponse } from '@vanta/types';
export const API_URL = (typeof window === 'undefined' ? process.env.API_URL : undefined) || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
export class ApiError extends Error { constructor(message:string,public status:number){super(message);this.name='ApiError';} }
let refresh:Promise<boolean>|null=null;
export async function api<T>(path: string, init: RequestInit = {}, retry=true): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { ...init, credentials: 'include', cache: 'no-store', headers: { ...(init.body && !(init.body instanceof FormData) ? {'Content-Type': 'application/json'} : {}), ...init.headers } });
  let result: ApiResponse<T>;
  try { result = await response.json(); } catch { throw new Error('The store is temporarily unavailable. Please try again shortly.'); }
  if(response.status===401&&retry&&typeof window!=='undefined'&&(path.startsWith('/account/')||path==='/auth/me'||path.startsWith('/orders/'))){
    refresh??=fetch(`${API_URL}/auth/refresh`,{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:'{}'}).then(r=>r.ok).catch(()=>false).finally(()=>{refresh=null;});
    if(await refresh)return api<T>(path,init,false);
  }
  if (!response.ok || !result.success) {const details=(result.errors||[]).map(error=>typeof error==='object'&&error!==null&&'message' in error?String(error.message):'').filter(Boolean);throw new ApiError(details.length?details.join('. '):result.message || 'Something went wrong. Please try again.',response.status);}
  return result.data;
}
export const post = <T>(path: string, data: unknown = {}) => api<T>(path, {method: 'POST', body: JSON.stringify(data)});
export function money(value: number, currency = 'PKR') { return new Intl.NumberFormat('en-PK', {style: 'currency', currency, maximumFractionDigits: 0}).format(value / 100); }
export const errorMessage = (error: unknown) => error instanceof Error ? error.message : 'Something went wrong. Please try again.';
export function safeHref(value: unknown, fallback = '/shop') { return typeof value === 'string' && /^\/(?!\/)/.test(value) ? value : fallback; }
