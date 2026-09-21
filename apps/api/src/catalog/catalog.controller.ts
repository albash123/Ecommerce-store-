import {Controller,Get,Inject,Param,Query} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {CatalogService} from './catalog.service';
import {PrismaService} from '../common/prisma.service';
import {ok} from '../common/http';
@ApiTags('Catalog') @Controller()
export class CatalogController {
 constructor(@Inject(CatalogService) private catalog:CatalogService,@Inject(PrismaService) private db:PrismaService){}
 @Get('products') async products(@Query() q:Record<string,string>){return ok(await this.catalog.list(q));}
 @Get('products/:slug') async product(@Param('slug') slug:string){return ok(await this.catalog.get(slug));}
 @Get('products/:id/reviews') async reviews(@Param('id') id:string,@Query() q:Record<string,string>){return ok(await this.catalog.reviews(id,q));}
 @Get('categories') async categories(){return ok(await this.db.category.findMany({where:{active:true},orderBy:{position:'asc'},take:100}));}
 @Get('collections') async collections(){return ok(await this.db.collection.findMany({where:{active:true},take:100}));}
 @Get('shipping') async shipping(){return ok(await this.db.shippingMethod.findMany({where:{active:true},take:100}));}
 @Get('payment-methods') paymentMethods(){return ok([{id:'COD',name:'Cash on delivery',description:'Pay when your order arrives.'},{id:'BANK_TRANSFER',name:'Bank transfer',description:'Payment instructions follow after placing your order.'},...(process.env.STRIPE_SECRET_KEY?[{id:'STRIPE',name:'Credit / debit card',description:'Secure payment with Stripe.'}]:[])]);}
}
