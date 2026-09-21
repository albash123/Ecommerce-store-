'use client';
import {useRef,useState} from 'react';
import Link from 'next/link';
import type {Product} from '@vanta/types';
import {money} from '@/lib/api';
type Marker={productId:string;x:number;y:number};
export function ShopTheLook({image,alt,products,markers,currency}:{image:string;alt:string;products:Product[];markers:Marker[];currency:string}){
 const dialog=useRef<HTMLDialogElement>(null);
 const[selected,setSelected]=useState<Product>();
 if(!image)return null;
 return <><div className="look-image"><img src={image} alt={alt} loading="lazy"/>{products.map((product,index)=>{const marker=markers.find(m=>m.productId===product.id);return <button key={product.id} className="look-marker" style={{left:`${Math.min(95,Math.max(5,marker?.x??25+index*15))}%`,top:`${Math.min(95,Math.max(5,marker?.y??50))}%`}} aria-label={`Explore ${product.name}`} onClick={()=>{setSelected(product);dialog.current?.showModal();}}>{index+1}</button>;})}</div><dialog ref={dialog} className="look-dialog"><button className="underlined" onClick={()=>dialog.current?.close()}>Close</button>{selected&&<><img src={selected.images[0]?.url} alt={selected.images[0]?.alt||selected.name}/><h3>{selected.name}</h3><p>{money(selected.salePrice??selected.price,currency)}</p><Link className="button full" href={`/products/${selected.slug}`}>View product</Link></>}</dialog></>;
}
