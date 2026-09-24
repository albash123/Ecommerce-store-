export function tagsText(value:unknown):string {
 return Array.isArray(value)?value.join(', '):'';
}

export function parseTags(value:unknown):string[] {
 const tags=typeof value==='string'?value.split(/[,\n]/):Array.isArray(value)?value:[];
 return [...new Set(tags.map(tag=>String(tag).trim()).filter(Boolean))];
}

export function parseJsonField(label:string,value:string):unknown {
 if(!value.trim())return null;
 try{return JSON.parse(value)}catch{throw new Error(`${label}: the structured data is invalid. Correct its format or clear this optional field.`)}
}

export function validateProductVariants(value:unknown):void {
 if(!Array.isArray(value)||!value.length)throw new Error('Product variants: add at least one variant with a SKU, color and size before saving.');
 const skus=new Map<string,number>();const options=new Map<string,number>();
 for(const [i,variant] of value.entries()){
  const sku=String(variant.sku||'').trim(),color=String(variant.color||'').trim(),size=String(variant.size||'').trim();
  if(!sku||!color||!size)throw new Error(`Variant ${i+1}: enter its SKU, color and size.`);
  if(skus.has(sku))throw new Error(`Variants ${skus.get(sku)} and ${i+1}: use a different SKU for each variant.`);
  const key=JSON.stringify([color,size]);
  if(options.has(key))throw new Error(`Variants ${options.get(key)} and ${i+1} both use ${color} / ${size}. Change the color or size, or remove the duplicate row.`);
  skus.set(sku,i+1);options.set(key,i+1);
 }
}

export function imageUrlError(value:string):string|undefined {
 if(!value.trim())return 'Enter a direct image URL or remove this image row.';
 if(/^\/(?!\/)/.test(value))return;
 try{
  const url=new URL(value);
  if(!['https:','http:'].includes(url.protocol))return 'Use an HTTP(S) image URL or a path starting with /.';
  const host=url.hostname.toLowerCase();
  if(((host==='bing.com'||host.endsWith('.bing.com'))&&url.pathname.startsWith('/images/search'))||
    (/^(www\.)?google\.[a-z.]+$/.test(host)&&['/search','/imgres'].includes(url.pathname)))
   return 'This is an image search page. Open the image itself and copy its image address, then paste that direct URL here.';
 }catch{return 'Use an HTTP(S) image URL or a path starting with /.'}
}
