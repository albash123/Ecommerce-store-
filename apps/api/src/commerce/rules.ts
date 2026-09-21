export interface PriceLine {productId:string;categoryId:string;collectionIds:string[];price:number;quantity:number}
export interface CouponRule {type:string;value:number;minOrder:number;maxDiscount:number|null;productIds:string[];categoryIds:string[];collectionIds:string[];excludedProductIds:string[];buyQuantity:number;getQuantity:number}
export function calculateCoupon(rule:CouponRule,lines:PriceLine[]):{discount:number;freeShipping:boolean}{
 const subtotal=lines.reduce((s,l)=>s+l.price*l.quantity,0);if(subtotal<rule.minOrder)throw new Error('Coupon minimum order has not been reached');
 const scoped=rule.productIds.length||rule.categoryIds.length||rule.collectionIds.length;
 const eligible=lines.filter(l=>!rule.excludedProductIds.includes(l.productId)&&(!scoped||rule.productIds.includes(l.productId)||rule.categoryIds.includes(l.categoryId)||l.collectionIds.some(c=>rule.collectionIds.includes(c))));
 const amount=eligible.reduce((s,l)=>s+l.price*l.quantity,0);if(!amount)throw new Error('Coupon does not apply to these products');
 let discount=rule.type==='PERCENTAGE'?Math.round(amount*rule.value/100):rule.type==='FIXED'?rule.value:0;
 if(rule.type==='BUY_X_GET_Y'){const units=eligible.flatMap(l=>Array<number>(l.quantity).fill(l.price)).sort((a,b)=>a-b);const group=rule.buyQuantity+rule.getQuantity;if(group<=0||rule.buyQuantity<1||rule.getQuantity<1)throw new Error('Invalid offer configuration');const free=Math.floor(units.length/group)*rule.getQuantity;discount=units.slice(0,free).reduce((s,p)=>s+p,0);}
 return{discount:Math.max(0,Math.min(amount,discount,rule.maxDiscount??Number.MAX_SAFE_INTEGER)),freeShipping:rule.type==='FREE_SHIPPING'};
}
export function calculateTax(amount:number,rate:number,included:boolean):{tax:number;additional:number}{const tax=Math.round(included?amount*rate/(10000+rate):amount*rate/10000);return{tax,additional:included?0:tax};}
const transitions:Record<string,string[]>={PENDING:['CONFIRMED','CANCELLED'],CONFIRMED:['PROCESSING','CANCELLED'],PROCESSING:['PACKED','CANCELLED'],PACKED:['SHIPPED','CANCELLED'],SHIPPED:['OUT_FOR_DELIVERY','DELIVERED'],OUT_FOR_DELIVERY:['DELIVERED'],DELIVERED:['RETURNED'],RETURNED:['REFUNDED'],CANCELLED:[],REFUNDED:[]};
export function canTransition(from:string,to:string){return(transitions[from]||[]).includes(to);}
export function mergeQuantities(items:{variantId:string;quantity:number}[]){const map=new Map<string,number>();for(const item of items)map.set(item.variantId,(map.get(item.variantId)||0)+item.quantity);return[...map].map(([variantId,quantity])=>({variantId,quantity}));}
