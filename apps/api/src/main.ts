import 'reflect-metadata';
import {config} from 'dotenv';
import {resolve} from 'node:path';
import {NestFactory} from '@nestjs/core';
import {DocumentBuilder,SwaggerModule} from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import {Request,Response,NextFunction} from 'express';
import {AppModule} from './app.module';
import {ApiExceptionFilter} from './common/http';
config({path:resolve(__dirname,'../../../.env'),quiet:true});
async function bootstrap(){
 for(const key of ['DATABASE_URL','JWT_SECRET','JWT_REFRESH_SECRET','APP_URL','ADMIN_URL'])if(!process.env[key])throw new Error(`Missing required environment setting: ${key}`);
 for(const key of ['JWT_SECRET','JWT_REFRESH_SECRET'])if(process.env[key]!.length<32||process.env[key]!.startsWith('replace-'))throw new Error(`${key} must be a strong random secret`);
 if(process.env.NODE_ENV==='production'&&(!process.env.APP_URL!.startsWith('https://')||!process.env.ADMIN_URL!.startsWith('https://')))throw new Error('Production app origins must use HTTPS');
 const app=await NestFactory.create(AppModule,{rawBody:true,logger:['error','warn','log']});app.setGlobalPrefix('api');app.use(helmet({contentSecurityPolicy:process.env.NODE_ENV==='production'?undefined:false}));app.use(cookieParser());
 const origins=[process.env.APP_URL!,process.env.ADMIN_URL!];app.enableCors({origin:origins,credentials:true,methods:['GET','POST','PUT','PATCH','DELETE','OPTIONS']});
 app.use((req:Request,res:Response,next:NextFunction)=>{if(!['GET','HEAD','OPTIONS'].includes(req.method)&&req.path!=='/api/payments/stripe/webhook'){const origin=req.headers.origin;const cookieAuth=Boolean(req.cookies?.access_token||req.cookies?.refresh_token);if(origin&&!origins.includes(origin)||cookieAuth&&!origin)return res.status(403).json({success:false,message:'Invalid request origin',errors:[]});}next();});
 app.useGlobalFilters(new ApiExceptionFilter());app.enableShutdownHooks();if(process.env.NODE_ENV!=='production'){const doc=new DocumentBuilder().setTitle('Fashion Commerce API').setDescription('Authenticated administration and public commerce REST endpoints. See docs/api-contract.md for schemas. Money uses currency minor units.').setVersion('1.0').addCookieAuth('access_token').build();SwaggerModule.setup('api/docs',app,SwaggerModule.createDocument(app,doc));}
 await app.listen(Number(process.env.PORT||4000),process.env.BIND_ADDRESS||'127.0.0.1');console.log(JSON.stringify({level:'info',event:'api_ready',port:Number(process.env.PORT||4000)}));
}
bootstrap().catch(error=>{console.error(error instanceof Error?error.message:'API startup failed');process.exit(1);});
