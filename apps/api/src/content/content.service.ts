import {Inject,Injectable,NotFoundException,OnModuleDestroy} from '@nestjs/common';
import Redis from 'ioredis';
import {PrismaService} from '../common/prisma.service';
import {activeWindow,productInclude,serializeProduct} from '../catalog/catalog.service';
@Injectable()
export class ContentService implements OnModuleDestroy {
 private redis:Redis|null;
 constructor(@Inject(PrismaService) private db:PrismaService){this.redis=process.env.REDIS_URL?new Redis(process.env.REDIS_URL,{maxRetriesPerRequest:1,lazyConnect:true}):null;this.redis?.on('error',()=>{});}
 async onModuleDestroy(){await this.redis?.quit().catch(()=>{});}
 async invalidate(){await this.redis?.del('public:content').catch(()=>{});}
 async settings(){const publicKeys=['brandName','tagline','currency','currencySymbol','contactEmail','contactPhone','phone','whatsapp','address','announcement','announcementLink','announcementEnabled','announcementBackground','announcementTextColor','logo','darkLogo','lightLogo','favicon','instagram','facebook','socialLinks','freeShippingThreshold','country','timezone','seoTitle','seoDescription','ogImage','maintenanceMode','bankInstructions','bankDetails','returnDays','newsletterEnabled'];const rows=await this.db.siteSetting.findMany({where:{key:{in:publicKeys}}});return Object.fromEntries(rows.map(r=>[r.key,r.value]));}
 async content(){// Short TTL also respects scheduled campaign boundaries; CMS writes invalidate immediately.
  const cached=await this.redis?.get('public:content').catch(()=>null);if(cached)return JSON.parse(cached);
  const [settings,sections,menus,categories,collections]=await Promise.all([this.settings(),this.db.homepageSection.findMany({where:{enabled:true},include:{campaign:true},orderBy:{position:'asc'}}),this.db.menu.findMany(),this.db.category.findMany({where:{active:true},orderBy:{position:'asc'},take:100}),this.db.collection.findMany({where:{active:true},take:100})]);
  const now=new Date();const result={settings,sections:sections.filter(s=>activeWindow(s.startsAt,s.endsAt,now)&&(!s.campaign||(['ACTIVE','SCHEDULED'].includes(s.campaign.status)&&activeWindow(s.campaign.startsAt,s.campaign.endsAt,now)))).map(({campaign,...s})=>s),menus:Object.fromEntries(menus.map(m=>[m.name,m.items])),categories,collections};
  await this.redis?.set('public:content',JSON.stringify(result),'EX',5).catch(()=>{});return result;
 }
 async page(slug:string){const page=await this.db.page.findFirst({where:{slug,status:'PUBLISHED'}});if(!page)throw new NotFoundException('Page not found');return page;}
 async campaign(slug:string){const now=new Date();const c=await this.db.campaign.findFirst({where:{slug,status:{in:['ACTIVE','SCHEDULED']},startsAt:{lte:now},endsAt:{gt:now}},include:{products:{include:{product:{include:productInclude}}}}});if(!c)throw new NotFoundException('Campaign is not currently available');return{...c,status:'ACTIVE',products:c.products.filter(p=>p.product.status==='ACTIVE'&&p.product.visibility).map(p=>serializeProduct(p.product))};}
}
