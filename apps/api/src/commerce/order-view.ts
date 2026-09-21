import {Prisma} from '@prisma/client';
export const orderInclude={items:true,history:{orderBy:{createdAt:'asc' as const}},payments:true,refunds:true,shippingMethod:true} satisfies Prisma.OrderInclude;
export type FullOrder=Prisma.OrderGetPayload<{include:typeof orderInclude}>;
function adminOrderView(order:FullOrder){const{accessTokenHash,requestHash,idempotencyKey,userId,...view}=order;return view;}
function customerOrderView(order:FullOrder){const view=adminOrderView(order);const{notes,...customer}=view;void notes;return{...customer,history:order.history.map(({status,createdAt})=>({status,createdAt})),payments:order.payments.map(({provider,status,amount,createdAt})=>({provider,status,amount,createdAt})),refunds:order.refunds.map(({amount,reason,status,createdAt})=>({amount,reason,status,createdAt}))};}
export function orderView(order:FullOrder):ReturnType<typeof customerOrderView>;
export function orderView(order:FullOrder,admin:true):ReturnType<typeof adminOrderView>;
export function orderView(order:FullOrder,admin=false){return admin?adminOrderView(order):customerOrderView(order);}
