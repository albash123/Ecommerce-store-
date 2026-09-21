import {config} from 'dotenv';
import {PrismaClient,Prisma} from '@prisma/client';
import bcrypt from 'bcryptjs';
import {z} from 'zod';
import {resolve} from 'node:path';

config({path:resolve(import.meta.dirname,'../.env'),quiet:true});
const input=z.object({
 email:z.email().transform(value=>value.toLowerCase()),
 name:z.string().trim().min(2).max(100),
 password:z.string().min(16).max(128).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/),
}).safeParse({email:process.env.INITIAL_ADMIN_EMAIL,name:process.env.INITIAL_ADMIN_NAME,password:process.env.INITIAL_ADMIN_PASSWORD});
if(!input.success){
 console.error('Set INITIAL_ADMIN_EMAIL, INITIAL_ADMIN_NAME, and INITIAL_ADMIN_PASSWORD (16+ characters, uppercase, lowercase and a number). Values are never printed.');
 process.exitCode=1;
}else{
 const db=new PrismaClient();
 try{
  const passwordHash=await bcrypt.hash(input.data.password,12);
  await db.$transaction(async tx=>{
   if(await tx.user.count({where:{kind:'ADMIN'}}))throw new Error('An administrator already exists. Use the authenticated user-management workflow.');
   const role=await tx.role.upsert({where:{name:'Initial Administrator'},update:{permissions:['*']},create:{name:'Initial Administrator',permissions:['*']}});
   await tx.user.create({data:{email:input.data.email,name:input.data.name,passwordHash,kind:'ADMIN',roleId:role.id,active:true,verified:true}});
  },{isolationLevel:Prisma.TransactionIsolationLevel.Serializable});
  console.log('Initial administrator created. Remove INITIAL_ADMIN_PASSWORD from the deployment environment.');
 }catch(error){console.error(error instanceof Prisma.PrismaClientKnownRequestError?'Administrator creation failed; check database constraints and existing accounts.':error instanceof Error?error.message:'Administrator creation failed');process.exitCode=1;}
 finally{await db.$disconnect();}
}
