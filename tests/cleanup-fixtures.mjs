import 'dotenv/config';
import {PrismaClient} from '@prisma/client';
const url=new URL(process.env.DATABASE_URL||'');
if(!['localhost','127.0.0.1'].includes(url.hostname)||url.port!=='54329'||url.pathname!=='/vanta')throw new Error('Fixture cleanup is restricted to the local development database.');
const db=new PrismaClient();
try{
 const products=await db.product.updateMany({where:{slug:{startsWith:'qa-transaction-'},name:{startsWith:'QA Transaction Tee '}},data:{status:'ARCHIVED'}});
 const users=await db.user.updateMany({where:{OR:[{email:{startsWith:'qa-manager-',endsWith:'@example.com'},name:'QA Limited'},{email:{startsWith:'qa-customer-',endsWith:'@example.com'},name:'QA Customer'}]},data:{active:false}});
 console.log(`Archived ${products.count} QA products and disabled ${users.count} QA accounts. Order and audit history retained.`);
}finally{await db.$disconnect();}
