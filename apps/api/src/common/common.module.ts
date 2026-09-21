import {Global,Module} from '@nestjs/common';
import {PrismaService} from './prisma.service';
import {AuthGuard,PermissionGuard} from './security';
import {EmailService} from '../communications/email.service';
@Global() @Module({providers:[PrismaService,AuthGuard,PermissionGuard,EmailService],exports:[PrismaService,AuthGuard,PermissionGuard,EmailService]})
export class CommonModule {}
