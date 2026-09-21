import {ArgumentsHost,BadRequestException,Catch,ExceptionFilter,HttpException} from '@nestjs/common';
import {Prisma} from '@prisma/client';
import {ZodType,ZodError} from 'zod';
import {Response} from 'express';
export const ok=<T>(data:T,message?:string)=>({success:true,data,...(message?{message}:{})});
export function parse<T>(schema:ZodType<T>,value:unknown):T {const result=schema.safeParse(value);if(!result.success) throw new BadRequestException({message:'Validation failed',errors:result.error.issues.map(i=>({path:i.path.join('.'),message:i.message}))});return result.data;}
export function paging(q:Record<string,string>){const page=Math.max(1,Number.parseInt(q.page||'1')||1);const pageSize=Math.min(100,Math.max(1,Number.parseInt(q.pageSize||'24')||24));return{page,pageSize,skip:(page-1)*pageSize,take:pageSize};}
export const paginated=<T>(items:T[],total:number,page:number,pageSize:number)=>({items,total,page,pageSize,pages:Math.ceil(total/pageSize)});
@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(error:unknown,host:ArgumentsHost){const res=host.switchToHttp().getResponse<Response>();let status=500,message='An unexpected error occurred',errors:unknown[]=[];
    if(error instanceof HttpException){status=error.getStatus();const body=error.getResponse();message=typeof body==='string'?body:(body as {message:string}).message;errors=typeof body==='object'?(body as {errors?:unknown[]}).errors||[]:[];}
    else if(error instanceof ZodError){status=400;message='Validation failed';errors=error.issues;}
    else if(error instanceof Prisma.PrismaClientKnownRequestError){if(error.code==='P2002'){status=409;message='A record with these unique values already exists';}else if(error.code==='P2025'){status=404;message='Record not found';}else if(error.code==='P2003'){status=409;message='This record is referenced by other records';}else if(error.code==='P2034'){status=409;message='Concurrent update: please retry';}}
    if(status>=500) console.error(JSON.stringify({level:'error',event:'request_failed',type:error instanceof Error?error.name:'Unknown',message:error instanceof Error?error.message:'Unknown'}));
    res.status(status).json({success:false,message,errors});
  }
}
