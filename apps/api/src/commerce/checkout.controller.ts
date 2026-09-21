import {Body,Controller,Get,Headers,Inject,NotFoundException,Param,Post,Query,RawBodyRequest,Req} from '@nestjs/common';
import {checkoutSchema} from '@vanta/validation';
import {Request} from 'express';
import {ok,parse} from '../common/http';
import {AuthGuard,AuthRequest,hashToken} from '../common/security';
import {CheckoutService} from './checkout.service';
import {PaymentService} from './payment.service';
import {PrismaService} from '../common/prisma.service';
import {orderInclude,orderView} from './order-view';
@Controller()
export class CheckoutController {
 constructor(@Inject(CheckoutService) private checkout:CheckoutService,@Inject(AuthGuard) private auth:AuthGuard,@Inject(PaymentService) private payments:PaymentService,@Inject(PrismaService) private db:PrismaService){}
 @Post('checkout/quote') async quote(@Body() body:unknown,@Req() req:AuthRequest){return ok(await this.checkout.quote(parse(checkoutSchema,body),await this.auth.resolve(req)));}
 @Post('checkout') async create(@Body() body:unknown,@Req() req:AuthRequest){return ok(await this.checkout.create(parse(checkoutSchema,body),await this.auth.resolve(req)));}
 @Get('orders/:id') async order(@Param('id') id:string,@Query('token') token:string|undefined,@Req() req:AuthRequest){const o=await this.db.order.findUnique({where:{id},include:orderInclude});const user=await this.auth.resolve(req);if(!o||!(user?.id===o.userId||(token&&hashToken(token)===o.accessTokenHash)))throw new NotFoundException('Order not found');return ok(orderView(o));}
 @Post('payments/stripe/webhook') async webhook(@Req() req:RawBodyRequest<Request>,@Headers('stripe-signature') signature:string){return ok(await this.payments.webhook(req.rawBody||Buffer.alloc(0),signature));}
}
