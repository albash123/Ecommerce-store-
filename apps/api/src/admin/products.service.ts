import {BadRequestException,Inject,Injectable} from '@nestjs/common';
import {Prisma} from '@prisma/client';
import {z} from 'zod';
import {PrismaService} from '../common/prisma.service';
import {audit} from '../common/audit';
import {productInclude,serializeProduct} from '../catalog/catalog.service';
import {productSchema} from './resources';
type ProductInput=z.infer<typeof productSchema>;
@Injectable()
export class ProductsAdminService {
 constructor(@Inject(PrismaService) private db:PrismaService){}
 async get(id:string){const p=await this.db.product.findUniqueOrThrow({where:{id},include:productInclude});const view=serializeProduct(p);return{...view,costPrice:p.costPrice,variants:view.variants.map(v=>{const raw=p.variants.find(original=>original.id===v.id)!;return{...v,price:raw.price,salePrice:raw.salePrice,stock:raw.inventory.reduce((sum,i)=>sum+i.quantity,0)};}),collectionIds:p.collections.map(c=>c.collectionId)};}
 async save(id:string|undefined,input:ProductInput,actor:string){if(input.salePrice!==null&&input.salePrice!==undefined&&input.salePrice>input.price)throw new BadRequestException('Sale price cannot exceed regular price');const keys=input.variants.map(v=>`${v.color}:${v.size}`);if(new Set(keys).size!==keys.length||new Set(input.variants.map(v=>v.sku)).size!==input.variants.length)throw new BadRequestException('Duplicate variant combination or SKU');
  const result=await this.db.$transaction(async tx=>{const{images,variants,collectionIds,sizeGuide,attributes,...fields}=input;const data={...fields,...(sizeGuide!==undefined?{sizeGuide:sizeGuide===null?Prisma.DbNull:sizeGuide as Prisma.InputJsonValue}:{}),...(attributes!==undefined?{attributes:attributes===null?Prisma.DbNull:attributes as Prisma.InputJsonValue}:{})};const before=id?await tx.product.findUniqueOrThrow({where:{id},include:productInclude}):null;
  if(id&&variants.some(v=>v.id&&!before!.variants.some(old=>old.id===v.id)))throw new BadRequestException('Variant does not belong to this product');
  const p=id?await tx.product.update({where:{id},data}):await tx.product.create({data});
  await tx.productImage.deleteMany({where:{productId:p.id}});await tx.productImage.createMany({data:images.map((img,position)=>({...img,position,productId:p.id}))});await tx.productCollection.deleteMany({where:{productId:p.id}});if(collectionIds.length)await tx.productCollection.createMany({data:[...new Set(collectionIds)].map(collectionId=>({productId:p.id,collectionId}))});
  const warehouse=await tx.warehouse.findFirstOrThrow();const retained:string[]=[];
  for(const item of variants){const{stock,id:variantId,...data}=item;const v=variantId?await tx.productVariant.update({where:{id:variantId},data}):await tx.productVariant.create({data:{...data,productId:p.id}});retained.push(v.id);const inventory=await tx.inventory.findMany({where:{variantId:v.id}});const current=inventory.reduce((s,i)=>s+i.quantity,0),reserved=inventory.reduce((s,i)=>s+i.reserved,0);if(stock<reserved)throw new BadRequestException('Stock cannot be reduced below reserved quantity');let delta=stock-current;
   if(delta>=0){if(delta){await tx.inventory.upsert({where:{variantId_warehouseId:{variantId:v.id,warehouseId:warehouse.id}},create:{variantId:v.id,warehouseId:warehouse.id,quantity:delta},update:{quantity:{increment:delta}}});await tx.inventoryTransaction.create({data:{variantId:v.id,warehouseId:warehouse.id,delta,type:'MANUAL_ADJUSTMENT',reason:'Product variant stock updated'}});}}
   else{for(const inv of inventory){const change=Math.min(-delta,inv.quantity-inv.reserved);if(!change)continue;await tx.inventory.update({where:{id:inv.id},data:{quantity:{decrement:change}}});await tx.inventoryTransaction.create({data:{variantId:v.id,warehouseId:inv.warehouseId,delta:-change,type:'MANUAL_ADJUSTMENT',reason:'Product variant stock updated'}});delta+=change;if(delta===0)break;}}
  }
  await tx.productVariant.updateMany({where:{productId:p.id,id:{notIn:retained}},data:{active:false}});await audit(tx,actor,id?'updated':'created','products',p.id,before,{...input,id:p.id});return p.id;
 },{isolationLevel:Prisma.TransactionIsolationLevel.Serializable,timeout:20000});return this.get(result);
 }
 async remove(id:string,actor:string){return this.db.$transaction(async tx=>{const p=await tx.product.findUniqueOrThrow({where:{id}});if(await tx.orderItem.count({where:{productId:id}}))throw new BadRequestException('This product has order history. Archive it instead.');if(await tx.inventoryTransaction.count({where:{variant:{productId:id}}}))throw new BadRequestException('This product has inventory history. Archive it instead.');await tx.product.delete({where:{id}});await audit(tx,actor,'deleted','products',id,p);return{deleted:true};});}
}
