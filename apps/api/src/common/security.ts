import {CanActivate,ExecutionContext,ForbiddenException,Inject,Injectable,SetMetadata,UnauthorizedException} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {Request} from 'express';
import jwt from 'jsonwebtoken';
import {createHash,randomBytes} from 'node:crypto';
import {PrismaService} from './prisma.service';
export interface Principal {id:string;email:string;name:string;kind:string;permissions:string[];verified:boolean;sessionId:string}
export interface AuthRequest extends Request {user?:Principal}
export const hashToken=(token:string)=>createHash('sha256').update(token).digest('hex');
export const secretToken=()=>randomBytes(32).toString('hex');
export const RequirePermission=(permission:string)=>SetMetadata('permission',permission);
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(PrismaService) private db:PrismaService){}
  async resolve(req:AuthRequest){const token=req.cookies?.access_token;if(!token)return undefined;try{const payload=jwt.verify(token,process.env.JWT_SECRET!,{algorithms:['HS256']}) as {sub:string;sid:string};const session=await this.db.session.findUnique({where:{id:payload.sid},include:{user:{include:{role:true}}}});if(!session||session.revokedAt||session.expiresAt<new Date()||!session.user.active||session.userId!==payload.sub)return undefined;const u=session.user;return{id:u.id,email:u.email,name:u.name,kind:u.kind,permissions:u.role?.permissions||[],verified:u.verified,sessionId:session.id};}catch{return undefined;}}
  async canActivate(ctx:ExecutionContext){const req=ctx.switchToHttp().getRequest<AuthRequest>();req.user=await this.resolve(req);if(!req.user)throw new UnauthorizedException('Please sign in');return true;}
}
@Injectable()
export class PermissionGuard implements CanActivate {
 constructor(@Inject(Reflector) private reflector:Reflector){}
 canActivate(ctx:ExecutionContext){const req=ctx.switchToHttp().getRequest<AuthRequest>();const permission=this.reflector.getAllAndOverride<string>('permission',[ctx.getHandler(),ctx.getClass()]);if(req.user?.kind!=='ADMIN'||(permission&&!req.user.permissions.includes('*')&&!req.user.permissions.includes(permission)))throw new ForbiddenException('You do not have permission for this action');return true;}
}
