import {BadRequestException,Body,Controller,Inject,Post,Req,UseGuards} from '@nestjs/common';
import {z} from 'zod';
import {PrismaService} from '../common/prisma.service';
import {AuthGuard,AuthRequest} from '../common/security';
import {ok,parse} from '../common/http';
@Controller('reviews') @UseGuards(AuthGuard)
export class ReviewsController {
 constructor(@Inject(PrismaService) private db:PrismaService){}
 @Post() async create(@Req() req:AuthRequest,@Body() body:unknown){const p=parse(z.object({productId:z.string(),rating:z.number().int().min(1).max(5),title:z.string().min(3).max(150),body:z.string().min(10).max(3000),images:z.array(z.url()).max(5).default([])}).strict(),body);const purchased=await this.db.orderItem.findFirst({where:{productId:p.productId,order:{userId:req.user!.id,status:'DELIVERED'}}});if(!purchased)throw new BadRequestException('Reviews are available for delivered purchases');const result=await this.db.review.create({data:{...p,userId:req.user!.id,customerName:req.user!.name,verified:true}});await this.db.notification.create({data:{title:'Review awaiting moderation',body:p.title}});return ok(result);}
}
