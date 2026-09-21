import {BadRequestException,Controller,Inject,Post,Req,ServiceUnavailableException,UploadedFile,UseGuards,UseInterceptors} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import {S3Client,PutObjectCommand} from '@aws-sdk/client-s3';
import sharp from 'sharp';
import {randomUUID} from 'node:crypto';
import {AuthGuard,AuthRequest,PermissionGuard,RequirePermission} from '../common/security';
import {PrismaService} from '../common/prisma.service';
import {audit} from '../common/audit';
import {ok} from '../common/http';
@Controller('admin/media') @UseGuards(AuthGuard,PermissionGuard) @RequirePermission('cms.manage')
export class MediaController {
 constructor(@Inject(PrismaService) private db:PrismaService){}
 @Post('upload') @UseInterceptors(FileInterceptor('file',{limits:{fileSize:50*1024*1024,files:1}}))
 async upload(@UploadedFile() file:Express.Multer.File|undefined,@Req() req:AuthRequest){if(!file)throw new BadRequestException('Select a file');if(!process.env.S3_BUCKET||!process.env.S3_ACCESS_KEY||!process.env.S3_SECRET_KEY||!process.env.S3_PUBLIC_URL)throw new ServiceUnavailableException('Configure S3 or R2 storage to enable file uploads');
  let buffer=file.buffer,mime=file.mimetype,extension='',thumbnail:Buffer|undefined;
  if(mime.startsWith('image/')){if(file.size>10*1024*1024)throw new BadRequestException('Images must be smaller than 10 MB');try{const meta=await sharp(buffer,{limitInputPixels:40000000}).metadata();if(!['jpeg','png','webp','avif','heif'].includes(meta.format||''))throw new Error('format');buffer=await sharp(buffer,{limitInputPixels:40000000}).rotate().resize({width:2400,withoutEnlargement:true}).webp({quality:85}).toBuffer();thumbnail=await sharp(buffer).resize({width:400,withoutEnlargement:true}).webp({quality:75}).toBuffer();mime='image/webp';extension='webp';}catch{throw new BadRequestException('Invalid or unsupported image');}}
  else if(mime==='video/mp4'&&buffer.subarray(4,8).toString()==='ftyp')extension='mp4';else if(mime==='video/webm'&&buffer.subarray(0,4).toString('hex')==='1a45dfa3')extension='webm';else throw new BadRequestException('Upload JPG, PNG, WEBP, AVIF, MP4 or WEBM');
  const client=new S3Client({region:process.env.S3_REGION||'auto',endpoint:process.env.S3_ENDPOINT||undefined,forcePathStyle:Boolean(process.env.S3_ENDPOINT),credentials:{accessKeyId:process.env.S3_ACCESS_KEY,secretAccessKey:process.env.S3_SECRET_KEY}});const key=`media/${randomUUID()}.${extension}`;await client.send(new PutObjectCommand({Bucket:process.env.S3_BUCKET,Key:key,Body:buffer,ContentType:mime,CacheControl:'public,max-age=31536000,immutable'}));const publicBase=process.env.S3_PUBLIC_URL.replace(/\/$/,'');let thumbnailUrl='';if(thumbnail){const thumbnailKey=key.replace(/\.\w+$/,'.thumb.webp');await client.send(new PutObjectCommand({Bucket:process.env.S3_BUCKET,Key:thumbnailKey,Body:thumbnail,ContentType:'image/webp'}));thumbnailUrl=`${publicBase}/${thumbnailKey}`;}const media=await this.db.media.create({data:{name:file.originalname.slice(0,200),key,url:`${publicBase}/${key}`,mime,size:buffer.length,thumbnail:thumbnailUrl}});await audit(this.db,req.user!.id,'uploaded','media',media.id,undefined,{name:media.name,mime,size:media.size});return ok(media);
 }
}
