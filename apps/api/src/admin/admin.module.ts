import {Module} from '@nestjs/common';
import {AdminController} from './admin.controller';
import {AdminService} from './admin.service';
import {ReportsService} from './reports.service';
import {ProductsAdminService} from './products.service';
import {ContentModule} from '../content/content.module';
import {CommerceModule} from '../commerce/commerce.module';
import {MediaController} from '../media/media.controller';
@Module({imports:[ContentModule,CommerceModule],controllers:[MediaController,AdminController],providers:[AdminService,ReportsService,ProductsAdminService]}) export class AdminModule {}
