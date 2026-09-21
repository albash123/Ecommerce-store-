import { Account } from '@/components/account';
import { TokenAction } from '@/components/token-action';
export const metadata={title:'Your account',robots:{index:false,follow:false}};
export default async function Page({searchParams}:{searchParams:Promise<{verify?:string;reset?:string}>}){const params=await searchParams;if(params.verify)return <TokenAction action="verify-email" token={params.verify}/>;if(params.reset)return <TokenAction action="reset-password" token={params.reset}/>;return <Account/>;}
