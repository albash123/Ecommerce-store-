import {Body,Controller,Get,Inject,Param,Post} from '@nestjs/common';
import {Throttle} from '@nestjs/throttler';
import {z} from 'zod';
import {ContentService} from './content.service';
import {PrismaService} from '../common/prisma.service';
import {ok,parse} from '../common/http';
import {hashToken,secretToken} from '../common/security';
import {EmailService} from '../communications/email.service';
@Controller()
export class ContentController {
 constructor(@Inject(ContentService) private content:ContentService,@Inject(PrismaService) private db:PrismaService,@Inject(EmailService) private email:EmailService){}
 @Get('content') async get(){return ok(await this.content.content());}
 @Get('pages/:slug') async page(@Param('slug') slug:string){return ok(await this.content.page(slug));}
 @Get('campaigns/:slug') async campaign(@Param('slug') slug:string){return ok(await this.content.campaign(slug));}
 @Post('newsletter') @Throttle({default:{limit:5,ttl:60000}}) async subscribe(@Body() body:unknown){const p=parse(z.object({email:z.email().transform(v=>v.toLowerCase()),source:z.string().max(100).default('footer'),consent:z.literal(true)}),body);const token=secretToken();await this.db.newsletterSubscriber.upsert({where:{email:p.email},create:{email:p.email,source:p.source,tokenHash:hashToken(token)},update:{active:true,consentAt:new Date(),tokenHash:hashToken(token)}});await this.email.enqueue(p.email,'newsletter_welcome',{url:`${process.env.APP_URL}/account?unsubscribe=${token}`,message:`You subscribed. Unsubscribe: ${process.env.APP_URL}/account?unsubscribe=${token}`});return ok({message:'You’re on the list.'});}
 @Post('newsletter/unsubscribe') async unsubscribe(@Body() body:unknown){const{token}=parse(z.object({token:z.string().min(32)}),body);await this.db.newsletterSubscriber.updateMany({where:{tokenHash:hashToken(token)},data:{active:false}});return ok({message:'Subscription updated'});}
 @Post('contact') @Throttle({default:{limit:5,ttl:60000}}) async contact(@Body() body:unknown){const p=parse(z.object({name:z.string().trim().min(2).max(100),email:z.email(),phone:z.string().max(30).optional(),subject:z.string().trim().min(3).max(200),orderNumber:z.string().max(100).optional(),message:z.string().trim().min(10).max(5000)}).strict(),body);const inquiry=await this.db.inquiry.create({data:p});return ok({id:inquiry.id,message:'Your message has been received.'});}
}
