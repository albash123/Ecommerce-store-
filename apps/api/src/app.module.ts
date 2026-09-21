import {Controller,Get,Inject,Module} from '@nestjs/common';
import {APP_GUARD} from '@nestjs/core';
import {ThrottlerGuard,ThrottlerModule} from '@nestjs/throttler';
import {ScheduleModule} from '@nestjs/schedule';
import {CommonModule} from './common/common.module';
import {PrismaService} from './common/prisma.service';
import {AuthModule} from './auth/auth.module';
import {CatalogModule} from './catalog/catalog.module';
import {ContentModule} from './content/content.module';
import {AccountModule} from './account/account.module';
import {CommerceModule} from './commerce/commerce.module';
import {AdminModule} from './admin/admin.module';
@Controller('health') class HealthController {constructor(@Inject(PrismaService) private db:PrismaService){} @Get() async health(){await this.db.$queryRaw`SELECT 1`;return{success:true,data:{status:'ok',database:'connected'}};}}
@Module({imports:[CommonModule,ScheduleModule.forRoot(),ThrottlerModule.forRoot([{ttl:60000,limit:120}]),AuthModule,CatalogModule,ContentModule,AccountModule,CommerceModule,AdminModule],controllers:[HealthController],providers:[{provide:APP_GUARD,useClass:ThrottlerGuard}]}) export class AppModule {}
