'use client';
import {useQuery} from '@tanstack/react-query';
import {api,PageData} from '../lib/api';
const relations:Record<string,string>={categoryId:'categories',parentId:'categories',campaignId:'campaigns',roleId:'roles',shippingMethodId:'shipping'};
export function hasRelation(name:string){return name in relations}
export function RelationInput({name,value,required,onChange}:{name:string;value:string;required?:boolean;onChange:(v:string)=>void}){const resource=relations[name];const query=useQuery({queryKey:['relation',resource],queryFn:()=>api<PageData>(`/admin/${resource}?pageSize=100`)});return <><select id={'field-'+name} value={value} required={required} onChange={e=>onChange(e.target.value)}><option value="">{query.isPending?'Loading options…':'Select…'}</option>{query.data?.items.map(row=><option key={row.id} value={row.id}>{String(row.name||row.title||row.id)}</option>)}</select>{query.error&&<span className="error">{query.error.message}</span>}</>}
