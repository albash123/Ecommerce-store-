import { OrderDetail } from '@/components/order-detail';
export const metadata={title:'Your order',robots:{index:false,follow:false}};
export default async function OrderPage({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{token?:string}>}){const {id}=await params;const {token}=await searchParams;return <OrderDetail id={id} token={token}/>;}
