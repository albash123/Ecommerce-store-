import {Prisma,PrismaClient} from '@prisma/client';
type Db=Prisma.TransactionClient|PrismaClient;
const privateKeys=new Set(['password','passwordHash','tokenHash','accessTokenHash','requestHash','idempotencyKey','secret','token']);
export function safeSnapshot(value:unknown):Prisma.InputJsonValue {return JSON.parse(JSON.stringify(value, (key,v)=>privateKeys.has(key)?'[REDACTED]':v)) as Prisma.InputJsonValue;}
export async function audit(db:Db,userId:string,action:string,entity:string,entityId:string,before?:unknown,after?:unknown){await db.auditLog.create({data:{userId,action,entity,entityId,...(before!==undefined?{before:safeSnapshot(before)}:{}),...(after!==undefined?{after:safeSnapshot(after)}:{})}});}
