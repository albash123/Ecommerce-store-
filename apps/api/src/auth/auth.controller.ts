import {Body,Controller,Get,Inject,Post,Req,Res,UseGuards} from '@nestjs/common';
import {Throttle} from '@nestjs/throttler';
import {ApiTags} from '@nestjs/swagger';
import {Response} from 'express';
import {z} from 'zod';
import {loginSchema,passwordSchema,registerSchema} from '@vanta/validation';
import {AuthService} from './auth.service';
import {AuthGuard,AuthRequest} from '../common/security';
import {ok,parse} from '../common/http';
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
 constructor(@Inject(AuthService) private auth:AuthService){}
 @Post('register') @Throttle({default:{limit:5,ttl:60000}}) async register(@Body() body:unknown,@Res({passthrough:true}) res:Response){return ok(await this.auth.register(parse(registerSchema,body),res));}
 @Post('login') @Throttle({default:{limit:10,ttl:60000}}) async login(@Body() body:unknown,@Res({passthrough:true}) res:Response){return ok(await this.auth.login(parse(loginSchema,body),res));}
 @Post('refresh') async refresh(@Req() req:AuthRequest,@Res({passthrough:true}) res:Response){return ok(await this.auth.refresh(req.cookies?.refresh_token,res));}
 @Post('logout') async logout(@Req() req:AuthRequest,@Res({passthrough:true}) res:Response){return ok(await this.auth.logout(req.cookies?.refresh_token,res));}
 @Get('me') @UseGuards(AuthGuard) me(@Req() req:AuthRequest){return ok(req.user);}
 @Post('forgot-password') @Throttle({default:{limit:3,ttl:60000}}) async forgot(@Body() body:unknown){return ok(await this.auth.forgot(parse(z.object({email:z.email().transform(v=>v.toLowerCase())}),body).email));}
 @Post('reset-password') async reset(@Body() body:unknown){const p=parse(z.object({token:z.string().min(32),password:passwordSchema}),body);return ok(await this.auth.redeem(p.token,'RESET',p.password));}
 @Post('verify-email') async verify(@Body() body:unknown){return ok(await this.auth.redeem(parse(z.object({token:z.string().min(32)}),body).token,'VERIFY'));}
 @Post('resend-verification') @UseGuards(AuthGuard) @Throttle({default:{limit:2,ttl:60000}}) async resend(@Req() req:AuthRequest){await this.auth.sendToken(req.user!.id,'VERIFY');return ok({message:'Verification email queued'});}
}
