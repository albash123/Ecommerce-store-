import {Module} from '@nestjs/common';
import {CheckoutController} from './checkout.controller';
import {CheckoutService} from './checkout.service';
import {PaymentService} from './payment.service';
import {OrdersService} from './orders.service';
@Module({providers:[CheckoutService,PaymentService,OrdersService],controllers:[CheckoutController],exports:[PaymentService,OrdersService]}) export class CommerceModule {}
