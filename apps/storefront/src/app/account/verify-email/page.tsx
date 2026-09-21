import { TokenAction } from '@/components/token-action';
export default async function Page({searchParams}:{searchParams:Promise<{token?:string}>}){const {token}=await searchParams;return <TokenAction action="verify-email" token={token||''}/>;}
