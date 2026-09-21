import {Module} from '@nestjs/common';
import {AccountController} from './account.controller';
import {ReviewsController} from './reviews.controller';
@Module({controllers:[AccountController,ReviewsController]}) export class AccountModule {}
